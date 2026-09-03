import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useConfirm } from "../context/ConfirmContext";

const NAV_ITEMS = [
  { to: "/admin/orders", icon: "🧾", label: "Orders" },
  { to: "/admin/counter", icon: "📊", label: "Counter" },
  { to: "/admin/tables", icon: "🪑", label: "Tables" },
  { to: "/admin/menu", icon: "🍴", label: "Menu" },
];

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
        <div className="admin-brand">🍽️ Dinora Admin</div>
        {admin && (
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: -16 }}>
            {admin.name}
          </div>
        )}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-ghost sidebar-logout" onClick={handleLogout} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
          Log out
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-brand">🍽️ Dinora Admin</div>
          <div className="admin-topbar-user">
            {admin?.name}
            <button className="admin-logout-icon-btn" onClick={handleLogout} aria-label="Log out">
              ⏻
            </button>
          </div>
        </div>
      </header>

      <main className="admin-content">
        <Outlet />
      </main>

      {/* Mobile bottom tabs */}
      <nav className="admin-bottom-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
