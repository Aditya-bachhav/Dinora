import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guestApi, getStoredSessionId } from "../../services/api";
import { connectTableSocket } from "../../services/ws";
import { openRazorpayCheckout } from "../../services/razorpay";
import { useToast } from "../../context/ToastContext";
import ConnectionStatus from "../../components/ConnectionStatus";
import EmptyState from "../../components/ui/EmptyState";
import { OrderCardSkeleton } from "../../components/ui/Skeleton";
import Spinner from "../../components/ui/Spinner";
import ClipboardList from "lucide-react/dist/esm/icons/clipboard-list";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";

const PAYABLE_STATUSES = new Set(["served"]);

const TRACKING_STEPS = [
  { key: "pending", label: "Received" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" },
];

function money(n) {
  return `₹${n.toFixed(2)}`;
}

// Theme-compliant step tracker
function ThemeOrderProgress({ status }) {
  if (status === "cancelled") {
    return (
      <div className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 text-center">
        This order was cancelled.
      </div>
    );
  }

  const stepOrder = ["pending", "preparing", "ready", "served", "paid", "completed"];
  const currentIndex = stepOrder.indexOf(status);

  return (
    <div className="w-full py-3 px-1">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background line */}
        <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-border z-0" />
        
        {/* Active progress line */}
        <div 
          className="absolute top-3.5 left-4 h-0.5 bg-primary transition-all duration-500 z-0"
          style={{
            width: `${Math.min(100, Math.max(0, (currentIndex / (TRACKING_STEPS.length - 1)) * 100))}%`
          }}
        />

        {TRACKING_STEPS.map((step, idx) => {
          const isCompleted = currentIndex > idx || status === "paid" || status === "completed";
          const isCurrent = currentIndex === idx && status !== "paid" && status !== "completed";

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-background border-primary text-primary ring-4 ring-primary/15 shadow-sm"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  "✓"
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-[11px] font-medium ${isCurrent || isCompleted ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Orders() {
  const { tableToken } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const sessionId = getStoredSessionId(tableToken);
    if (!sessionId) {
      navigate(`/t/${tableToken}`, { replace: true });
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const list = await guestApi.listOrdersForSession(sessionId);
        if (!cancelled) {
          setOrders(list);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err.detail || err.message || "Could not load your orders");
        }
      }
    }
    load();

    const disconnect = connectTableSocket(
      sessionId,
      (event) => {
        if (event.type === "order_created" || event.type === "order_updated") {
          setOrders((prev) => {
            const idx = prev.findIndex((o) => o.id === event.order.id);
            if (idx === -1) return [event.order, ...prev];
            const next = [...prev];
            next[idx] = event.order;
            return next;
          });
        }
      },
      setWsStatus
    );

    return () => {
      cancelled = true;
      disconnect();
    };
  }, [tableToken, navigate]);

  async function handlePay(order) {
    const sessionId = getStoredSessionId(tableToken);
    setPayingId(order.id);
    try {
      const init = await guestApi.initPayment(order.id, sessionId);
      const rzpResponse = await openRazorpayCheckout(init, {
        name: "Dinora",
        description: `Order #${order.id}`,
      });

      await guestApi.verifyPayment(order.id, sessionId, rzpResponse);

      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "paid" } : o)));
      toast.success("Payment successful");
    } catch (err) {
      if (err.message !== "Payment cancelled") {
        toast.error(err.detail || err.message || "Payment could not be completed");
      }
    } finally {
      setPayingId(null);
    }
  }

  const getStatusBadgeStyle = (orderStatus) => {
    switch (orderStatus) {
      case "paid":
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "ready":
      case "served":
        return "bg-primary/10 text-primary border-primary/20";
      case "preparing":
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[100dvh] bg-background p-4 pt-8 pb-32 max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 sm:p-6 pb-32">
        <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-sm p-6 sm:p-8">
          <EmptyState icon="⚠️" title="Something went wrong" message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-32 pt-8 px-4 max-w-3xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-border/50">
        <div>
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wider text-primary uppercase mb-2">
            <ClipboardList size={13} /> Live order desk
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Follow every<br />
            <em className="text-muted-foreground font-normal italic">delicious step.</em>
          </h1>
          <p className="text-muted-foreground text-lg">Your kitchen status updates here in real time.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground shadow-sm self-start">
          <ConnectionStatus status={wsStatus} />
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-8">
          <EmptyState
            icon="🧾"
            title="No orders yet"
            message="Once you place an order it will show up here with live status updates."
            action={
              <button 
                className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" 
                onClick={() => navigate(`/t/${tableToken}/menu`)}
              >
                Browse menu
              </button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-5 sm:p-6 transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <strong className="text-lg font-bold">Order #{order.id}</strong>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusBadgeStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="py-2 mb-4">
                <ThemeOrderProgress status={order.status} />
              </div>

              <ul className="divide-y divide-border/60 my-4 text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center py-2.5 text-sm">
                    <span className="text-foreground font-medium">
                      <span className="text-muted-foreground mr-2 font-normal">{item.quantity}×</span>
                      {item.name}
                    </span>
                    <b className="font-semibold">{money(item.line_total)}</b>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center font-bold text-base pt-3 border-t border-border mt-3">
                <span>Total</span>
                <span className="text-lg">{money(order.total_amount)}</span>
              </div>

              {PAYABLE_STATUSES.has(order.status) && (
                <button
                  className="mt-5 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 w-full shadow-sm"
                  disabled={payingId === order.id}
                  onClick={() => handlePay(order)}
                >
                  {payingId === order.id ? <Spinner size={16} /> : `Pay ${money(order.total_amount)}`}
                </button>
              )}

              {(order.status === "paid" || order.status === "completed") && (
                <p className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md py-1.5 px-3 w-fit flex items-center gap-1">
                  ✓ Paid
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <button 
          className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-11 px-4 py-2 w-full gap-2 border border-border" 
          onClick={() => navigate(`/t/${tableToken}/menu`)}
        >
          Order more <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}