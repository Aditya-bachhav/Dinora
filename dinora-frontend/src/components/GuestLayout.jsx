import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { guestApi } from "../services/api";

function MenuIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function CartIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function OrdersIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8H8" />
      <path d="M16 12H8" />
      <path d="M13 16H8" />
    </svg>
  );
}

export default function GuestLayout() {
  const { tableToken } = useParams();
  const { itemCount } = useCart();
  const [tableInfo, setTableInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    guestApi
      .getTable(tableToken)
      .then((data) => !cancelled && setTableInfo(data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tableToken]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-5 h-16">
          <div className="flex flex-col text-left justify-center">
            <strong className="text-sm font-semibold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-xs">
              {tableInfo?.restaurant?.name || "Dinora"}
            </strong>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium mt-0.5">
              <i className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block shrink-0" aria-hidden="true" />
              {tableInfo ? `Table ${tableInfo.table.number}` : "Preparing your table…"}
            </span>
          </div>
          <div 
            className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm tracking-widest border border-primary/20 shadow-sm" 
            aria-hidden="true"
          >
            D
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto pb-28">
        <Outlet />
      </main>

      {/* Bottom Navigation with Icons */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/60 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)] dark:shadow-none">
        <div className="max-w-3xl mx-auto flex items-center h-16">
          {/* Menu Link */}
          <NavLink 
            to={`/t/${tableToken}/menu`} 
            className={({ isActive }) => 
              `relative flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-200 tap-highlight-transparent ${
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />}
                <MenuIcon className="w-5 h-5 transition-transform group-active:scale-95" />
                <span className={`text-[11px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                  Menu
                </span>
              </>
            )}
          </NavLink>

          {/* Cart Link */}
          <NavLink 
            to={`/t/${tableToken}/cart`} 
            className={({ isActive }) => 
              `relative flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-200 tap-highlight-transparent ${
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />}
                <div className="relative flex items-center justify-center">
                  <CartIcon className="w-5 h-5 transition-transform group-active:scale-95" />
                  {itemCount > 0 && (
                    <span className={`absolute -top-1.5 -right-3 flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full text-[9px] font-extrabold leading-none shadow-sm transition-colors ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"
                    }`}>
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                  Cart
                </span>
              </>
            )}
          </NavLink>

          {/* Orders Link */}
          <NavLink 
            to={`/t/${tableToken}/orders`} 
            className={({ isActive }) => 
              `relative flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all duration-200 tap-highlight-transparent ${
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />}
                <OrdersIcon className="w-5 h-5 transition-transform group-active:scale-95" />
                <span className={`text-[11px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                  Orders
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}