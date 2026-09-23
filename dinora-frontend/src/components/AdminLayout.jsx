import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useConfirm } from "../context/ConfirmContext";
import { IconOrders, IconCounter, IconTable, IconMenu, IconSettings, IconLogout } from "./ui/Icons";

const NAV_ITEMS = [
  { to: "/admin/orders", Icon: IconOrders, label: "Orders" },
  { to: "/admin/counter", Icon: IconCounter, label: "Counter" },
  { to: "/admin/tables", Icon: IconTable, label: "Tables" },
  { to: "/admin/menu", Icon: IconMenu, label: "Menu" },
  { to: "/admin/settings", Icon: IconSettings, label: "Settings" },
];

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const confirm = useConfirm();
  const navigate = useNavigate();

  async function handleLogout() {
    const ok = await confirm("You'll need to sign in again to manage this restaurant.", {
      title: "Log out?",
    });
    if (!ok) return;
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-mark" aria-hidden="true">D</div>
          <div className="admin-sidebar-brand-text">
            <strong>Dinora</strong>
            <span>Restaurant Admin</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-sidebar-nav-label">Operations</div>
          {NAV_ITEMS.slice(0, 4).map(({ to, Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}>
              <span className="icon"><Icon /></span>
              {label}
            </NavLink>
          ))}
          <div className="admin-sidebar-nav-label">Account</div>
          {NAV_ITEMS.slice(4).map(({ to, Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}>
              <span className="icon"><Icon /></span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-avatar">{initials(admin?.name)}</div>
          <div className="admin-sidebar-user">
            <strong>{admin?.name || "Loading…"}</strong>
            <span>{admin?.email}</span>
          </div>
          <button className="admin-sidebar-logout-btn" onClick={handleLogout} aria-label="Log out">
            <span className="icon"><IconLogout /></span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-brand">
            <div className="admin-topbar-brand-mark" aria-hidden="true">D</div>
            <strong>Dinora Admin</strong>
          </div>
          <div className="admin-topbar-user">
            <span>{admin?.name}</span>
            <button className="admin-topbar-logout-btn" onClick={handleLogout} aria-label="Log out">
              <span className="icon"><IconLogout /></span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-content-kicker" aria-hidden="true">
          <span className="admin-content-kicker-dot" />
          Live workspace
        </div>
        <Outlet />
      </main>

      {/* Mobile bottom tabs */}
      <nav className="admin-bottom-nav">
        {NAV_ITEMS.map(({ to, Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `admin-bottom-nav-item ${isActive ? "active" : ""}`}>
            <span className="icon"><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
