import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./components/AdminLayout";
import GuestLayout from "./components/GuestLayout";

import TableLanding from "./pages/guest/TableLanding";
import Menu from "./pages/guest/Menu";
import Cart from "./pages/guest/Cart";
import Orders from "./pages/guest/Orders";

import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import OrdersDashboard from "./pages/admin/OrdersDashboard";
import CounterSummary from "./pages/admin/CounterSummary";
import Tables from "./pages/admin/Tables";
import MenuManager from "./pages/admin/MenuManager";

function Home() {
  return (
    <div className="home-page">
      <div className="home-logo">🍽️</div>
      <h1>Dinora</h1>
      <p>Scan the QR code on your table to browse the menu, order, and track your food in real time.</p>
      <p className="home-admin-link">
        Restaurant staff — <a href="/admin/login">go to the admin dashboard</a>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminAuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />

                {/* Guest flow — entry point is always a table token from a QR code.
                    TableLanding handles /t/:tableToken directly (resolves table,
                    starts/resumes session, then redirects into /menu below —
                    it deliberately does NOT share GuestLayout, since there's
                    nothing to navigate to yet before a session exists). */}
                <Route path="/t/:tableToken" element={<TableLanding />} />
                <Route path="/t/:tableToken" element={<GuestLayout />}>
                  <Route path="menu" element={<Menu />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="orders" element={<Orders />} />
                </Route>

                {/* Admin auth (no guard) */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/register" element={<Register />} />

                {/* Admin app (guarded) */}
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminLayout />
                    </AdminGuard>
                  }
                >
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route path="orders" element={<OrdersDashboard />} />
                  <Route path="counter" element={<CounterSummary />} />
                  <Route path="tables" element={<Tables />} />
                  <Route path="menu" element={<MenuManager />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AdminAuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
