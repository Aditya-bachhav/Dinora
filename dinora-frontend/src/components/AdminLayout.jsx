import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useConfirm } from "../context/ConfirmContext";
import { 
  IconOrders, 
  IconCounter, 
  IconTable, 
  IconMenu, 
  IconSettings, 
  IconLogout, 
  IconStore 
} from "./ui/Icons";
import { Button } from "./ui/button";

const DESKTOP_NAV_WORKSPACE = [
  { to: "/admin/overview", Icon: IconStore, label: "Overview" },
  { to: "/admin/orders", Icon: IconOrders, label: "Orders" },
  { to: "/admin/counter", Icon: IconCounter, label: "Counter" },
];

const DESKTOP_NAV_MANAGEMENT = [
  { to: "/admin/tables", Icon: IconTable, label: "Tables" },
  { to: "/admin/menu", Icon: IconMenu, label: "Menu" },
  { to: "/admin/settings", Icon: IconSettings, label: "Settings" },
];

const MOBILE_BOTTOM_TABS = [
  { to: "/admin/overview", Icon: IconStore, label: "Overview" },
  { to: "/admin/orders", Icon: IconOrders, label: "Orders" },
  { to: "/admin/counter", Icon: IconCounter, label: "Counter" },
  { to: "/admin/menu", Icon: IconMenu, label: "Menu" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    const ok = await confirm("You'll need to sign in again to manage this restaurant.", {
      title: "Log out?",
    });
    if (!ok) return;
    setMobileMenuOpen(false);
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-background text-foreground overflow-hidden font-sans">
      
      {/* =========================================
          DESKTOP SIDEBAR 
          ========================================= */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shrink-0 select-none">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5 bg-sidebar">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-sidebar-primary/10 border border-sidebar-border">
            <img 
              className="h-5 w-5 object-contain" 
              src="https://res.cloudinary.com/dtczjdk8l/image/upload/v1790181227/logowithoutbg.png" 
              alt="Dinora Logo" 
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <strong className="text-sm font-extrabold tracking-tight truncate text-sidebar-foreground">Dinora</strong>
            <span className="text-[10px] font-bold tracking-wider text-sidebar-foreground/60 uppercase truncate">Restaurant Admin</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          <div>
            <div className="mb-2 px-3 text-[10px] font-extrabold tracking-widest text-sidebar-foreground/50 uppercase">
              Workspace
            </div>
            <div className="flex flex-col gap-1">
              {DESKTOP_NAV_WORKSPACE.map(({ to, Icon, label }) => (
                <NavLink 
                  key={to} 
                  to={to} 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all border-l-2 ${
                    isActive 
                      ? "border-sidebar-primary bg-sidebar-accent text-sidebar-primary shadow-xs" 
                      : "border-transparent text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                    <Icon />
                  </span>
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 px-3 text-[10px] font-extrabold tracking-widest text-sidebar-foreground/50 uppercase">
              Management
            </div>
            <div className="flex flex-col gap-1">
              {DESKTOP_NAV_MANAGEMENT.map(({ to, Icon, label }) => (
                <NavLink 
                  key={to} 
                  to={to} 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all border-l-2 ${
                    isActive 
                      ? "border-sidebar-primary bg-sidebar-accent text-sidebar-primary shadow-xs" 
                      : "border-transparent text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                    <Icon />
                  </span>
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-3 border-t border-sidebar-border p-4 bg-sidebar">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-sidebar-border bg-sidebar-primary/10 text-sidebar-primary font-extrabold text-xs">
            {initials(admin?.name)}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            <strong className="truncate text-xs font-bold text-sidebar-foreground">
              {admin?.name || "Loading…"}
            </strong>
            <span className="truncate text-[10px] font-medium text-sidebar-foreground/60">
              {admin?.email}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0 h-8 w-8 rounded-none text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors" 
            onClick={handleLogout} 
            title="Log out"
          >
            <span className="flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
              <IconLogout />
            </span>
          </Button>
        </div>
      </aside>

      {/* =========================================
          MOBILE TOP BAR 
          ========================================= */}
      <header className="flex md:hidden h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center border border-border bg-muted/30">
            <img 
              className="h-4 w-4 object-contain" 
              src="https://res.cloudinary.com/dtczjdk8l/image/upload/v1790181227/logowithoutbg.png" 
              alt="Dinora Logo" 
            />
          </div>
          <strong className="text-sm font-extrabold tracking-tight">Dinora</strong>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2 border border-border px-2.5 py-1 text-xs font-bold bg-muted/30 hover:bg-muted active:scale-95 transition-all"
        >
          <span className="w-5 h-5 flex items-center justify-center border border-border bg-background text-[10px] font-bold">
            {initials(admin?.name)}
          </span>
          <span className="uppercase tracking-wider text-[10px]">More</span>
        </button>
      </header>

      {/* =========================================
          MAIN CONTENT AREA 
          ========================================= */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* =========================================
          MOBILE BOTTOM TABS (4 ITEMS) 
          ========================================= */}
      <nav className="grid grid-cols-4 md:hidden shrink-0 h-16 border-t border-border bg-background z-20">
        {MOBILE_BOTTOM_TABS.map(({ to, Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 h-full border-t-2 transition-colors ${
              isActive 
                ? "border-primary text-primary font-bold bg-primary/5" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
              <Icon />
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-wider truncate max-w-full px-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* =========================================
          MOBILE "MORE" SLIDE-OVER DRAWER 
          ========================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs h-full bg-background border-l border-border shadow-2xl flex flex-col justify-between z-10 p-5 space-y-6 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 flex items-center justify-center border border-border bg-primary/10 text-primary font-extrabold text-xs">
                    {initials(admin?.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{admin?.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{admin?.email}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-7 h-7 border border-border flex items-center justify-center text-xs font-bold hover:bg-muted"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-1">
                  Management & Setup
                </div>
                <div className="flex flex-col gap-1">
                  <NavLink 
                    to="/admin/tables" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 p-3 text-xs font-bold border ${
                      isActive ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-4 w-4 items-center justify-center shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                      <IconTable />
                    </span>
                    Tables
                  </NavLink>
                  <NavLink 
                    to="/admin/settings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 p-3 text-xs font-bold border ${
                      isActive ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-4 w-4 items-center justify-center shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                      <IconSettings />
                    </span>
                    Settings
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <Button 
                variant="outline" 
                className="w-full rounded-none font-bold text-xs border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground" 
                onClick={handleLogout}
              >
                <span className="flex items-center gap-2 [&>svg]:h-4 [&>svg]:w-4">
                  <IconLogout /> Log out
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}