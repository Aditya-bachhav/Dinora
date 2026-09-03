// WebSocket client for live order events.
//
// Backend contract (app/routes/websocket.py):
//   /ws/table?session_id=...   guest, requires an active session_id
//   /ws/counter?token=...      admin, requires a valid admin JWT as a query
//                              param (browsers can't set custom headers on
//                              a WebSocket handshake, so the token can't
//                              travel as an Authorization header the way it
//                              does on normal HTTP requests)
//
// Both close with code 1008 if the identifying param is missing/invalid,
// so callers should treat 1008 as "don't bother auto-reconnecting forever".

import { getAdminToken } from "./api";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

function wsBase() {
  return API_BASE_URL.replace(/^http/, "ws");
}

/**
 * Connect to the guest's own order stream for one dining session.
 * onMessage receives the parsed {type, order} payload.
 * Returns a cleanup function.
 */
export function connectTableSocket(sessionId, onMessage, onStatusChange) {
  return connect(`${wsBase()}/ws/table?session_id=${encodeURIComponent(sessionId)}`, onMessage, onStatusChange);
}

/**
 * Connect to the admin counter stream — orders for the logged-in admin's
 * restaurant only. Requires a valid admin token; if none is present this
 * refuses to connect rather than letting the backend reject it.
 */
export function connectCounterSocket(onMessage, onStatusChange) {
  const token = getAdminToken();
  if (!token) {
    onStatusChange?.("no-token");
    return () => {};
  }
  return connect(`${wsBase()}/ws/counter?token=${encodeURIComponent(token)}`, onMessage, onStatusChange);
}

function connect(url, onMessage, onStatusChange) {
  let socket = null;
  let closedByCaller = false;
  let retryTimer = null;
  let attempt = 0;

  function open() {
    socket = new WebSocket(url);

    socket.onopen = () => {
      attempt = 0;
      onStatusChange?.("connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch {
        // Non-JSON frame — ignore rather than crash the UI.
      }
    };

    socket.onclose = (event) => {
      if (closedByCaller) return;
      onStatusChange?.("disconnected");

      // 1008 = policy violation: missing/invalid session_id or admin token.
      // Retrying won't help until the caller fixes that, so don't loop forever.
      if (event.code === 1008) {
        onStatusChange?.("rejected");
        return;
      }

      attempt += 1;
      const delay = Math.min(1000 * 2 ** attempt, 15000);
      retryTimer = setTimeout(open, delay);
    };

    socket.onerror = () => {
      // onclose fires right after; reconnect logic lives there.
    };
  }

  open();

  return () => {
    closedByCaller = true;
    if (retryTimer) clearTimeout(retryTimer);
    socket?.close();
  };
}
