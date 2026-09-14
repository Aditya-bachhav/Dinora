# Dinora Frontend — Rebuilt for the Hardened Backend

A complete, functional React frontend built to match the fixed
`dinora-backend`'s actual architecture exactly — every button, page, and
API call corresponds to a real backend route with the correct auth
requirement. Built mobile-first with a real UX layer (toasts, confirm
sheets, skeleton loaders, an order progress stepper, category search) —
not just wired-up logic with bare HTML.

Every claim below was verified by running this exact frontend's network
calls against the live fixed backend (HTTP + both WebSockets), not just
written and assumed to work.

---

## Setup

```bash
cd dinora-frontend
npm install
cp .env.example .env    # set VITE_API_URL to your backend, e.g. http://localhost:8000
npm run dev
```

Requires the fixed backend running and seeded (`alembic upgrade head` then
`python -m scripts.seed`). Default seeded admin:

```
email:    admin@dinora.demo
password: dinora-demo-admin-123
```

---

## Structure and how it maps to the backend

```
src/services/api.js     One function per real backend route. Every call is
                         commented with the exact backend path/method it
                         hits — see the file for the full mapping. No
                         invented endpoints.

src/services/ws.js       Two WebSocket connections, matching
                         app/routes/websocket.py exactly:
                           connectTableSocket()   -> /ws/table?session_id=
                           connectCounterSocket() -> /ws/counter?token=
                         The counter socket refuses to even attempt a
                         connection if there's no admin token in storage,
                         since the backend will reject it anyway (403).

src/context/             AdminAuthContext (token + current admin identity,
                         backed by GET /api/auth/me) and CartContext
                         (client-side only — see note below).

src/components/
  AdminGuard.jsx          UI convenience only. Redirects to /admin/login if
                          no token is present. This is explicitly NOT the
                          real security boundary — every admin route on the
                          backend independently re-checks the token and the
                          admin's own restaurant_id on every request. See
                          the comment in this file.

src/pages/guest/          TableLanding -> Menu -> Cart -> Orders. Entry
                          point is always /t/:tableToken (the QR code's
                          opaque token), never a numeric id — GET
                          /api/tables/1 correctly 404s on this backend by
                          design; only /api/tables/tbl_xxxxx... resolves.

src/pages/admin/          Login, Register, OrdersDashboard (live, via
                          /ws/counter), Tables (create + QR), MenuManager
                          (categories/items CRUD), CounterSummary
                          (GET /api/counter totals).
```

---

## Mobile-first UX system

Everything under `src/context/ToastContext.jsx`, `ConfirmContext.jsx`, and
`src/components/ui/` is a small shared design system, not one-off styling
per page:

- **Toasts** (`ToastContext`) replace every `alert()` — success/error/info,
  auto-dismiss, tap to dismiss early. Used for every mutation across both
  guest and admin flows.
- **Confirm sheets** (`ConfirmContext`) replace every `window.confirm()` —
  a proper bottom sheet with a clear action, used before destructive
  actions (removing a cart item, deleting a menu item, logging out).
- **Bottom sheets** (`ui/Sheet.jsx`) are the primary modal pattern —
  item detail + quantity picker on the menu, add-category/add-item forms
  in the admin menu manager, the QR code view — matching how native mobile
  apps present transient content instead of desktop-style centered dialogs.
- **Skeleton loaders** (`ui/Skeleton.jsx`) replace bare "Loading…" text
  everywhere a list is being fetched — menu items, order cards, table rows.
- **Order progress stepper** (`ui/OrderProgress.jsx`) replaces a flat
  status badge on the guest Orders page with a visual
  placed → preparing → ready → served → paid track.
- **Empty states** (`ui/EmptyState.jsx`) — every list (menu search with no
  results, no orders yet, no tables yet, empty cart) has an icon, message,
  and a relevant call-to-action instead of a blank page or bare "No items."

**Mobile-first specifics:**
- `index.html` sets `viewport-fit=cover` and a `theme-color`; CSS uses
  `env(safe-area-inset-*)` throughout so content clears the notch/home
  indicator on iOS.
- All interactive targets are ≥44px (Apple's and Google's minimum touch
  target size) — steppers, nav items, buttons.
- Inputs are `font-size: 16px` minimum, which stops iOS Safari from
  auto-zooming the page on focus.
- The guest app is bottom-tab-navigated (Menu / Cart / Orders) with a
  sticky header showing which table you're at — the pattern used by every
  major food-ordering app, not a desktop nav bar shrunk down.
- The admin app is bottom-tab-navigated on phones/tablets (since counter
  staff use this on a device at the register) and switches to a sidebar +
  data table automatically at ≥720px for back-office use on a desktop.
- The category tab bar and admin filter chips are horizontally scrollable
  with `scroll-snap`-free momentum scrolling, not a dropdown.

---

## Every button and what it actually does

**Guest side**
| Button/action | Calls | Notes |
|---|---|---|
| (auto, on QR scan) | `GET /api/tables/{token}` then `POST /api/tables/{token}/sessions` | Idempotent — rescanning resumes the same active session |
| "Add" on a menu item | *(local cart only)* | No backend call — price shown is informational |
| Tapping a menu item (opens detail sheet) | *(local, reads already-fetched menu data)* | Quantity picker in the sheet uses the same cart state as the inline steppers |
| Search box / category tabs | *(local filtering of the already-fetched menu)* | No extra requests — filters what `GET /api/menu` already returned |
| "Place order" | `POST /api/orders` with `{session_id, items:[{menu_item_id, quantity}]}` | Client never sends price or table_id; both are derived/re-priced server-side |
| Orders page (auto) | `GET /api/orders/session/{id}` once, then live via `/ws/table?session_id=` | No polling |
| "Pay ₹X" (appears once an order is `served`) | `POST /pay/init` → opens Razorpay Checkout → `POST /pay/verify` | No amount sent at any step — server always charges the order's own computed total; the order is only marked paid after a verified Razorpay signature |

