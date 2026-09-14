import { useEffect, useState } from "react";
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

  if (status === "loading") {
    return (
      <div className="stat-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="card stat-card" key={i}>
            <Skeleton style={{ width: 40, height: 28 }} />
            <Skeleton style={{ width: 60, height: 12, marginTop: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState icon="⚠️" title="Something went wrong" message={error} />;
  }

  const entries = ORDER.filter((s) => totals[s] !== undefined).map((s) => [s, totals[s]]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="admin-counter-page">
      <div className="admin-page-head">
        <div>
          <h1>Counter</h1>
          <p>Order status totals across your restaurant</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={<span className="icon" style={{ width: 28, height: 28 }}><IconCounter /></span>}
          title="No orders yet"
          message="Order status totals will appear here once guests start ordering."
        />
      ) : (
        <>
          <div className="stat-grid">
            <div className="card stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Total orders</span>
              </div>
              <span className="stat-card-value">{total}</span>
            </div>
            {entries.map(([statusName, count]) => (
              <div key={statusName} className="card stat-card">
                <div className="stat-card-top">
                  <span className="stat-card-label">{statusName}</span>
                  <span className={`pill pill-${STATUS_PILL[statusName] || "neutral"}`}>
                    {statusName}
                  </span>
                </div>
                <span className="stat-card-value">{count}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--color-text-faint)", textAlign: "center", marginTop: 8 }}>
            Refreshes automatically every 15 seconds. See Orders for live, per-order updates.
          </p>
        </>
      )}
    </div>
  );
}
