import { useEffect, useMemo, useState } from "react";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import { connectCounterSocket } from "../../services/ws";
import { useToast } from "../../context/ToastContext";
import StatusBadge from "../../components/StatusBadge";
import StatusDropdown from "../../components/StatusDropdown";
import ConnectionStatus from "../../components/ConnectionStatus";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { OrderCardSkeleton } from "../../components/ui/Skeleton";
import { IconOrders } from "../../components/ui/Icons";

// Statuses an admin can manually set via the raw status override. "paid" is
// intentionally excluded here — marking something paid goes through the
// dedicated "Mark paid" button below, which calls the real payment flow
// (idempotent, creates a Payment record) rather than just flipping the
// status field directly.
const MANUAL_STATUSES = ["pending", "preparing", "ready", "served", "completed", "cancelled"];
const FILTERS = ["all", "pending", "preparing", "ready", "served", "paid", "completed", "cancelled"];

export default function OrdersDashboard() {
  const toast = useToast();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [updatingId, setUpdatingId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const list = await adminApi.listOrders();
        if (!cancelled) {
          setOrders(list);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err.detail || err.message || "Could not load orders");
        }
      }
    }
    load();

    // /ws/counter requires a valid admin token as a query param — see
    // services/ws.js. It only ever receives events for THIS admin's own
    // restaurant; the backend enforces that server-side.
    const disconnect = connectCounterSocket((event) => {
      if (event.type === "order_created" || event.type === "order_updated") {
        setOrders((prev) => {
          const idx = prev.findIndex((o) => o.id === event.order.id);
          if (idx === -1) {
            toast.info(`New order #${event.order.id} — table ${event.order.table_number ?? "?"}`);
            return [event.order, ...prev];
          }
          const next = [...prev];
          next[idx] = event.order;
          return next;
        });
      }
    }, setWsStatus);

    return () => {
      cancelled = true;
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleOrders = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  useEffect(() => {
    if (status !== "ready" || visibleOrders.length === 0) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-order-row]").forEach((row) => { row.style.opacity = "1"; });
      return undefined;
    }
    const animation = animate("[data-order-row]", {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(45),
      duration: 420,
      ease: "outQuart",
    });
    return () => animation.cancel();
  }, [status, visibleOrders.length, filter]);

  function getFilterCount(value) {
    if (value === "all") return orders.length;
    return orders.filter((o) => o.status === value).length;
  }

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      const updated = await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success(`Order #${orderId} → ${newStatus}`);
    } catch (err) {
      toast.error(err.detail || err.message || "Could not update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleMarkPaid(order) {
    setPayingId(order.id);
    try {
      // Goes through the real payment service — idempotent, creates a
      // Payment record, amount is always the order's own total_amount.
      await adminApi.adminMarkPaid(order.id);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "paid" } : o)));
      toast.success(`Order #${order.id} marked paid`);
    } catch (err) {
      toast.error(err.detail || err.message || "Could not record payment");
    } finally {
      setPayingId(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="admin-orders-page admin-orders-loading" aria-busy="true">
        <div className="admin-page-head">
          <div>
            <div className="orders-loading-kicker">LIVE SERVICE</div>
            <h1>Orders</h1>
            <p>Preparing your service queue…</p>
          </div>
          <div className="orders-loading-pulse" />
        </div>
        <div className="orders-summary-grid">
          {Array.from({ length: 4 }).map((_, index) => <div className="orders-summary-skeleton" key={index} />)}
        </div>
        <div className="admin-table-wrap orders-loading-table">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState icon="⚠️" title="Something went wrong" message={error} />;
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-page-head">
        <div>
          <div className="orders-page-kicker"><span /> Live order flow</div>
          <h1>Orders</h1>
          <p>Keep the floor, kitchen, and payments moving together.</p>
        </div>
        <div className="admin-page-head-actions">
          <ConnectionStatus status={wsStatus} />
        </div>
      </div>

      <div className="orders-summary-grid">
        <div className="orders-summary-card orders-summary-card-featured">
          <span className="orders-summary-label">Open orders</span>
          <strong>{orders.filter((order) => !["completed", "cancelled"].includes(order.status)).length}</strong>
          <span className="orders-summary-note">Needs attention today</span>
        </div>
        <div className="orders-summary-card">
          <span className="orders-summary-label">Preparing</span>
          <strong>{getFilterCount("preparing")}</strong>
          <span className="orders-summary-note">In the kitchen</span>
        </div>
        <div className="orders-summary-card">
          <span className="orders-summary-label">Ready to serve</span>
          <strong>{getFilterCount("ready")}</strong>
          <span className="orders-summary-note">Waiting on the floor</span>
        </div>
        <div className="orders-summary-card">
          <span className="orders-summary-label">Collected</span>
          <strong>₹{orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + Number(order.total_amount || 0), 0).toFixed(0)}</strong>
          <span className="orders-summary-note">Paid orders in view</span>
        </div>
      </div>

      <div className="orders-filter-bar">
        <div className="orders-filter-heading">
          <strong>Service queue</strong>
          <span>{visibleOrders.length} {visibleOrders.length === 1 ? "order" : "orders"}</span>
        </div>
        <div className="chip-row">
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>{getFilterCount(f)}</span>
          </button>
        ))}
        </div>
      </div>

      {visibleOrders.length === 0 ? (
        <EmptyState
          icon={<span className="icon" style={{ width: 28, height: 28 }}><IconOrders /></span>}
          title={orders.length === 0 ? "No orders yet" : "No orders match this filter"}
          message={orders.length === 0 ? "Orders will appear here as guests place them." : ""}
        />
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="admin-order-list">
            {visibleOrders.map((order) => (
              <div key={order.id} className="card admin-order-card" data-order-row>
                <div className="admin-order-card-top">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <div className="meta">Table {order.table_number ?? "—"}</div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="admin-order-items">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.quantity}× <b>{item.name}</b>
                    </div>
                  ))}
                </div>
                <div className="admin-order-total">₹{order.total_amount.toFixed(2)}</div>
                <div className="admin-order-actions">
                  <StatusDropdown
                    value={MANUAL_STATUSES.includes(order.status) ? order.status : order.status}
                    options={MANUAL_STATUSES}
                    disabled={updatingId === order.id}
                    onChange={(next) => handleStatusChange(order.id, next)}
                  />
                  {order.status !== "paid" && order.status !== "cancelled" && (
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={payingId === order.id}
                      onClick={() => handleMarkPaid(order)}
                    >
                      {payingId === order.id ? <Spinner size={14} /> : "Mark paid"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => (
                  <tr key={order.id} data-order-row>
                    <td>#{order.id}</td>
                    <td>{order.table_number ?? "—"}</td>
                    <td>
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.quantity}× {item.name}
                        </div>
                      ))}
                    </td>
                    <td>₹{order.total_amount.toFixed(2)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <StatusDropdown
                        value={order.status}
                        options={MANUAL_STATUSES}
                        disabled={updatingId === order.id}
                        onChange={(next) => handleStatusChange(order.id, next)}
                      />
                    </td>
                    <td>
                      {order.status === "paid" ? (
                        <span className="paid-note" style={{ justifyContent: "flex-start" }}>✓ Paid</span>
                      ) : order.status === "cancelled" ? (
                        "—"
                      ) : (
                        <button className="btn btn-sm btn-secondary" disabled={payingId === order.id} onClick={() => handleMarkPaid(order)}>
                          {payingId === order.id ? <Spinner size={14} /> : "Mark paid"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
