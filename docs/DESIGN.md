# Dinora — Design & UX Direction

This document exists to get everyone (design, frontend, and whoever reviews
screens before they ship) aligned on **one clear interface direction**
before more UI work happens. It's written against what actually exists in
the codebase today — not a wishlist — so it can be used to (a) evaluate
new screens against a real standard and (b) find and close the gaps that
already exist.

---

## 1. Where things stand right now

Dinora has two genuinely different audiences using two genuinely different
surfaces, and they're currently at two different levels of visual
maturity:

| Surface | State | Notes |
|---|---|---|
| **Guest flow** (table confirm → menu → cart → orders → pay) | Has a real, deliberate design system applied | Warm cream background, burgundy actions, DM Serif Display / Satoshi / Plus Jakarta Sans, moderate radii, dark header. This is the reference quality bar. |
| **Admin flow** (login, register, orders, tables, menu manager, counter) | Partially applied, and **internally inconsistent** | Most admin pages use the shared `index.css` token system. `Login.jsx` was built as a one-off with its own scoped `<style>` block and its own copies of the same tokens — it looks similar but is not the same system, and will drift the moment the shared tokens change and this file doesn't. |

**The single biggest UX problem today is not any one screen — it's this
inconsistency.** An admin logging in sees one visual language; the
dashboard they land on afterward is a different (older, more generic)
one. That seam is the first thing to close, before adding anything new.

---

## 2. Product identity (already decided — restated here so it's written down once)

- **Warm, modern, refined, food-oriented without being a restaurant
  cliché.** No brown-heavy palette, no rustic/café textures, no stock
  food-icon soup, no glassmorphism, no heavy shadows, no bubble-rounded
  UI.
- **Color** — burgundy `#702632` is the only dominant brand color.
  Terracotta `#C96A4A` supports it. Yellow `#F5D547` is a rare accent, not
  a UI workhorse. Roughly 90% neutral / 7% primary / 2% secondary / 1%
  accent. If a screen has yellow anywhere but a single small highlight,
  that's a deviation worth catching in review.
- **Type — three faces, three jobs, never overlapping:**
  - `DM Serif Display` — the wordmark and rare expressive headline
    moments only. If it shows up on a form label or a button, that's
    wrong.
  - `Satoshi` — section titles, screen headings, anywhere the product's
    personality should read through.
  - `Plus Jakarta Sans` — everything functional: labels, inputs,
    buttons, prices, admin tables, body copy. This should be ~80% of the
    text on any given screen.
- **Geometry** — 4px base spacing unit; radii step from 6px (small
  elements) up to 24px (sheets), never bubble-rounded; 44px minimum touch
  target, 48px preferred; shadows minimal, used to lift a surface
  slightly, never to fake depth.
- **Mobile is the source of truth.** Every screen is designed at
  360–430px width first. Desktop is a *scale-up* of the mobile layout
  (wider margins, a sidebar where a bottom nav was), never a separate
  design.

---

## 3. Information architecture — what actually exists

```
Guest (no login — identity is the table token in the URL)
  /t/:token              → "You're at table N, correct table?" confirm screen
  /t/:token/menu         → browse, search, category filter, chef's picks
  /t/:token/cart         → review + place order
  /t/:token/orders       → live status per order, pay when ready

Admin (JWT login, scoped to one restaurant)
  /admin/login
  /admin/register
  /admin/orders          → live order queue, status + payment actions
  /admin/counter         → aggregate status counts
  /admin/tables          → create tables, view/download QR codes
  /admin/menu            → categories + items CRUD
```

**Gap found while writing this doc:** the backend now supports
per-restaurant Razorpay credentials (`GET/PUT/DELETE
/api/restaurant/payment-settings`), but there is **no admin screen for
it yet**. Until one exists, a restaurant has no way to actually enter
their own Razorpay keys — this is the next screen to design, not an
afterthought. See §6.

---

## 4. Guest flow — what's working, use as the reference

The guest flow is the good example. Specifically:

- **One decision per screen.** The confirm screen asks exactly one thing
  ("correct table?"). It doesn't also show the menu, or ask for
  anything else.
- **The cart total is always one tap away**, never buried — the summary
  bar is persistent once the cart is non-empty.
- **Status is shown as a journey, not a label.** `OrderProgress` renders
  placed → preparing → ready → served → paid as a line, not a badge —
  a guest can see how far along they are at a glance, which is the whole
  point of the live-tracking feature existing at all.
