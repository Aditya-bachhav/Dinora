import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSuperAdminAuth } from "../context/SuperAdminAuthContext";
import { useConfirm } from "../context/ConfirmContext";
import { IconStore, IconLogout } from "./ui/Icons";

export default function SuperAdminLayout() {
  const { superAdmin, logout } = useSuperAdminAuth();
  const confirm = useConfirm();
  const navigate = useNavigate();

  async function handleLogout() {
    const ok = await confirm("You'll need to sign in again to manage the platform.", { title: "Log out?" });
    if (!ok) return;
    logout();
    navigate("/super-admin/login", { replace: true });
  }

  return (
    <div className="superadmin-shell">
      <header className="superadmin-topbar">
        <div className="superadmin-topbar-inner">
          <div className="superadmin-brand-wrap">
            <img className="superadmin-brand-mark logo-image" src="https://res.cloudinary.com/dtczjdk8l/image/upload/v1790181227/logowithoutbg.png" alt="" />
            <div className="superadmin-brand-text">
              <span className="superadmin-brand-name">Dinora</span>
              <span className="superadmin-brand-subtitle">Platform</span>
            </div>
          </div>

          <nav className="superadmin-nav" aria-label="Super admin navigation">
            <NavLink to="/super-admin" end className={({ isActive }) => `superadmin-nav-link ${isActive ? "active" : ""}`}>
              Restaurants
            </NavLink>
          </nav>

          <div className="superadmin-userbar">
            <div className="superadmin-user-meta">
              <span className="superadmin-user-name">{superAdmin?.name || "Loading…"}</span>
              <span className="superadmin-user-role">Super admin</span>
            </div>
            <button className="superadmin-logout-btn" onClick={handleLogout} aria-label="Log out">
              <span className="icon"><IconLogout /></span>
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="superadmin-main">
        <Outlet />
      </main>
    </div>
  );
}