**Admin side**
| Button/action | Calls | Auth |
|---|---|---|
| "Sign in" | `POST /api/auth/login` | — |
| "Register" | `POST /api/auth/register` | — |
| Orders dashboard (auto) | `GET /api/orders` once, then live via `/ws/counter?token=` | Bearer token required; socket 403s without it |
| Status filter chips (All/Pending/etc.) | *(local filtering of already-fetched orders)* | No extra requests |
| Status dropdown per order | `PATCH /api/orders/{id}` with `{status}` | Bearer token, scoped to admin's own restaurant. `paid` is intentionally not an option here — use "Mark paid" instead |
| "Mark paid (counter)" | `POST /api/orders/{id}/admin-pay` | Bearer token, scoped to admin's own restaurant. Goes through the same idempotent payment service as the guest "Pay" button, not a raw status change |
| "Add table" | `POST /api/tables` with `{number}` | Bearer token; token string is server-generated, never client-supplied |
| "View QR" | `GET /api/tables/{token}/qr?guest_url=...` (returns a PNG, shown in a bottom sheet) | Bearer token; QR encodes `<frontend origin>/t/<token>`, never a numeric id |
| "Download" (in the QR sheet) | *(local — downloads the already-fetched PNG blob)* | No extra request |
| "Add category" | `POST /api/menu/categories` with `{name}` | Bearer token |
| "Add item" | `POST /api/menu/items` with `{name, category_id, price, ...}` | Bearer token |
| Availability toggle | `PATCH /api/menu/items/{id}` with `{available}` | Bearer token |
| "Delete" | `DELETE /api/menu/items/{id}` | Bearer token |
| Counter page (auto + 15s refresh) | `GET /api/counter` | Bearer token |
| "Log out" | *(local only — clears stored token)* | — |

---

## Payments — Razorpay

The guest "Pay" button opens **real Razorpay Checkout** (UPI, GPay, cards,
netbanking) — see the backend README's "Payments" section for the full
server-side flow.

- `src/services/razorpay.js` loads Razorpay's Checkout script
  (`checkout.razorpay.com/v1/checkout.js`) once, on demand, and wraps it in
  a promise.
- Tapping "Pay" runs three steps: `guestApi.initPayment()` (server creates
  a Razorpay order for the order's own total — no amount is sent from the
  client), `openRazorpayCheckout()` (Razorpay's own UI opens; this app
  never sees card numbers or UPI PINs), `guestApi.verifyPayment()` (hands
  back what Checkout returned; the backend verifies the signature itself —
  a successful-looking client callback proves nothing on its own).
- Closing the Checkout sheet without paying is handled gracefully (treated
  as a cancellation, not an error toast) via the `ondismiss` callback.
- Prices display in ₹ (INR) throughout, matching Razorpay's native
  currency and what UPI/GPay require.
- The admin "Mark paid" button is a *separate* action from the guest
  payment flow entirely — it records money collected at the counter
  (cash/POS card) and never touches Razorpay, since there's nothing to
  charge there.

**Setup:** the backend needs `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` in its
`.env` (see backend README). Without them, tapping "Pay" surfaces the
backend's `503` as a toast — clear, not a silent failure.

## What was actually tested (not just written)

Run against a live instance of the fixed backend during development:
- Full guest flow: scan → session → menu → place order → live order tracking — every call returned the expected status and shape.
- Full admin flow: login → list/create tables → QR image generation (verified as a real PNG) → categories/items CRUD → status updates.
- Both WebSocket URLs (`/ws/table?session_id=`, `/ws/counter?token=`) connect successfully with valid params.
- `/ws/counter` with no token: confirmed rejected (HTTP 403 at handshake) — matches `AdminGuard`'s assumption that the backend is the real boundary.
- Live broadcast: placed an order over HTTP while a counter socket was connected and open — the socket received the `order_created` event in real time, confirming `OrdersDashboard.jsx`'s live-update path actually works, not just the initial `GET`.
- React Router's actual matcher (not assumption) confirmed `/t/:tableToken` correctly resolves to the landing page, and `/t/:tableToken/menu|cart|orders` correctly resolve to the nested layout's children, with `tableToken` extracted correctly in both cases.
- Payment: called `guestApi.initPayment` the same way the "Pay" button does, confirmed `503` with no Razorpay keys configured (graceful, not a crash) and confirmed calling it twice before paying returns the same `razorpay_order_id` rather than creating a duplicate; confirmed `adminApi.adminMarkPaid` is rejected across restaurants and without auth, exactly like every other admin call. The signature-verification logic itself (`payment_gateway.py`) was unit-tested directly: a genuine HMAC signature verifies true, a tampered one or one replayed against a different order both correctly verify false.

## Known simplification

`POST /api/auth/register` only collects name/email/password — matching the
backend's default single-restaurant behavior when `restaurant_name` is
omitted. See the comment in `src/pages/admin/Register.jsx` and the backend
README's "Restaurant scoping" section if you need to onboard a second
restaurant.
