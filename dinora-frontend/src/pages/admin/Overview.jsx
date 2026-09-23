import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";

const ACTIVE_STATUSES = ["pending", "preparing", "ready", "served"];

function money(value) {
  return `₹${Number(value || 0).toFixed(0)}`;
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "pending":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "preparing":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
    case "ready":
    case "paid":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "served":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export default function Overview() {
  const [status, setStatus] = useState("loading");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminApi
      .listOrders()
      .then((list) => {
        if (!cancelled) {
          setOrders(list);
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.detail || err.message || "Could not load your overview");
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== "ready") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-overview-section]").forEach((section) => {
        section.style.opacity = "1";
      });
      return undefined;
    }
    const animation = animate("[data-overview-section]", {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(75),
      duration: 420,
      ease: "outQuart",
    });
    return () => animation.cancel();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center bg-background" aria-busy="true">
        <Spinner size={24} />
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState icon="!" title="Overview unavailable" message={error} />;
  }

  const active = orders.filter((order) => ACTIVE_STATUSES.includes(order.status));
  const preparing = orders.filter((order) => order.status === "preparing").length;
  const ready = orders.filter((order) => order.status === "ready").length;
  const collected = orders
    .filter((order) => order.status === "paid")
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 min-h-screen bg-background text-foreground flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 opacity-0" data-overview-section>
        <div className="space-y-1">
          <div className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-primary"></span> Restaurant workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Good service starts here.
          </h1>
          <p className="text-muted-foreground text-sm">
            A quick read on what needs your attention right now.
          </p>
        </div>
        <Link
          className="w-full sm:w-auto inline-flex items-center justify-center bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 rounded-none text-center"
          to="/admin/orders"
        >
          Open orders
        </Link>
      </div>

      {/* Metrics Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 opacity-0" data-overview-section aria-label="Service summary">
        <Link
          className="group border border-primary/40 bg-primary/5 p-4 sm:p-5 transition-all hover:border-primary hover:bg-primary/10 flex flex-col justify-between gap-3"
          to="/admin/orders"
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            Active orders
          </span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{active.length}</strong>
          <small className="text-[11px] sm:text-xs text-muted-foreground">Need attention today</small>
        </Link>

        <Link
          className="group border border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/50 hover:bg-accent/40 flex flex-col justify-between gap-3"
          to="/admin/orders?status=preparing"
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            Preparing
          </span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{preparing}</strong>
          <small className="text-[11px] sm:text-xs text-muted-foreground">In the kitchen</small>
        </Link>

        <Link
          className="group border border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/50 hover:bg-accent/40 flex flex-col justify-between gap-3"
          to="/admin/orders?status=ready"
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            Ready to serve
          </span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{ready}</strong>
          <small className="text-[11px] sm:text-xs text-muted-foreground">Waiting on the floor</small>
        </Link>

        <div className="border border-border bg-card p-4 sm:p-5 flex flex-col justify-between gap-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Collected
          </span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{money(collected)}</strong>
          <small className="text-[11px] sm:text-xs text-muted-foreground">Paid orders in view</small>
        </div>
      </section>

      {/* Main Workspace Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 opacity-0" data-overview-section>
        {/* Recent Orders Panel */}
        <div className="lg:col-span-2 border border-border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Recent orders</h2>
                <p className="text-xs text-muted-foreground mt-0.5">The latest movement in your service.</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
              >
                View all
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border p-6 bg-muted/20">
                Orders will appear here as guests place them.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <div
                    className="flex items-center justify-between py-3.5 px-2 hover:bg-muted/40 transition-colors gap-3"
                    key={order.id}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <strong className="block text-sm font-bold text-foreground truncate">
                        Order #{order.id}
                      </strong>
                      <span className="text-xs text-muted-foreground block">
                        Table {order.table_number ?? "-"}
                      </span>
                    </div>
                    <div className="text-right space-y-1 shrink-0">
                      <strong className="block text-sm font-extrabold text-foreground">
                        {money(order.total_amount)}
                      </strong>
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="border border-border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Quick actions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Common setup tasks, close at hand.</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/admin/tables"
              className="flex items-center justify-between border border-border p-3.5 hover:bg-accent/50 hover:border-primary/50 transition-colors group active:scale-[0.99]"
            >
              <span className="text-sm font-bold text-foreground">Add a table</span>
              <span className="flex h-7 w-7 items-center justify-center border border-border bg-background text-sm font-bold text-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                +
              </span>
            </Link>

            <Link
              to="/admin/menu"
              className="flex items-center justify-between border border-border p-3.5 hover:bg-accent/50 hover:border-primary/50 transition-colors group active:scale-[0.99]"
            >
              <span className="text-sm font-bold text-foreground">Add a menu item</span>
              <span className="flex h-7 w-7 items-center justify-center border border-border bg-background text-sm font-bold text-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                +
              </span>
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center justify-between border border-border p-3.5 hover:bg-accent/50 hover:border-primary/50 transition-colors group active:scale-[0.99]"
            >
              <span className="text-sm font-bold text-foreground">Check payment setup</span>
              <span className="flex h-7 w-7 items-center justify-center border border-border bg-background text-sm font-bold text-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                +
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}