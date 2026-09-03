// Thin REST client. Every function here maps 1:1 to a real backend route —
// see dinora-backend/app/main.py for the mount list and each routes/*.py
// for the exact contract. Nothing here invents an endpoint that doesn't exist.

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const ADMIN_TOKEN_KEY = "dinora_admin_token";
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

export function getStoredSessionId(tableToken) {
  return localStorage.getItem(SESSION_KEY_PREFIX + tableToken) || "";
}

export function setStoredSessionId(tableToken, sessionId) {
  localStorage.setItem(SESSION_KEY_PREFIX + tableToken, sessionId);
}

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function request(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = getAdminToken();
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
    clearAdminToken();
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
    const detail = payload?.detail || res.statusText || "Request failed";
    throw new ApiError(detail, res.status, payload?.detail);
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Auth (POST /api/auth/register, /login, GET /me)
// ---------------------------------------------------------------------------
export const authApi = {
  register: (name, email, password) =>
    request("/api/auth/register", { method: "POST", body: { name, email, password } }),
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

  // GET /api/menu — single-restaurant auto-resolve (see backend README)
  getMenu: () => request("/api/menu"),

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

  // GET /api/menu/categories (also mirrored at /api/categories — same backend logic)
  listCategories: () => request("/api/menu/categories"),

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
};

export { API_BASE_URL, ApiError };
