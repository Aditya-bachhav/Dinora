import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guestApi, getStoredSessionId } from "../../services/api";
import { connectTableSocket } from "../../services/ws";
import { openRazorpayCheckout } from "../../services/razorpay";
import { useToast } from "../../context/ToastContext";
import ConnectionStatus from "../../components/ConnectionStatus";
import OrderProgress from "../../components/ui/OrderProgress";
import EmptyState from "../../components/ui/EmptyState";
import { OrderCardSkeleton } from "../../components/ui/Skeleton";
import Spinner from "../../components/ui/Spinner";

// Statuses at which the "Pay" button becomes available — matches
// backend order_service.ALLOWED_STATUSES minus the ones that don't make
// sense to pay for (pending/preparing/ready are still being made;
// cancelled orders can't be paid; already-paid/completed don't need it).
const PAYABLE_STATUSES = new Set(["served"]);

function money(n) {
  return `₹${n.toFixed(2)}`;
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

    // One initial GET, then live updates over WebSocket — no polling.
    // This is also how a guest sees their own order flip to "paid" if an
    // admin marks it paid at the counter on their behalf.
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
      // Step 1: server creates a Razorpay order for this order's own
      // server-computed total — no amount is sent from here.
      const init = await guestApi.initPayment(order.id, sessionId);

      // Step 2: Razorpay's own Checkout UI opens (UPI/GPay/cards/etc).
      // We never see card or UPI details — Razorpay handles all of that.
      const rzpResponse = await openRazorpayCheckout(init, {
        name: "Dinora",
        description: `Order #${order.id}`,
      });

      // Step 3: hand back what Checkout returned. The backend verifies the
      // signature itself — this call can't make an order "paid" on its own,
      // only a genuine verified signature can.
      await guestApi.verifyPayment(order.id, sessionId, rzpResponse);

      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "paid" } : o)));
      toast.success("Payment successful");
    } catch (err) {
      // A cancelled Checkout sheet lands here too (openRazorpayCheckout
      // rejects on dismiss) — don't treat that as a hard error toast.
      if (err.message !== "Payment cancelled") {
        toast.error(err.detail || err.message || "Payment could not be completed");
      }
    } finally {
      setPayingId(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="orders-page">
        <div className="order-list">
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
    <div className="orders-page">
      <header className="orders-header">
        <h1 style={{ fontSize: 20 }}>Your orders</h1>
        <ConnectionStatus status={wsStatus} />
      </header>

      {orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No orders yet"
          message="Once you place an order it will show up here with live status updates."
          action={
            <button className="btn btn-primary" onClick={() => navigate(`/t/${tableToken}/menu`)}>
              Browse menu
            </button>
          }
        />
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="card order-card">
              <div className="order-card-header">
                <strong>Order #{order.id}</strong>
              </div>

              <OrderProgress status={order.status} />

              <ul className="order-card-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <b>{money(item.line_total)}</b>
                  </li>
                ))}
              </ul>
              <div className="order-card-total">
                <span>Total</span>
                <span>{money(order.total_amount)}</span>
              </div>

              {PAYABLE_STATUSES.has(order.status) && (
                <button
                  className="btn btn-primary pay-btn"
                  disabled={payingId === order.id}
                  onClick={() => handlePay(order)}
                >
                  {payingId === order.id ? <Spinner size={16} /> : `Pay ${money(order.total_amount)}`}
                </button>
              )}
              {(order.status === "paid" || order.status === "completed") && (
                <p className="paid-note">✓ Paid</p>
              )}
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <button className="btn btn-ghost btn-block" style={{ marginTop: 16 }} onClick={() => navigate(`/t/${tableToken}/menu`)}>
          Order more
        </button>
      )}
    </div>
  );
}
