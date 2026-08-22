const browserDefault = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8000` : 'http://127.0.0.1:8000';
const API_BASE = (import.meta.env.VITE_API_URL || browserDefault).replace(/\/$/, '');

const request = async (path, options = {}) => {
  const token = localStorage.getItem('dinora-admin-token');
  const headers = {'Content-Type': 'application/json', ...(options.headers || {})};
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {...options, headers});
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.detail || data?.message || `Request failed (${res.status})`);
  return data;
};
export const api={
 health:()=>request('/api/health'), restaurant:()=>request('/api/restaurant'),
 table:t=>request(`/api/tables/${encodeURIComponent(t)}`), tables:()=>request('/api/tables'), createTable:b=>request('/api/tables',{method:'POST',body:JSON.stringify(b)}),
 menu:()=>request('/api/menu'), categories:()=>request('/api/categories'), category:s=>request(`/api/menu/categories/${encodeURIComponent(s)}`), item:s=>request(`/api/menu/items/${encodeURIComponent(s)}`),
 createCategory:b=>request('/api/categories',{method:'POST',body:JSON.stringify(b)}), createItem:b=>request('/api/menu/items',{method:'POST',body:JSON.stringify(b)}), updateItem:(id,b)=>request(`/api/menu/items/${id}`,{method:'PATCH',body:JSON.stringify(b)}), deleteItem:id=>request(`/api/menu/items/${id}`,{method:'DELETE'}),
 orders:()=>request('/api/orders'), ordersForSession:id=>request(`/api/orders/session/${encodeURIComponent(id)}`), order:id=>request(`/api/orders/${id}`), createOrder:b=>request('/api/orders',{method:'POST',body:JSON.stringify(b)}), updateOrder:(id,b)=>request(`/api/orders/${id}`,{method:'PATCH',body:JSON.stringify(b)}),
 counter:()=>request('/api/counter'), checkout:b=>request('/api/payment/checkout',{method:'POST',body:JSON.stringify(b)}),
 login:b=>request('/api/auth/login',{method:'POST',body:JSON.stringify(b)}), register:b=>request('/api/auth/register',{method:'POST',body:JSON.stringify(b)}), me:()=>request('/api/auth/me')
};
export const API_BASE_URL = API_BASE;
