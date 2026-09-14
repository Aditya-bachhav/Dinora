# Dinora Backend — Hardened

FastAPI + PostgreSQL backend for the Dinora dine-in ordering platform.

This is an audited and repaired version of the original `dinora-backend`.
The API surface (paths, methods, response shapes) is **unchanged except
where noted in "Breaking changes"** below — the existing frontend can be
pointed at this backend with no code changes beyond your `.env`, other
than the one WebSocket change called out explicitly.

---

## What changed, and why

A full architectural audit found six real problems. Each is fixed here.

### 1. Admin authentication was missing on several endpoints
`GET/PATCH /api/orders`, `GET /api/counter`, `GET/POST /api/tables`, and the
`/ws/counter` WebSocket had **no auth check at all** — any anonymous
request could read every order in the system or rewrite an order's status
(e.g. mark it `paid`). Every admin-facing route now requires a valid admin
session via the existing `current_admin` dependency (HTTP) or an admin JWT
passed as `?token=` (WebSocket — browsers can't set custom headers on a
WebSocket handshake, so the token travels as a query param there instead).

### 2. `/api/payment/checkout` was a live, unauthenticated "pay for anything" endpoint
It let anyone mark any `order_id` as `paid` with no amount check, no
gateway integration, and no idempotency — and it was never called by the
frontend (`api.checkout()` was defined but unused). It was deleted outright
during the initial audit, then **rebuilt properly** — see "Payments" below.

### 3. Multi-tenancy was declared but not enforced
`restaurant_id` exists on `Table`, `Category`, and `MenuItem`, but almost
nothing filtered by it — `list_orders()`, `list_menu()`, and
`get_restaurant()` all operated globally, silently mixing every
restaurant's data together the moment a second restaurant existed.
`AdminUser` now has a `restaurant_id` (migration `0002`), and every
admin-facing query is scoped to the authenticated admin's own restaurant.
Verified with two independently registered admins/restaurants — see
"Restaurant scoping" below for exact behavior.

### 4. Inverted dependency: a background service reached into a route module's internals
`services/order_automation.py` imported `_advance_orders` and
`_broadcast_order` directly out of `routes/orders.py` — a background task
depending on a web-request handler's private (underscore-prefixed)
functions. Business logic has moved into a proper service layer
(`app/services/`); routes are now thin HTTP-translation layers that call
services, and `order_automation.py` calls the same service functions a
route would.

### 5. Data-layer issues
- No `relationship()` declarations anywhere — pure FK columns forced manual
  re-querying everywhere. Added across all models.
- `Order.total_amount` was `Integer` while `OrderItem.line_total`/
  `unit_price` were `Float` — a parent/child type mismatch that silently
  truncated fractional totals (e.g. `12.99` → `12`). Fixed to `Float`.

### 6. `SECRET_KEY` silently fell back to a hardcoded dev value
If the env var was missing, the app booted normally and signed every admin
JWT with a publicly-known string — the same failure mode `DATABASE_URL`
correctly guards against elsewhere in `config.py`. Now: the fallback only
applies when `DEBUG=true`; otherwise the app refuses to start.

### Also cleaned up along the way
- An entire `app/schemas/` directory of Pydantic models existed but was
  never imported by any route — every route hand-parsed
  `await request.json()` and hand-rolled validation. Schemas now match the
  real, current API contracts and are wired into every route that accepts
  a body, so FastAPI does real validation (400/422 on bad input) instead of
  ad hoc checks.
- `routes/categories.py` and `routes/menu.py` implemented **two parallel,
  independent category APIs** that could silently drift apart. Both are
  kept (for compatibility) but now call the same `menu_service` functions.
- `routes/counter.py` had a `POST ""` handler that did nothing (a static
  message, no state change, never called by the frontend). Removed.
- Password hashing was a private helper inside `routes/auth.py`; the seed
  script needed it too, so it's now a shared `app/core/security.py`.

---

## Breaking change the frontend needs

**`/ws/counter` now requires an admin token.** Previously it accepted any
connection with no authentication. The current frontend
(`src/services/ws.js`) connects with:

