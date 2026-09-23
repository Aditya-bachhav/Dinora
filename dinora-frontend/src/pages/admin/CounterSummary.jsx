import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { IconCounter } from "../../components/ui/Icons";

const ORDER = ["pending", "preparing", "ready", "served", "paid", "completed", "cancelled"];

// Maps each status to the pill tone used elsewhere in the app, so the
// counter reads consistently with StatusBadge on the Orders page.
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
      document.querySelectorAll("[data-counter-card]").forEach((card) => { card.style.opacity = "1"; });
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
      <div className="admin-counter-page admin-counter-loading" aria-busy="true">
        <div className="admin-page-head">
          <div>
            <div className="counter-page-kicker">SERVICE PULSE</div>
            <h1>Counter</h1>
            <p>Gathering the latest order movement…</p>
          </div>
          <div className="counter-loading-pulse" />
        </div>
        <div className="counter-overview-grid">
          {Array.from({ length: 3 }).map((_, i) => <div className="counter-overview-skeleton" key={i} />)}
        </div>
        <div className="counter-status-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="card counter-status-skeleton" key={i}>
              <Skeleton style={{ width: 70, height: 12 }} />
              <Skeleton style={{ width: 48, height: 34, marginTop: 24 }} />
            </div>
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
    <div className="admin-counter-page">
      <div className="admin-page-head">
        <div>
          <div className="counter-page-kicker"><span /> Live service pulse</div>
          <h1>Counter</h1>
          <p>A calm read on what is happening across your restaurant.</p>
        </div>
        <div className="counter-refresh-note"><span /> Auto-refreshing</div>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={<span className="icon" style={{ width: 28, height: 28 }}><IconCounter /></span>}
          title="No orders yet"
          message="Order status totals will appear here once guests start ordering."
        />
      ) : (
        <>
          <div className="counter-overview-grid">
            <div className="counter-overview-card counter-overview-featured">
              <span className="counter-overview-label">Total orders</span>
              <strong>{total}</strong>
              <span>All orders in this service</span>
            </div>
            <div className="counter-overview-card">
              <span className="counter-overview-label">In service</span>
              <strong>{active}</strong>
              <span>Pending through served</span>
            </div>
            <div className="counter-overview-card counter-overview-attention">
              <span className="counter-overview-label">Needs a look</span>
              <strong>{attention}</strong>
              <span>Pending or ready now</span>
            </div>
          </div>
          <div className="counter-section-head">
            <div>
              <strong>Order movement</strong>
              <span>Every status, at a glance</span>
            </div>
            <span>{total} total</span>
          </div>
          <div className="counter-status-grid">
            {entries.map(([statusName, count]) => (
              <div key={statusName} className="card counter-status-card" data-counter-card>
                <div className="counter-status-top">
                  <span className={`counter-status-icon counter-status-icon-${statusName}`} />
                  <span className={`pill pill-${STATUS_PILL[statusName] || "neutral"}`}>
                    {statusName}
                  </span>
                </div>
                <strong>{count}</strong>
                <span>{statusName === "pending" ? "Awaiting action" : statusName === "preparing" ? "In the kitchen" : statusName === "ready" ? "Ready for the floor" : statusName === "served" ? "With the guest" : statusName === "paid" ? "Payment complete" : statusName === "completed" ? "Closed orders" : "Removed from flow"}</span>
              </div>
            ))}
          </div>
          <p className="counter-footnote">Refreshes automatically every 15 seconds. Open Orders for live, per-order updates.</p>
        </>
      )}
    </div>
  );
}