- **Payment only appears when it's actionable** (`served` status) —
  it's not a button sitting there doing nothing for ten minutes.

**Keep doing this.** Any new guest screen should pass the same test:
*one clear job, one obvious next action, status shown as progress, not
as a static fact.*

---

## 5. Admin flow — the actual UX problems to fix

This is the part that needs real attention, in priority order.

### 5.1 Visual inconsistency (see §1) — fix first
Bring `Login.jsx` back onto the shared token system, or — if the
standalone version is preferred for some reason — promote its
improvements *into* the shared system and delete the duplicate. Right
now there are two sources of truth for what a "Dinora input field" looks
like, and that will only get worse.

### 5.2 The core operational problem: **a cook cannot use this app while cooking**
This is a flaw in the idea, not the styling, and it deserves to be named
plainly: the admin dashboard is one interface for two very different
jobs — a manager doing bookkeeping at a desk, and a cook standing over a
stove with wet or floured hands. Right now both get the identical `/admin/orders`
screen: full order details, payment controls, a status dropdown that
needs a precise tap. None of that is usable mid-cook.

What a kitchen actually needs is different in every dimension:
- **No precision taps.** A cook's hands are occupied or dirty. Targets
  need to be enormous — closer to 80–96px than the standard 44–48px —
  and forgiving of an imprecise or gloved tap.
- **No reading required at a glance.** Item name, quantity, table number,
  nothing else. No prices, no payment status, no menu management sharing
  the same screen.
- **An audible or vibrating alert on a new order**, not just a visual
  toast — the cook is not looking at the screen when an order comes in.
- **The cook drives the status, not a clock.** "Start" and "Done" are
  the only two actions a kitchen view needs — two states the cook
  actively sets, not a timer guessing how the kitchen is doing.

**Recommendation:** a dedicated `/admin/kitchen` view (or a "Kitchen
mode" toggle on `/admin/orders` that strips everything down), designed
as its own thing rather than a cramped subset of the manager dashboard.
This is worth treating as its own screen in whatever comes after this
document, not squeezed into the existing Orders page redesign.

### 5.3 Payment settings has no screen
Concretely: an admin needs a form with two fields (`Razorpay Key ID`,
`Razorpay Key Secret`), a save action, a way to see the *key ID* they've
already saved (never the secret — the backend never returns it once
set, and the UI must not try to work around that), and a clear "remove"
action that explains it reverts to platform-default payments rather than
turning payments off entirely. This is a settings-page problem, not a
navigation problem — it can hang off Tables or Menu as a new tab, or get
its own `/admin/settings`.

### 5.4 Desktop admin is a scaled-up mobile layout today — confirm that's actually right for this one
Every other screen in this doc assumes mobile-first-then-scale. The
admin dashboard is the one place worth questioning that reflexively: a
restaurant manager doing end-of-day reconciliation is plausibly on a
laptop, not a phone, and might genuinely want a wider, denser table view
(more columns visible, less card-stacking) rather than a wide version of
the phone layout. Worth a deliberate decision here rather than
defaulting to "scale up the mobile design," which is otherwise the right
default everywhere else in this doc.

---

## 6. Immediate next screens to design (in order)

1. **Fix `Login.jsx`'s token fragmentation** (§5.1) — not a new screen,
   but blocks trusting anything else looks consistent.
2. **Payment settings screen** (§5.3) — a real feature with zero UI
   right now; a restaurant literally cannot configure their own payment
   account without one.
3. **Kitchen view** (§5.2) — the idea-level flaw from this conversation's
   original question. Highest product impact of anything in this list;
   also the most different from anything that exists today, so it
   deserves its own design pass rather than a quick patch on Orders.
4. **Admin desktop layout decision** (§5.4) — a decision to make
   deliberately, not by default, before more admin screens get built
   assuming one answer or the other.

---

## 7. How to use this doc

Before shipping a new or redesigned screen, check it against:
- Does it use the shared token system, or does it invent its own?
- Does it use all three typefaces in their assigned roles, and nowhere
  else?
- Is color usage still roughly 90/7/2/1?
- Is there exactly one primary action visible at a time?
- If it's an admin screen: who is actually using this, under what
  physical conditions, and does the design assume they're free to look
  at and carefully tap a screen? (For the kitchen specifically: they are
  not.)

If a screen fails one of these, that's the conversation to have before
merging it — not after.