```js
new WebSocket(`${wsBase}/ws/counter`)
```

This will now be rejected (HTTP 403 at the handshake). Update it to:

```js
const token = localStorage.getItem('dinora_admin_token'); // or wherever the admin token is stored
new WebSocket(`${wsBase}/ws/counter?token=${encodeURIComponent(token)}`)
```

Everything else — every HTTP route's path, method, and response shape — is
unchanged, so no other frontend changes are required to get a working
system. (`/api/payment/checkout` is gone, but the frontend never called it.)

---

## Restaurant scoping — how it actually behaves

- **Guest-facing reads with no table/session context** (`GET /api/menu`,
  `GET /api/menu/categories`, `GET /api/restaurant`, `GET /api/categories`):
  today's frontend calls these with no identifying parameter at all. They
  auto-resolve to the sole existing restaurant as long as exactly one
  exists — i.e. current single-restaurant behavior is preserved exactly.
  The moment a **second** restaurant is created, these endpoints start
  returning `400` and require an explicit `?restaurant_id=` — they fail
  loudly instead of silently mixing both restaurants' menus together. See
  `app/services/restaurant_service.py`.
- **Guest-facing reads with a trust anchor** (table token, session_id):
  always resolve the restaurant from that anchor. Unaffected by how many
  restaurants exist.
- **Admin-facing everything** (`orders`, `tables`, `counter`, menu writes):
  always scoped to `current_admin().restaurant_id`. An admin can never see
  or modify another restaurant's data, full stop, regardless of how many
  restaurants exist. Verified in testing with two independently registered
  admins.
- **Admin registration** (`POST /api/auth/register`): the current
  frontend's register form sends only `name`/`email`/`password`. When
  `restaurant_name` is omitted, the new admin is attached to the sole
  existing restaurant (fails loudly if zero or more than one exists).
  Supplying `restaurant_name` creates a brand-new restaurant for that
  admin — this is how a future multi-restaurant onboarding flow would use
  the same endpoint.

---

---

## Payments

The original `/api/payment/checkout` was deleted during the security audit
(unauthenticated, unused, no amount verification). It's since been rebuilt
twice: first as an audited mock flow, and now as a **real Razorpay
integration** — actual UPI/GPay/card payments via Razorpay Checkout.

### Why Razorpay's flow is two steps, not one

Unlike a saved-card-on-file model, Razorpay requires: (1) the server
creates a Razorpay *order*, (2) the client opens Razorpay's own Checkout
UI with that order_id and the user pays via UPI/GPay/card *inside
Razorpay's interface* (this app never sees card numbers or UPI PINs), (3)
Checkout hands the client a payment_id + a signature, (4) the server
verifies that signature with the shared key secret. Only a verified
signature ever marks an order paid — a client claiming success proves
nothing on its own.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/orders/{id}/pay/init` | — (session_id in body proves ownership) | Step 1: create a Razorpay order for this order's own total |
| POST | `/api/orders/{id}/pay/verify` | — (session_id in body proves ownership) | Step 2: verify the signature Checkout returned; only this can mark the order paid |
| GET | `/api/orders/{id}/pay?session_id=` | — (session_id proves ownership) | Check payment status for your own order |
| POST | `/api/orders/{id}/admin-pay` | Admin | Record payment taken at the counter (cash/POS card) — **never touches Razorpay**, since the money already changed hands |

**What's actually fixed, compared to the original endpoint:**
- **Amount is never client-supplied, at either step.** `/pay/init` always
  reads `Order.total_amount`; `/pay/verify` has no amount field at all —
  it only carries the three identifiers Checkout returned.
- **The signature is the only source of truth.** `/pay/verify` computes
  its own HMAC-SHA256 over `razorpay_order_id|razorpay_payment_id` using
  the server's own key secret and compares it — verified directly: a
  correct signature returns `True`, a tampered one or one replayed against
  a different order both return `False`, never an exception or a silent
  pass.
- **Idempotent.** Calling `/pay/init` again before paying reuses the same
  Razorpay order instead of creating a second one. Calling `/pay/verify`
  again for an already-succeeded payment is a no-op that returns the
  existing record.
- **Ownership-scoped.** A guest can only act on an order their own
  `session_id` created (wrong `session_id` → `404`, same "don't even
  reveal it exists" pattern used everywhere else). An admin's counter-pay
  can only touch orders in their own restaurant (cross-restaurant → `404`;
  unauthenticated → `401`).
- **`Order.status` only becomes `"paid"`** after a verified signature (or
  an explicit admin counter-pay) — never as a side effect of an unrelated
  status PATCH, and never automatically from the kitchen-prep timer.

### Setup

1. Create a [Razorpay account](https://razorpay.com) — test mode needs no
   real KYC, just a signup.
2. Dashboard → Settings → API Keys → generate a **Test Mode** key pair.
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
   ```
