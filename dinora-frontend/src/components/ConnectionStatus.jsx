const LABELS = {
  connected: "Live",
  disconnected: "Reconnecting…",
  rejected: "Connection rejected",
  "no-token": "Not signed in",
};

const STATUS_STYLES = {
  connected: {
    container: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500 animate-pulse",
  },
  disconnected: {
    container: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dot: "bg-amber-500 animate-pulse",
  },
  rejected: {
    container: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  "no-token": {
    container: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

export default function ConnectionStatus({ status }) {
  const currentStatus = status || "disconnected";
  const style = STATUS_STYLES[currentStatus] || {
    container: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground animate-pulse",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${style.container}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 ${style.dot}`} aria-hidden="true" />
      <span>{LABELS[status] || "Connecting…"}</span>
    </span>
  );
}