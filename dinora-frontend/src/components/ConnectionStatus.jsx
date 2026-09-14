const LABELS = {
  connected: "Live",
  disconnected: "Reconnecting…",
  rejected: "Connection rejected",
  "no-token": "Not signed in",
};

export default function ConnectionStatus({ status }) {
  return <span className={`connection-status connection-${status || "disconnected"}`}>{LABELS[status] || "Connecting…"}</span>;
}