4. That's it — no webhook setup is required for this flow (verification
   happens synchronously via the signature, not asynchronously via a
   webhook callback).

**The app boots fine with no Razorpay keys set at all** — `/pay/init`
returns a clear `503` ("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set")
instead of crashing, so a fresh checkout of this repo doesn't hard-fail
before anyone's configured a merchant account. `/admin-pay` (the
counter/cash path) works with no Razorpay setup at all, since it never
calls Razorpay.

**Currency:** defaults to INR (Razorpay's native currency, and what
UPI/GPay require). Amounts are converted to paise (`amount * 100`,
rounded) when creating the Razorpay order, per their API's smallest-unit
requirement.

**Going live:** swap the test-mode keys for live-mode keys from the same
Dashboard screen once you've completed Razorpay's activation/KYC — nothing
in the code changes, only the `.env` values.

### Frontend integration

`src/services/razorpay.js` loads Razorpay's Checkout script
(`checkout.razorpay.com/v1/checkout.js`) and wraps it in a promise. The
guest Orders page's "Pay" button calls `initPayment` → `openRazorpayCheckout`
→ `verifyPayment` in sequence — see `src/pages/guest/Orders.jsx`.

### Kitchen-timer interaction

The automatic elapsed-time status progression (`services/order_service.py`,
`advance_orders`) previously auto-advanced orders all the way to `"paid"`
and `"completed"` after ~32 seconds — a demo convenience that directly
undermined any real payment flow (an order could show `"paid"` with
nobody having paid). It now stops automatically at `"served"` and holds
there indefinitely; `"paid"` and `"completed"` only happen through the
payment flow above or an explicit admin action.

## Stack

- **FastAPI** — async HTTP + WebSocket
- **SQLAlchemy** — ORM, sync sessions, now with real `relationship()`
  navigation between models
- **Alembic** — schema migrations (only migration tool; no `create_all` at
  runtime)
- **PostgreSQL** — required in production; migrations `0002`/`0003` also run
  cleanly against SQLite (useful for local testing) via `batch_alter_table`
- **JWT** — admin authentication (PBKDF2-SHA256 password hashing,
  310,000 iterations, in `app/core/security.py`)

---

## First-time setup

```bash
cd dinora-backend

# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment — create a .env file:
cat > .env << 'EOF'
DATABASE_URL=postgresql://user:password@host:5432/dinora
SECRET_KEY=<generate a long random value, e.g. `openssl rand -hex 32`>
DEBUG=false
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
EOF

# 3. Run migrations (creates all tables, including admin_users.restaurant_id
#    and the payments table)
alembic upgrade head

# 4. Seed demo data (idempotent — safe to run multiple times).
#    Creates a restaurant, sample menu, and a demo admin account.
python -m scripts.seed

# 5. Start server
uvicorn app.main:app --reload --port 8000
```

The seed script prints the demo admin credentials it created (or reused).
By default:

```
email:    admin@dinora.demo
password: dinora-demo-admin-123
```

Override these via env vars before seeding if you don't want the default:

```bash
export DINORA_SEED_ADMIN_EMAIL="you@yourdomain.com"
export DINORA_SEED_ADMIN_PASSWORD="a-real-password"
python -m scripts.seed
```

