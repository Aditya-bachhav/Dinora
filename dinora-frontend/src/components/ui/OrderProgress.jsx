const FLOW = ["pending", "preparing", "ready", "served", "paid"];
const LABELS = {
  pending: "Order placed",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  paid: "Paid",
};

export default function OrderProgress({ status }) {
  if (status === "cancelled") {
    return (
      <div className="progress-cancelled">
        <span className="progress-cancelled-dot" /> Cancelled
      </div>
    );
  }

  const currentIndex = FLOW.indexOf(status === "completed" ? "paid" : status);

  return (
    <div className="order-progress" role="list">
      {FLOW.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";
        return (
          <div className={`progress-step progress-${state}`} key={step} role="listitem">
            <span className="progress-dot">{state === "done" ? "✓" : ""}</span>
            <span className="progress-label">{LABELS[step]}</span>
            {i < FLOW.length - 1 && <span className="progress-line" />}
          </div>
        );
      })}
    </div>
  );
}
