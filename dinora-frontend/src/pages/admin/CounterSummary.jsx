import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { IconCounter } from "../../components/ui/Icons";
import { Card } from "../../components/ui/card";

const ORDER = ["pending", "preparing", "ready", "served", "paid", "completed", "cancelled"];

// Maps each status tone to Tailwind utility classes consistent with status badges across the app
const PILL_STYLES = {
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
  good: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  neutral: "bg-muted text-muted-foreground border-border",
  danger: "bg-destructive/10 text-destructive border-destructive/30",
};

const STATUS_PILL = {
  pending: "warning",
  preparing: "info",
  ready: "good",
  served: "good",
  paid: "good",
  completed: "neutral",
  cancelled: "danger",
};

export default function CounterSummary() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [totals, setTotals] = useState({});

  async function load(showSpinner) {
    if (showSpinner) setStatus("loading");
    try {
      const data = await adminApi.getCounterTotals();
      setTotals(data.totals || {});
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.detail || err.message || "Could not load counter totals");
    }
  }

  useEffect(() => {
    load(true);
    const interval = setInterval(() => load(false), 15000); // light periodic refresh; live detail lives on the Orders page
    return () => clearInterval(interval);
  }, []);

  const entries = ORDER.filter((s) => totals[s] !== undefined).map((s) => [s, totals[s]]);

  useEffect(() => {
    if (status !== "ready" || entries.length === 0) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-counter-card]").forEach((card) => {
        card.style.opacity = "1";
      });
      return undefined;
    }
    const animation = animate("[data-counter-card]", {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: stagger(70),
      duration: 480,
      ease: "outQuart",
    });
    return () => animation.cancel();
  }, [status, entries.length]);

  if (status === "loading") {
    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-background text-foreground" aria-busy="true">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 sm:pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Counter</h1>
            <p className="text-sm font-medium text-muted-foreground">Gathering the latest order movement…</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-24 bg-muted/40 animate-pulse border border-border ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`} />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card className="border border-border bg-card p-4 space-y-4 rounded-none" key={i}>
              <Skeleton className="w-16 h-3 rounded-none" />
              <Skeleton className="w-12 h-8 mt-4 rounded-none" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState icon="⚠️" title="Something went wrong" message={error} />;
  }

  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  const active = ["pending", "preparing", "ready", "served"].reduce((sum, key) => sum + (totals[key] || 0), 0);
  const attention = (totals.pending || 0) + (totals.ready || 0);

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-background text-foreground overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Counter</h1>
          <p className="text-sm font-medium text-muted-foreground">A calm read on what is happening across your restaurant.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground border border-border px-2.5 py-1 bg-muted/30 self-start sm:self-center">
          <span className="h-2 w-2 bg-emerald-500 animate-pulse" /> Auto-refreshing
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={<span className="inline-block w-7 h-7 text-muted-foreground"><IconCounter /></span>}
          title="No orders yet"
          message="Order status totals will appear here once guests start ordering."
        />
      ) : (
        <>
          {/* Summary Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="border border-primary bg-primary/5 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">Total orders</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{total}</strong>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">All in service</span>
            </div>

            <div className="border border-border bg-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">In service</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{active}</strong>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Pending through served</span>
            </div>

            <div className="col-span-2 sm:col-span-1 border border-amber-500/40 bg-amber-500/5 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Needs a look</span>
              <strong className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{attention}</strong>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Pending or ready now</span>
            </div>
          </div>

          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-border pb-3 sm:pb-4">
            <div className="space-y-0.5">
              <strong className="block text-sm font-extrabold text-foreground tracking-tight">Order movement</strong>
              <span className="block text-xs font-medium text-muted-foreground">Every status, at a glance</span>
            </div>
            <span className="text-xs font-bold text-muted-foreground border border-border px-2.5 py-1 bg-muted/30">
              {total} total
            </span>
          </div>

          {/* Status Grid: 2 columns on mobile for compact layout */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {entries.map(([statusName, count]) => {
              const pillStyle = PILL_STYLES[STATUS_PILL[statusName] || "neutral"];
              return (
                <Card
                  key={statusName}
                  className="border border-border bg-card p-4 sm:p-5 space-y-3 flex flex-col justify-between rounded-none"
                  data-counter-card
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center border px-2 py-0.5 text-[10px] sm:text-xs font-bold capitalize ${pillStyle}`}
                    >
                      {statusName}
                    </span>
                  </div>
                  <strong className="block text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{count}</strong>
                  <span className="block text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">
                    {statusName === "pending"
                      ? "Awaiting action"
                      : statusName === "preparing"
                      ? "In kitchen"
                      : statusName === "ready"
                      ? "Ready for floor"
                      : statusName === "served"
                      ? "With guest"
                      : statusName === "paid"
                      ? "Paid complete"
                      : statusName === "completed"
                      ? "Closed orders"
                      : "Removed"}
                  </span>
                </Card>
              );
            })}
          </div>

          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground pt-4 border-t border-border">
            Refreshes automatically every 15 seconds. Open Orders for live updates.
          </p>
        </>
      )}
    </div>
  );
}