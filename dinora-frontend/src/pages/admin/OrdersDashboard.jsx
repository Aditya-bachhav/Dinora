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
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

const MANUAL_STATUSES = ["pending", "preparing", "ready", "served", "completed", "cancelled"];
const FILTERS = ["all", "pending", "preparing", "ready", "served", "paid", "completed", "cancelled"];

// Ensures the current order status is always a valid option in the dropdown,
// preventing blank or missing dropdowns when an order status is "paid".
function getStatusOptions(currentStatus) {
  if (!currentStatus || MANUAL_STATUSES.includes(currentStatus)) {
    return MANUAL_STATUSES;
  }
  return [currentStatus, ...MANUAL_STATUSES];
}

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
      document.querySelectorAll("[data-order-row]").forEach((row) => {
        row.style.opacity = "1";
      });
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
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-background text-foreground" aria-busy="true">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 sm:pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Orders</h1>
            <p className="text-sm text-muted-foreground font-medium">Preparing your service queue…</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 bg-muted/40 animate-pulse border border-border" />
          ))}
        </div>
        <div className="space-y-4">
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
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-background text-foreground overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground font-medium">Keep the floor, kitchen, and payments moving together.</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus status={wsStatus} />
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="border border-primary bg-primary/5 p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Open orders</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {orders.filter((order) => !["completed", "cancelled"].includes(order.status)).length}
          </strong>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Needs attention</span>
        </div>

        <div className="border border-border bg-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Preparing</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{getFilterCount("preparing")}</strong>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">In the kitchen</span>
        </div>

        <div className="border border-border bg-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Ready to serve</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{getFilterCount("ready")}</strong>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Waiting on floor</span>
        </div>

        <div className="border border-border bg-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Collected</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            ₹{orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + Number(order.total_amount || 0), 0).toFixed(0)}
          </strong>
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Paid in view</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-foreground">
          <span>Service queue</span>
          <span className="text-xs font-bold text-muted-foreground border border-border px-2 py-0.5 bg-muted/30">
            {visibleOrders.length} {visibleOrders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mb-2 w-full sm:w-auto sm:pb-0 sm:mb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`inline-flex shrink-0 items-center px-3 py-1.5 text-xs transition-colors border ${
                  isActive
                    ? "bg-primary text-primary-foreground font-bold border-primary"
                    : "bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border-border font-semibold"
                }`}
              >
                <span className="capitalize">{f === "all" ? "All" : f}</span>
                <span className={`ml-1.5 text-[10px] font-bold ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {getFilterCount(f)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Output */}
      {visibleOrders.length === 0 ? (
        <EmptyState
          icon={<span className="inline-block w-7 h-7 text-muted-foreground"><IconOrders /></span>}
          title={orders.length === 0 ? "No orders yet" : "No orders match this filter"}
          message={orders.length === 0 ? "Orders will appear here as guests place them." : ""}
        />
      ) : (
        <>
          {/* Mobile: Cards view */}
          <div className="space-y-4 lg:hidden">
            {visibleOrders.map((order) => (
              <Card key={order.id} className="border border-border bg-card p-4 sm:p-5 space-y-4 rounded-none" data-order-row>
                <div className="flex items-start justify-between border-b border-border pb-3">
                  <div>
                    <strong className="block text-base font-extrabold text-foreground tracking-tight">Order #{order.id}</strong>
                    <span className="text-xs font-medium text-muted-foreground">Table {order.table_number ?? "—"}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="space-y-1.5 text-xs font-medium text-muted-foreground border-b border-border pb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <span className="font-bold text-foreground">{item.quantity}×</span>
                      <span className="leading-tight">{item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between font-extrabold text-sm text-foreground">
                  <span>Total</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                  <StatusDropdown
                    value={order.status}
                    options={getStatusOptions(order.status)}
                    disabled={updatingId === order.id}
                    onChange={(next) => handleStatusChange(order.id, next)}
                  />
                  {order.status !== "paid" && order.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-bold"
                      disabled={payingId === order.id}
                      onClick={() => handleMarkPaid(order)}
                    >
                      {payingId === order.id ? <Spinner size={14} /> : "Mark paid"}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop: Table view */}
          <div className="hidden lg:block border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update</th>
                  <th className="px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleOrders.map((order) => (
                  <tr key={order.id} data-order-row className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-4 font-extrabold text-foreground">#{order.id}</td>
                    <td className="px-4 py-4 font-medium text-muted-foreground">{order.table_number ?? "—"}</td>
                    <td className="px-4 py-4 text-xs font-medium text-muted-foreground space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          <span className="font-bold text-foreground">{item.quantity}×</span> {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-4 font-extrabold text-foreground">₹{order.total_amount.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusDropdown
                        value={order.status}
                        options={getStatusOptions(order.status)}
                        disabled={updatingId === order.id}
                        onChange={(next) => handleStatusChange(order.id, next)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      {order.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          ✓ Paid
                        </span>
                      ) : order.status === "cancelled" ? (
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">—</span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-bold"
                          disabled={payingId === order.id}
                          onClick={() => handleMarkPaid(order)}
                        >
                          {payingId === order.id ? <Spinner size={14} /> : "Mark paid"}
                        </Button>
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