**Local/no-Postgres testing:** `DATABASE_URL=sqlite:///./dev.db` works for
migrations, seeding, and running the server locally without standing up
Postgres. `DEBUG=true` is required in this case, or `SECRET_KEY` must still
be set explicitly (see "Also cleaned up" above).

---

## Attaching the existing frontend

1. Copy `dinora-frontend/.env.example` to `dinora-frontend/.env` and point
   `VITE_API_URL` at wherever this backend is running, e.g.:
   ```
   VITE_API_URL=http://localhost:8000
   ```
2. Apply the `/ws/counter` change described above in
   `src/services/ws.js` — this is the only required code change.
3. Everything else (`src/services/api.js`'s routes, request/response
   shapes, the guest flow, the admin flow) works against this backend
   unmodified.

---

## API summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create admin account (see registration scoping above) |
| POST | `/api/auth/login` | — | Get admin JWT |
| GET | `/api/auth/me` | Admin | Current admin identity |
| GET | `/api/tables/{token}` | — | Resolve table by QR token |
| POST | `/api/tables/{token}/sessions` | — | Start/resume dining session |
| GET | `/api/sessions/{session_id}` | — | Verify session still active |
| POST | `/api/sessions/{session_id}/close` | — | Close a session (guest-triggerable by design) |
| GET | `/api/menu` | — | Full menu — single-restaurant auto-resolve, see scoping above |
| GET | `/api/menu/categories` | — | Category list |
| GET | `/api/menu/categories/{slug}` | — | One category + its items |
| GET | `/api/menu/items/{slug}` | — | One menu item |
| GET | `/api/categories` | — | Duplicate of `/api/menu/categories`, kept for compatibility |
| POST | `/api/orders` | — | Place order (session_id + items only — price is always server-computed) |
| GET | `/api/orders/session/{id}` | — | Orders for this session |
| GET | `/api/orders/{id}` | — | Single order (optional session_id ownership check) |
| POST | `/api/orders/{id}/pay/init` | — (session_id proves ownership) | Step 1: create a Razorpay order — see "Payments" above |
| POST | `/api/orders/{id}/pay/verify` | — (session_id proves ownership) | Step 2: verify signature, mark paid — see "Payments" above |
| GET | `/api/orders/{id}/pay` | — (session_id proves ownership) | Check payment status for your own order |
| WS | `/ws/table?session_id=` | — | Live order events for this guest session |
| GET | `/api/tables` | Admin | Tables for **my** restaurant |
| POST | `/api/tables` | Admin | Create table for **my** restaurant (token generated server-side) |
| GET | `/api/tables/{token}/qr` | Admin | QR code image, must be **my** restaurant's table |
| GET | `/api/orders` | Admin | Orders for **my** restaurant only |
| PATCH | `/api/orders/{id}` | Admin | Manual status override, **my** restaurant only |
| POST | `/api/orders/{id}/admin-pay` | Admin | Record payment taken at counter — see "Payments" above |
| POST | `/api/menu/categories` | Admin | Create category in **my** restaurant |
| POST | `/api/categories` | Admin | Same as above, duplicate path |
| POST | `/api/menu/items` | Admin | Create menu item in **my** restaurant |
| PATCH | `/api/menu/items/{id}` | Admin | Update item, **my** restaurant only |
| DELETE | `/api/menu/items/{id}` | Admin | Delete item, **my** restaurant only |
| GET | `/api/counter` | Admin | Order-status totals for **my** restaurant |
| WS | `/ws/counter?token=` | Admin | Live order events for **my** restaurant only |
| GET | `/api/health` | — | Liveness check |
| GET | `/api/routes` | — | Machine-readable route manifest (see `app/main.py`) |

---

## Architecture

