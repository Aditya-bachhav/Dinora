// Thin REST client. Every function here maps 1:1 to a real backend route —
// see dinora-backend/app/main.py for the mount list and each routes/*.py
// for the exact contract. Nothing here invents an endpoint that doesn't exist.

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const ADMIN_TOKEN_KEY = "dinora_admin_token";
const SUPER_ADMIN_TOKEN_KEY = "dinora_super_admin_token";
const SESSION_KEY_PREFIX = "dinora_session_"; // + table token -> session_id

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// Super admin (Dinora platform operator) auth is stored under a completely
// separate key from the restaurant admin token, in its own namespace, so
// being logged in as one never implies or leaks into the other.
export function getSuperAdminToken() {
  return localStorage.getItem(SUPER_ADMIN_TOKEN_KEY) || "";
}

export function setSuperAdminToken(token) {
  if (token) localStorage.setItem(SUPER_ADMIN_TOKEN_KEY, token);
}

export function clearSuperAdminToken() {
  localStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
}

export function getStoredSessionId(tableToken) {
  return localStorage.getItem(SESSION_KEY_PREFIX + tableToken) || "";
}

export function setStoredSessionId(tableToken, sessionId) {
  localStorage.setItem(SESSION_KEY_PREFIX + tableToken, sessionId);
}

const ONBOARDING_DONE_PREFIX = "dinora_onboarded_"; // + admin id -> "1"

// Onboarding completion is tracked per-admin-id (not globally) so a shared
// device logging into a second admin account doesn't inherit the first
// admin's "already onboarded" state. This is a UI convenience only — an
// admin can always reach /admin/settings directly regardless of this flag,
// so skipping onboarding never locks anyone out of configuring payments
// or adding tables later.
export function isOnboardingComplete(adminId) {
  if (!adminId) return true; // no admin loaded yet — don't force a redirect before we know who they are
  return localStorage.getItem(ONBOARDING_DONE_PREFIX + adminId) === "1";
}

export function markOnboardingComplete(adminId) {
  if (!adminId) return;
  localStorage.setItem(ONBOARDING_DONE_PREFIX + adminId, "1");
}

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function normalizeErrorDetail(detail) {
  if (!detail) return "";
  if (typeof detail === "string") return detail;
  // FastAPI/Pydantic validation errors: array of {type, loc, msg, ...}.
  // Join every message into one readable sentence rather than rendering
  // the raw objects.
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (typeof d === "string" ? d : d?.msg))
      .filter(Boolean)
      .join(" ");
  }
  if (typeof detail === "object" && detail.msg) return detail.msg;
  return "";
}

