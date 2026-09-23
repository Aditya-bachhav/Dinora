import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import { AdminAuthProvider } from "./context/AdminAuthContext";
import { SuperAdminAuthProvider } from "./context/SuperAdminAuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./components/AdminLayout";
import GuestLayout from "./components/GuestLayout";
import SuperAdminGuard from "./components/SuperAdminGuard";
import SuperAdminLayout from "./components/SuperAdminLayout";

const TableLanding = lazy(() => import("./pages/guest/TableLanding"));
const Menu = lazy(() => import("./pages/guest/Menu"));
const Cart = lazy(() => import("./pages/guest/Cart"));
const Orders = lazy(() => import("./pages/guest/Orders"));
const Login = lazy(() => import("./pages/admin/Login"));
const Register = lazy(() => import("./pages/admin/Register"));
const Onboarding = lazy(() => import("./pages/admin/Onboarding"));
const OrdersDashboard = lazy(() => import("./pages/admin/OrdersDashboard"));
const CounterSummary = lazy(() => import("./pages/admin/CounterSummary"));
const Tables = lazy(() => import("./pages/admin/Tables"));
const MenuManager = lazy(() => import("./pages/admin/MenuManager"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const SuperAdminLogin = lazy(() => import("./pages/superadmin/SuperAdminLogin"));
const SuperAdminDashboard = lazy(() => import("./pages/superadmin/SuperAdminDashboard"));
const SuperAdminRestaurantDetail = lazy(() => import("./pages/superadmin/SuperAdminRestaurantDetail"));
const Landing = lazy(() => import("./pages/Landing"));

export default function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        {/* SuperAdminAuthProvider sits alongside AdminAuthProvider, not
            nested inside it — the two roles are peers, each with its own
            token namespace (see services/api.js), never one built on
            the other. */}
        <AdminAuthProvider>
          <SuperAdminAuthProvider>
            <CartProvider>
              <BrowserRouter>
                <Suspense fallback={<div className="route-loading" aria-busy="true"><span /></div>}>
                  <Routes>
                  <Route path="/" element={<Landing />} />

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

                  {/* Onboarding — guarded (must be logged in) but deliberately
                      NOT wrapped in AdminLayout: it's a focused wizard, not a
                      dashboard page, so it has no sidebar/nav chrome. */}
                  <Route
                    path="/admin/onboarding"
                    element={
                      <AdminGuard>
                        <Onboarding />
                      </AdminGuard>
                    }
                  />

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
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  {/* Super Admin — Dinora's own platform layer, entirely
                      separate from the restaurant admin app above (own
                      login, own guard, own token). Not linked to from
                      anywhere restaurant owners can see. */}
                  <Route path="/super-admin/login" element={<SuperAdminLogin />} />
                  <Route
                    path="/super-admin"
                    element={
                      <SuperAdminGuard>
                        <SuperAdminLayout />
                      </SuperAdminGuard>
                    }
                  >
                    <Route index element={<SuperAdminDashboard />} />
                    <Route path="restaurants/:id" element={<SuperAdminRestaurantDetail />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </CartProvider>
          </SuperAdminAuthProvider>
        </AdminAuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
