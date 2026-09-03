import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../services/api";
import { connectCounterSocket } from "../../services/ws";
import { useToast } from "../../context/ToastContext";
import StatusBadge from "../../components/StatusBadge";
import ConnectionStatus from "../../components/ConnectionStatus";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { OrderCardSkeleton } from "../../components/ui/Skeleton";

// Statuses an admin can manually set via the raw status override. "paid" is
// intentionally excluded here — marking something paid goes through the
// dedicated "Mark paid" button below, which calls the real payment flow
// (idempotent, creates a Payment record) rather than just flipping the
// status field directly.
const MANUAL_STATUSES = [
  "pending",
  "preparing",
  "ready",
  "served",
  "completed",
  "cancelled",
];

const FILTERS = [
  "all",
  "pending",
  "preparing",
  "ready",
  "served",
  "paid",
  "completed",
  "cancelled",
];

export default function OrdersDashboard() {
  const toast = useToast();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [updatingId, setUpdatingId] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const list = await adminApi.listOrders();

        if (!cancelled) {
          setOrders(list);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err.detail || err.message || "Could not load orders");
        }
      }
    }

    load();

    // /ws/counter requires a valid admin token as a query param — see
    // services/ws.js. It only ever receives events for THIS admin's own
    // restaurant; the backend enforces that server-side.
    const disconnect = connectCounterSocket((event) => {
      if (event.type === "order_created" || event.type === "order_updated") {
        setOrders((prev) => {
          const idx = prev.findIndex((o) => o.id === event.order.id);

          if (idx === -1) {
            toast.info(
              `New order #${event.order.id} — table ${
                event.order.table_number ?? "?"
              }`
            );

            return [event.order, ...prev];
          }

          const next = [...prev];
          next[idx] = event.order;
          return next;
        });
      }
    }, setWsStatus);

    return () => {
      cancelled = true;
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleOrders = useMemo(
    () =>
      filter === "all"
        ? orders
        : orders.filter((o) => o.status === filter),
    [orders, filter]
  );

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId);

    try {
      const updated = await adminApi.updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );

      toast.success(`Order #${orderId} → ${newStatus}`);
    } catch (err) {
      toast.error(
        err.detail || err.message || "Could not update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleMarkPaid(order) {
    setPayingId(order.id);

    try {
      // Goes through the real payment service — idempotent, creates a
      // Payment record, amount is always the order's own total_amount.
      await adminApi.adminMarkPaid(order.id);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: "paid" } : o
        )
      );

      toast.success(`Order #${order.id} marked paid`);
    } catch (err) {
      toast.error(
        err.detail || err.message || "Could not record payment"
      );
    } finally {
      setPayingId(null);
    }
  }

  if (status === "loading") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-orders-page {
            min-height: 100%;
            padding: 28px;
            background: #f6f3ed;
            font-family: "DM Sans", sans-serif;
            color: #202923;
          }

          .dinora-orders-loading {
            max-width: 1200px;
            margin: 0 auto;
          }

          .dinora-loading-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .dinora-loading-title {
            width: 140px;
            height: 30px;
            border-radius: 10px;
            background: #e7e5df;
            animation: dinoraPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-status {
            width: 110px;
            height: 28px;
            border-radius: 999px;
            background: #e7e5df;
            animation: dinoraPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-filters {
            display: flex;
            gap: 8px;
            margin-bottom: 22px;
          }

          .dinora-loading-filter {
            width: 72px;
            height: 36px;
            border-radius: 999px;
            background: #e7e5df;
            animation: dinoraPulse 1.5s infinite ease-in-out;
          }

          @keyframes dinoraPulse {
            0%, 100% { opacity: .55; }
            50% { opacity: 1; }
          }
        `}</style>

        <div className="dinora-orders-page">
          <div className="dinora-orders-loading">
            <div className="dinora-loading-header">
              <div className="dinora-loading-title" />
              <div className="dinora-loading-status" />
            </div>

            <div className="dinora-loading-filters">
              <div className="dinora-loading-filter" />
              <div className="dinora-loading-filter" />
              <div className="dinora-loading-filter" />
              <div className="dinora-loading-filter" />
            </div>

            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <style>{`
          .dinora-error-page {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
          }

          .dinora-error-card {
            width: 100%;
            max-width: 500px;
            padding: 36px;
            border-radius: 24px;
            background: rgba(255,255,255,.9);
            border: 1px solid rgba(36,50,41,.08);
            box-shadow: 0 24px 60px rgba(35,41,37,.07);
            text-align: center;
          }
        `}</style>

        <div className="dinora-error-page">
          <div className="dinora-error-card">
            <EmptyState
              icon="⚠️"
              title="Something went wrong"
              message={error}
            />
          </div>
        </div>
      </>
    );
  }

  const getFilterCount = (value) => {
    if (value === "all") return orders.length;
    return orders.filter((order) => order.status === value).length;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .dinora-orders-page {
          min-height: 100%;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 25%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #202923;
        }

        .dinora-orders-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dinora-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
        }

        .dinora-header-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-eyebrow {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: #8b918c;
        }

        .dinora-page-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -.7px;
          color: #26372d;
        }

        .dinora-page-subtitle {
          margin: 2px 0 0;
          color: #858b86;
          font-size: 13px;
        }

        .dinora-live-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 5px 18px rgba(35,41,37,.04);
        }

        .dinora-filter-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          padding: 7px;
          overflow-x: auto;
          scrollbar-width: none;
          background: rgba(255,255,255,.64);
          border: 1px solid rgba(38,57,45,.07);
          border-radius: 17px;
          box-shadow: 0 8px 25px rgba(35,41,37,.04);
        }

        .dinora-filter-bar::-webkit-scrollbar {
          display: none;
        }

        .dinora-filter {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 13px;
          border: 0;
          border-radius: 11px;
          background: transparent;
          color: #777f79;
          font: 600 12px "DM Sans", sans-serif;
          cursor: pointer;
          text-transform: capitalize;
          transition: .2s ease;
        }

        .dinora-filter:hover {
          color: #32463a;
          background: rgba(38,57,45,.05);
        }

        .dinora-filter.active {
          background: #26392d;
          color: #fff;
          box-shadow: 0 6px 14px rgba(38,57,45,.15);
        }

        .dinora-filter-count {
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          display: inline-grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(0,0,0,.06);
          font-size: 10px;
          font-weight: 700;
        }

        .dinora-filter.active .dinora-filter-count {
          background: rgba(255,255,255,.14);
        }

        .dinora-empty {
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 15px 40px rgba(35,41,37,.05);
        }

        .dinora-mobile-orders {
          display: grid;
          gap: 14px;
        }

        .dinora-order-card {
          padding: 19px;
          border-radius: 20px;
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 12px 35px rgba(35,41,37,.06),
            0 2px 8px rgba(35,41,37,.03);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .dinora-order-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 40px rgba(35,41,37,.08),
            0 3px 10px rgba(35,41,37,.04);
        }

        .dinora-order-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eceae4;
        }

        .dinora-order-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-order-number {
          font-size: 15px;
          font-weight: 700;
          color: #27372e;
        }

        .dinora-order-table {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #8b918c;
          font-weight: 500;
        }

        .dinora-table-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #b8bdb8;
        }

        .dinora-order-items {
          display: grid;
          gap: 9px;
          padding: 16px 0;
        }

        .dinora-order-item {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          font-size: 13px;
          color: #6b746d;
        }

        .dinora-order-item-main {
          min-width: 0;
          display: flex;
          gap: 7px;
        }

        .dinora-item-quantity {
          color: #a16a44;
          font-weight: 700;
          flex: 0 0 auto;
        }

        .dinora-item-name {
          color: #39443d;
          font-weight: 600;
        }

        .dinora-order-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 13px;
          border-top: 1px solid #eceae4;
        }

        .dinora-total-label {
          font-size: 11px;
          font-weight: 700;
          color: #939993;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .dinora-order-total {
          font-family: "Playfair Display", serif;
          font-size: 23px;
          font-weight: 700;
          color: #26392d;
        }

        .dinora-actions {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 9px;
          margin-top: 15px;
        }

        .dinora-select {
          width: 100%;
          min-height: 42px;
          padding: 0 34px 0 12px;
          border: 1px solid #dfe2dc;
          border-radius: 11px;
          background: #fafaf8;
          color: #475149;
          font: 600 12px "DM Sans", sans-serif;
          outline: none;
          cursor: pointer;
        }

        .dinora-select:focus {
          border-color: #617466;
          box-shadow: 0 0 0 4px rgba(97,116,102,.09);
        }

        .dinora-payment-button {
          min-height: 42px;
          padding: 0 14px;
          border: 0;
          border-radius: 11px;
          background: #eeeae0;
          color: #3a493f;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .2s ease;
        }

        .dinora-payment-button:hover:not(:disabled) {
          background: #e2ddd1;
          transform: translateY(-1px);
        }

        .dinora-payment-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .dinora-table-wrap {
          overflow: auto;
          border-radius: 22px;
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 16px 45px rgba(35,41,37,.06),
            0 2px 8px rgba(35,41,37,.03);
        }

        .dinora-orders-table {
          width: 100%;
          min-width: 920px;
          border-collapse: collapse;
        }

        .dinora-orders-table th {
          padding: 15px 18px;
          text-align: left;
          background: #faf9f6;
          border-bottom: 1px solid #eae8e1;
          color: #90968f;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .09em;
          font-weight: 700;
        }

        .dinora-orders-table td {
          padding: 17px 18px;
          border-bottom: 1px solid #efede8;
          color: #4a554d;
          font-size: 13px;
          vertical-align: top;
        }

        .dinora-orders-table tbody tr {
          transition: background .18s ease;
        }

        .dinora-orders-table tbody tr:hover {
          background: #fcfbf8;
        }

        .dinora-orders-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .dinora-table-order-id {
          font-weight: 700;
          color: #293930;
        }

        .dinora-table-cell-muted {
          color: #8d948e;
        }

        .dinora-table-items {
          display: grid;
          gap: 6px;
          min-width: 190px;
          color: #59635c;
          line-height: 1.4;
        }

        .dinora-table-total {
          white-space: nowrap;
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          color: #293a30;
        }

        .dinora-table-select {
          min-width: 145px;
        }

        .dinora-paid-note {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #55725e;
          font-size: 12px;
          font-weight: 700;
        }

        .dinora-paid-check {
          width: 21px;
          height: 21px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #edf4ed;
          font-size: 11px;
        }

        @media (min-width: 901px) {
          .dinora-mobile-orders {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .dinora-table-wrap {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .dinora-orders-page {
            padding: 18px 14px 24px;
          }

          .dinora-page-header {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 20px;
          }

          .dinora-page-title {
            font-size: 29px;
          }

          .dinora-live-status {
            width: 100%;
            justify-content: center;
          }

          .dinora-filter-bar {
            margin-bottom: 16px;
          }

          .dinora-order-card {
            padding: 16px;
            border-radius: 18px;
          }

          .dinora-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dinora-orders-page">
        <div className="dinora-orders-container">
          <header className="dinora-page-header">
            <div className="dinora-header-copy">
              <p className="dinora-eyebrow">Restaurant operations</p>
              <h1 className="dinora-page-title">Orders</h1>
              <p className="dinora-page-subtitle">
                Track incoming orders and manage their progress.
              </p>
            </div>

            <div className="dinora-live-status">
              <ConnectionStatus status={wsStatus} />
            </div>
          </header>

          <div className="dinora-filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`dinora-filter ${
                  filter === f ? "active" : ""
                }`}
                onClick={() => setFilter(f)}
              >
                <span>{f === "all" ? "All orders" : f}</span>

                <span className="dinora-filter-count">
                  {getFilterCount(f)}
                </span>
              </button>
            ))}
          </div>

          {visibleOrders.length === 0 ? (
            <div className="dinora-empty">
              <EmptyState
                icon="🧾"
                title={
                  orders.length === 0
                    ? "No orders yet"
                    : "No orders match this filter"
                }
                message={
                  orders.length === 0
                    ? "Orders will appear here as guests place them."
                    : ""
                }
              />
            </div>
          ) : (
            <>
              {/* Mobile: card list */}
              <div className="dinora-mobile-orders">
                {visibleOrders.map((order) => (
                  <div
                    key={order.id}
                    className="dinora-order-card"
                  >
                    <div className="dinora-order-top">
                      <div className="dinora-order-heading">
                        <div className="dinora-order-number">
                          Order #{order.id}
                        </div>

                        <div className="dinora-order-table">
                          <span className="dinora-table-dot" />
                          Table {order.table_number ?? "—"}
                        </div>
                      </div>

                      <StatusBadge status={order.status} />
                    </div>

                    <div className="dinora-order-items">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="dinora-order-item"
                        >
                          <div className="dinora-order-item-main">
                            <span className="dinora-item-quantity">
                              {item.quantity}×
                            </span>

                            <span className="dinora-item-name">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="dinora-order-total-row">
                      <span className="dinora-total-label">
                        Order total
                      </span>

                      <span className="dinora-order-total">
                        ₹{order.total_amount.toFixed(2)}
                      </span>
                    </div>

                    <div className="dinora-actions">
                      <select
                        className="dinora-select"
                        value={
                          MANUAL_STATUSES.includes(order.status)
                            ? order.status
                            : ""
                        }
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value
                          )
                        }
                      >
                        {!MANUAL_STATUSES.includes(order.status) && (
                          <option value="" disabled>
                            {order.status}
                          </option>
                        )}

                        {MANUAL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      {order.status !== "paid" &&
                        order.status !== "cancelled" && (
                          <button
                            className="dinora-payment-button"
                            disabled={payingId === order.id}
                            onClick={() =>
                              handleMarkPaid(order)
                            }
                          >
                            {payingId === order.id ? (
                              <Spinner size={14} />
                            ) : (
                              "Mark paid"
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="dinora-table-wrap">
                <table className="dinora-orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Table</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update</th>
                      <th>Payment</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="dinora-table-order-id">
                            #{order.id}
                          </span>
                        </td>

                        <td>
                          <span className="dinora-table-cell-muted">
                            {order.table_number ?? "—"}
                          </span>
                        </td>

                        <td>
                          <div className="dinora-table-items">
                            {order.items.map((item) => (
                              <div key={item.id}>
                                <b>{item.quantity}×</b>{" "}
                                {item.name}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td>
                          <span className="dinora-table-total">
                            ₹{order.total_amount.toFixed(2)}
                          </span>
                        </td>

                        <td>
                          <StatusBadge status={order.status} />
                        </td>

                        <td>
                          <select
                            className="dinora-select dinora-table-select"
                            value={
                              MANUAL_STATUSES.includes(order.status)
                                ? order.status
                                : ""
                            }
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value
                              )
                            }
                          >
                            {!MANUAL_STATUSES.includes(
                              order.status
                            ) && (
                              <option value="" disabled>
                                {order.status}
                              </option>
                            )}

                            {MANUAL_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          {order.status === "paid" ? (
                            <span className="dinora-paid-note">
                              <span className="dinora-paid-check">
                                ✓
                              </span>
                              Paid
                            </span>
                          ) : order.status === "cancelled" ? (
                            <span className="dinora-table-cell-muted">
                              —
                            </span>
                          ) : (
                            <button
                              className="dinora-payment-button"
                              disabled={payingId === order.id}
                              onClick={() =>
                                handleMarkPaid(order)
                              }
                            >
                              {payingId === order.id ? (
                                <Spinner size={14} />
                              ) : (
                                "Mark paid"
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}