async function request(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    // auth === true (or "admin") uses the restaurant admin token;
    // auth === "super_admin" uses the completely separate platform token.
    // These are never interchangeable — see routes/super_admin.py.
    const token = auth === "super_admin" ? getSuperAdminToken() : getAdminToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      `Could not reach the server at ${API_BASE_URL}. Is the backend running?`,
      0,
      null
    );
  }

  // Auth expired/invalid — surface a specific error so the UI can redirect to login.
  if (res.status === 401 && auth) {
    if (auth === "super_admin") clearSuperAdminToken();
    else clearAdminToken();
  }

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { detail: text };
    }
  }

  if (!res.ok) {
    // FastAPI's 422 validation errors return `detail` as an ARRAY of
    // {type, loc, msg, ...} objects, not a string — every other error
    // shape (401, 404, 409, custom HTTPExceptions) returns a plain string.
    // Rendering the array shape directly in JSX crashes the page (React
    // error #31: "objects are not valid as a react child"), which is
    // exactly what happened here — always normalize to a readable string.
    const detail = normalizeErrorDetail(payload?.detail) || res.statusText || "Request failed";
    throw new ApiError(detail, res.status, detail);
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Auth (POST /api/auth/register, /login, GET /me)
// ---------------------------------------------------------------------------
export const authApi = {
  // restaurant_name: optional per backend contract — when supplied, a new
  // restaurant is created for this admin; when omitted, they're attached
  // to the sole existing restaurant. The onboarding flow always supplies
  // it now, since every admin arriving via onboarding is setting up their
  // own restaurant, not joining an existing single-tenant deployment.
  register: (name, email, password, restaurantName) =>
    request("/api/auth/register", {
      method: "POST",
      body: { name, email, password, restaurant_name: restaurantName },
    }),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/api/auth/me", { auth: true }),
};

// ---------------------------------------------------------------------------
// Guest flow: tables, sessions, menu, orders
// ---------------------------------------------------------------------------
export const guestApi = {
  // GET /api/tables/{table_token} — resolve by TOKEN, never numeric id
  getTable: (tableToken) => request(`/api/tables/${encodeURIComponent(tableToken)}`),

  // POST /api/tables/{table_token}/sessions — idempotent: same QR scan resumes the active session
  startSession: (tableToken) =>
    request(`/api/tables/${encodeURIComponent(tableToken)}/sessions`, { method: "POST" }),

  // GET /api/sessions/{session_id} — verify a stored session is still active
  getSession: (sessionId) => request(`/api/sessions/${encodeURIComponent(sessionId)}`),

  // POST /api/sessions/{session_id}/close
  closeSession: (sessionId) =>
    request(`/api/sessions/${encodeURIComponent(sessionId)}/close`, { method: "POST" }),

  // GET /api/menu?session_id=... — derives the restaurant from the guest's
  // active table session, so multi-restaurant deployments stay tenant-safe.
  getMenu: (sessionId) =>
    request(`/api/menu?session_id=${encodeURIComponent(sessionId)}`),

  // POST /api/orders — body: { session_id, items: [{menu_item_id, quantity}] }
  // Price is always computed server-side; client never sends totals.
  placeOrder: (sessionId, items) =>
    request("/api/orders", {
      method: "POST",
      body: {
        session_id: sessionId,
        items: items.map((i) => ({ menu_item_id: i.menu_item_id, quantity: i.quantity })),
      },
    }),

  // GET /api/orders/session/{session_id}
  listOrdersForSession: (sessionId) =>
    request(`/api/orders/session/${encodeURIComponent(sessionId)}`),

  // GET /api/orders/{order_id}
  getOrder: (orderId) => request(`/api/orders/${orderId}`),

  // POST /api/orders/{order_id}/pay/init — body: { session_id } only, no
  // amount. Amount charged is always the order's own server-computed
  // total_amount. Returns everything needed to open Razorpay Checkout.
  // Idempotent: calling this again before paying reuses the same
  // Razorpay order rather than creating a new one.
  initPayment: (orderId, sessionId) =>
    request(`/api/orders/${orderId}/pay/init`, { method: "POST", body: { session_id: sessionId } }),

  // POST /api/orders/{order_id}/pay/verify — sends back what Razorpay
  // Checkout returned on success. The backend verifies the HMAC signature
  // itself; nothing here is trusted just because Checkout said "success".
  verifyPayment: (orderId, sessionId, razorpayResponse) =>
    request(`/api/orders/${orderId}/pay/verify`, {
      method: "POST",
      body: {
        session_id: sessionId,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      },
    }),

  // GET /api/orders/{order_id}/pay?session_id=... — returns {status:"unpaid"}
  // if nothing's been attempted yet, or the payment record otherwise.
  getPaymentStatus: (orderId, sessionId) =>
    request(`/api/orders/${orderId}/pay?session_id=${encodeURIComponent(sessionId)}`),
};

// ---------------------------------------------------------------------------
// Admin flow — every call here requires a bearer token (auth: true).
// The backend independently enforces this; auth:true here just means we
// attach the header, not that we're trusting the client.
// ---------------------------------------------------------------------------
export const adminApi = {
  // GET /api/restaurant?restaurant_id=... — this admin's own restaurant
  // details (name, location). The endpoint itself is unauthenticated
  // (guest-facing, resolved by restaurant_id), but the admin already
  // knows their own restaurant_id from /me — this just reuses that
  // public lookup rather than needing a separate authenticated endpoint.
  getMyRestaurant: (restaurantId) => request(`/api/restaurant?restaurant_id=${restaurantId}`),

  // GET /api/restaurant/profile — MY restaurant's business profile (crew
  // size, restaurant type, seating capacity) plus whether it's been filled
  // in yet. Collected during onboarding; editable again from Settings.
  getRestaurantProfile: () => request("/api/restaurant/profile", { auth: true }),

  // PUT /api/restaurant/profile — body: { crew_size, restaurant_type, seating_capacity }.
  setRestaurantProfile: (crewSize, restaurantType, seatingCapacity) =>
    request("/api/restaurant/profile", {
      method: "PUT",
      auth: true,
      body: {
        crew_size: crewSize,
        restaurant_type: restaurantType || null,
        seating_capacity: seatingCapacity || null,
      },
    }),

  // GET /api/orders — orders for MY restaurant only
  listOrders: () => request("/api/orders", { auth: true }),

  // PATCH /api/orders/{id} — body: { status }
  updateOrderStatus: (orderId, status) =>
    request(`/api/orders/${orderId}`, { method: "PATCH", auth: true, body: { status } }),

  // POST /api/orders/{id}/admin-pay — records payment taken at the counter
  // (cash/card via the restaurant's own POS), scoped to MY restaurant only.
  // Same idempotency and server-computed-amount guarantees as the guest path.
  adminMarkPaid: (orderId) => request(`/api/orders/${orderId}/admin-pay`, { method: "POST", auth: true }),

  // GET /api/tables — MY restaurant's tables
  listTables: () => request("/api/tables", { auth: true }),

  // POST /api/tables — body: { number }
  createTable: (number) =>
    request("/api/tables", { method: "POST", auth: true, body: { number } }),

  // GET /api/tables/{token}/qr?guest_url=... — returns a PNG (blob), not JSON
  tableQrUrl: (tableToken, guestUrl) => {
    const params = new URLSearchParams({ guest_url: guestUrl });
    return `${API_BASE_URL}/api/tables/${encodeURIComponent(tableToken)}/qr?${params.toString()}`;
  },
  fetchTableQrBlob: async (tableToken, guestUrl) => {
    const token = getAdminToken();
    const params = new URLSearchParams({ guest_url: guestUrl });
    const res = await fetch(
      `${API_BASE_URL}/api/tables/${encodeURIComponent(tableToken)}/qr?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new ApiError("Could not generate QR code", res.status, null);
    return res.blob();
  },

  // GET /api/menu/categories — categories for the authenticated admin's restaurant
  listCategories: () => request("/api/menu/categories", { auth: true }),

  // POST /api/menu/categories — body: { name, slug? }
  createCategory: (name) =>
    request("/api/menu/categories", { method: "POST", auth: true, body: { name } }),

  // POST /api/menu/items — body: { name, category_id, price, description?, image_url?, available? }
  createMenuItem: (payload) =>
    request("/api/menu/items", { method: "POST", auth: true, body: payload }),

  // PATCH /api/menu/items/{id} — any subset of fields
  updateMenuItem: (itemId, changes) =>
    request(`/api/menu/items/${itemId}`, { method: "PATCH", auth: true, body: changes }),

  // DELETE /api/menu/items/{id}
  deleteMenuItem: (itemId) =>
    request(`/api/menu/items/${itemId}`, { method: "DELETE", auth: true }),

  // GET /api/counter — order-status totals for MY restaurant
  getCounterTotals: () => request("/api/counter", { auth: true }),

  // GET /api/restaurant/payment-settings — whether THIS restaurant has its
  // own Razorpay credentials configured. Never returns the secret, only
  // whether one is set and the (public) key_id.
  getPaymentSettings: () => request("/api/restaurant/payment-settings", { auth: true }),

  // PUT /api/restaurant/payment-settings — body: { razorpay_key_id, razorpay_key_secret }.
  // Sets THIS restaurant's own Razorpay account so payments settle to
  // their bank, not a shared platform account. The secret is encrypted
  // server-side and is never returned by any endpoint once set.
  setPaymentSettings: (razorpayKeyId, razorpayKeySecret) =>
    request("/api/restaurant/payment-settings", {
      method: "PUT",
      auth: true,
      body: { razorpay_key_id: razorpayKeyId, razorpay_key_secret: razorpayKeySecret },
    }),

  // DELETE /api/restaurant/payment-settings — reverts to the platform
  // fallback credentials (if any are configured) rather than turning
  // payments off entirely.
  clearPaymentSettings: () => request("/api/restaurant/payment-settings", { method: "DELETE", auth: true }),
};

// ---------------------------------------------------------------------------
// Super Admin (Dinora platform operators — POST /api/super-admin/*)
// Completely separate token namespace from adminApi above — see
// getSuperAdminToken/setSuperAdminToken and routes/super_admin.py.
// ---------------------------------------------------------------------------
export const superAdminApi = {
  login: (email, password) =>
    request("/api/super-admin/login", { method: "POST", body: { email, password } }),

  me: () => request("/api/super-admin/me", { auth: "super_admin" }),

  // GET /api/super-admin/restaurants — every tenant, with owner + crew
  // size + status, for the platform dashboard.
  listRestaurants: () => request("/api/super-admin/restaurants", { auth: "super_admin" }),

  getRestaurant: (id) => request(`/api/super-admin/restaurants/${id}`, { auth: "super_admin" }),

  // PATCH /api/super-admin/restaurants/{id} — body: { is_active }. The
  // only mutation a super admin can make to a tenant: suspend/reinstate.
  setRestaurantActive: (id, isActive) =>
    request(`/api/super-admin/restaurants/${id}`, {
      method: "PATCH",
      auth: "super_admin",
      body: { is_active: isActive },
    }),
};

export { API_BASE_URL, ApiError };
