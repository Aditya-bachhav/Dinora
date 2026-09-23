const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  paid: "Paid",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_STYLES = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  preparing: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  ready: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  served: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function StatusBadge({ status }) {
  const styleClass = STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${styleClass}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}