```
routes/        Thin HTTP layer. Parses request (via schemas/), calls one
                service function, returns its result. No business logic,
                no direct multi-step DB manipulation.

services/       All business logic. Order state transitions, pricing,
                restaurant scoping, broadcasting. Called by both routes/
                and services/order_automation.py — neither depends on the
                other's internals.

models/         SQLAlchemy models with relationship() navigation.

schemas/        Pydantic request models — actually imported and used by
                routes/ now.

websocket/      Connection manager (in-process; broadcasts to named rooms
                like "counter:<restaurant_id>" and "table:<session_id>").
                Single-instance by design — horizontal scaling across
                multiple server processes would need a shared pub/sub
                layer (e.g. Redis) added here.

core/           config (env/settings), database (session factory),
                security (password hashing, shared by auth.py and seed.py).
```

Every arrow points one direction: `routes → services → models → database`.
The WebSocket manager is only ever called from the service layer.

---

## Testing the full flow

```bash
BASE=http://localhost:8000

# 1. Login as the seeded demo admin
TOKEN=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dinora.demo","password":"dinora-demo-admin-123"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# 2. Create a table (admin, scoped to this admin's restaurant)
TABLE=$(curl -s -X POST $BASE/api/tables \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"number":1}')
TABLE_TOKEN=$(echo $TABLE | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# 3. Guest resolves the table (no auth)
curl $BASE/api/tables/$TABLE_TOKEN

# 4. Guest starts a session (no auth)
SESSION=$(curl -s -X POST $BASE/api/tables/$TABLE_TOKEN/sessions)
SESSION_ID=$(echo $SESSION | python3 -c "import sys,json;print(json.load(sys.stdin)['session_id'])")

# 5. Guest browses the menu (no auth)
curl $BASE/api/menu

# 6. Guest places an order (session_id + items only — price is server-computed)
curl -s -X POST $BASE/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SESSION_ID\",\"items\":[{\"menu_item_id\":1,\"quantity\":2}]}" \
  | python3 -m json.tool

# 7. Admin sees the order (auth required — this used to work with NO token at all)
curl $BASE/api/orders -H "Authorization: Bearer $TOKEN"

# 8. Confirm the auth fix: the same call with no token is rejected
curl -o /dev/null -w "%{http_code}\n" $BASE/api/orders   # → 401, was previously 200

# 9. Guest starts a Razorpay payment — note: no amount in the request body.
#    Requires RAZORPAY_KEY_ID/SECRET in .env; without them this returns 503.
ORDER_ID=1  # substitute the real id from step 6's response
curl -s -X POST $BASE/api/orders/$ORDER_ID/pay/init \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SESSION_ID\"}" | python3 -m json.tool

# 10. Idempotency check: init again before paying — should return the SAME
#     razorpay_order_id, not a new one
curl -s -X POST $BASE/api/orders/$ORDER_ID/pay/init \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SESSION_ID\"}" | python3 -m json.tool
```

Steps 9-10 only exercise the server-side half of the payment flow (order
creation + idempotency). Actually completing a UPI/GPay/card payment
requires Razorpay's Checkout UI, which only opens in a real browser — use
the frontend's guest Orders page to test that part end-to-end with your
test-mode credentials (Razorpay's test cards/UPI IDs are in their docs).

Every step above, plus cross-restaurant isolation between two independently
registered admins, repeated payment-init calls confirming idempotency, and
a direct unit test of the HMAC signature verification (a genuine signature
verifies true; a tampered one, or one replayed against a different order,
both correctly verify false), was run against this exact codebase during
development — not just reviewed.

---

## Known limitations (unchanged from before, documented rather than fixed)

- **WebSocket manager is in-process only.** Fine for a single server
  instance; running multiple instances behind a load balancer would need a
  shared pub/sub layer (e.g. Redis) so a broadcast from one instance
  reaches clients connected to another. See `app/websocket/manager.py`.
- **Two parallel category APIs exist** (`/api/menu/categories` and
  `/api/categories`). Both now share the same service logic so they can't
  drift, but consider picking one and deprecating the other in a future
  pass.
- **Guest-facing single-restaurant auto-resolve** (`GET /api/menu` with no
  param) is a deliberate, documented compromise to avoid a breaking
  frontend change here. A real multi-restaurant frontend should pass
  `?restaurant_id=` explicitly everywhere a table/session anchor isn't
  already available.
