import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { guestApi } from "../services/api";
import { IconCard, IconMenu, IconOrders } from "./ui/Icons";

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
    <div className="guest-layout">
      <header className="guest-header">
        <div className="guest-header-inner">
          <div className="guest-header-title">
            <strong>{tableInfo?.restaurant?.name || "Dinora"}</strong>
            <span><i /> {tableInfo ? `Table ${tableInfo.table.number}` : "Preparing your table…"}</span>
          </div>
          <div className="guest-header-mark" aria-hidden="true">D</div>
        </div>
      </header>

      <main className="guest-content">
        <Outlet />
      </main>

      <nav className="guest-bottom-nav">
        <NavLink to={`/t/${tableToken}/menu`} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-item-icon"><IconMenu /></span>
          Menu
        </NavLink>
        <NavLink to={`/t/${tableToken}/cart`} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-item-icon"><IconCard /></span>
          Cart
          {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
        </NavLink>
        <NavLink to={`/t/${tableToken}/orders`} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-item-icon"><IconOrders /></span>
          Orders
        </NavLink>
      </nav>
    </div>
  );
}
