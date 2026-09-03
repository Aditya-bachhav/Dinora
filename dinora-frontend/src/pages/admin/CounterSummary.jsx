import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";

const ORDER = [
  "pending",
  "preparing",
  "ready",
  "served",
  "paid",
  "completed",
  "cancelled",
];

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
      setError(
        err.detail || err.message || "Could not load counter totals"
      );
    }
  }

  useEffect(() => {
    load(true);

    const interval = setInterval(
      () => load(false),
      15000
    );

    return () => clearInterval(interval);
  }, []);

  if (status === "loading") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-counter-loading {
            min-height: 100%;
            padding: 28px;
            background: #f6f3ed;
            font-family: "DM Sans", sans-serif;
          }

          .dinora-counter-loading-inner {
            max-width: 1200px;
            margin: 0 auto;
          }

          .dinora-loading-title {
            width: 130px;
            height: 34px;
            border-radius: 10px;
            background: #e7e5df;
            margin-bottom: 24px;
            animation: dinoraCounterPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
          }

          .dinora-loading-card {
            min-height: 125px;
            padding: 20px;
            border-radius: 20px;
            background: rgba(255,255,255,.7);
            border: 1px solid rgba(38,57,45,.06);
            animation: dinoraCounterPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-value {
            width: 55px;
            height: 34px;
            border-radius: 9px;
            background: #e4e2dc;
          }

          .dinora-loading-label {
            width: 90px;
            height: 12px;
            margin-top: 14px;
            border-radius: 6px;
            background: #e9e7e1;
          }

          @keyframes dinoraCounterPulse {
            0%, 100% { opacity: .5; }
            50% { opacity: 1; }
          }

          @media (max-width: 800px) {
            .dinora-loading-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 500px) {
            .dinora-counter-loading {
              padding: 18px 14px;
            }

            .dinora-loading-grid {
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
          }
        `}</style>

        <div className="dinora-counter-loading">
          <div className="dinora-counter-loading-inner">
            <div className="dinora-loading-title" />

            <div className="dinora-loading-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  className="dinora-loading-card"
                  key={i}
                >
                  <div className="dinora-loading-value" />
                  <div className="dinora-loading-label" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <style>{`
          .dinora-counter-error {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
          }

          .dinora-counter-error-card {
            width: 100%;
            max-width: 520px;
            padding: 34px;
            border-radius: 24px;
            background: rgba(255,255,255,.88);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 25px 65px rgba(35,41,37,.07);
          }
        `}</style>

        <div className="dinora-counter-error">
          <div className="dinora-counter-error-card">
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

  const entries = ORDER.filter(
    (s) => totals[s] !== undefined
  ).map((s) => [s, totals[s]]);

  const total = entries.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  const activeOrders = ["pending", "preparing", "ready"].reduce(
    (sum, name) => sum + (totals[name] || 0),
    0
  );

  const completedOrders =
    (totals.completed || 0) + (totals.paid || 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .dinora-counter-page {
          min-height: 100%;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 25%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #202923;
        }

        .dinora-counter-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .dinora-counter-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
        }

        .dinora-counter-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-counter-eyebrow {
          margin: 0;
          color: #8d938e;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .dinora-counter-title {
          margin: 0;
          color: #26372d;
          font-family: "Playfair Display", serif;
          font-size: 35px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -.8px;
        }

        .dinora-counter-subtitle {
          margin: 2px 0 0;
          color: #858b86;
          font-size: 13px;
        }

        .dinora-counter-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid rgba(38,57,45,.08);
          border-radius: 999px;
          background: rgba(255,255,255,.75);
          color: #6f7871;
          font-size: 11px;
          font-weight: 600;
          box-shadow: 0 6px 18px rgba(35,41,37,.04);
        }

        .dinora-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #719278;
          box-shadow: 0 0 0 4px rgba(113,146,120,.10);
        }

        .dinora-summary-grid {
          display: grid;
          grid-template-columns: 1.45fr 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }

        .dinora-summary-card {
          position: relative;
          overflow: hidden;
          min-height: 135px;
          padding: 23px;
          border: 1px solid rgba(38,57,45,.07);
          border-radius: 21px;
          background: rgba(255,255,255,.87);
          box-shadow:
            0 13px 35px rgba(35,41,37,.055),
            0 2px 7px rgba(35,41,37,.025);
        }

        .dinora-summary-card::after {
          content: "";
          position: absolute;
          width: 110px;
          height: 110px;
          right: -45px;
          bottom: -55px;
          border-radius: 50%;
          background: rgba(38,57,45,.035);
        }

        .dinora-summary-card.featured {
          background: #26392d;
          border-color: #26392d;
          box-shadow: 0 16px 38px rgba(38,57,45,.16);
        }

        .dinora-summary-card.featured::after {
          background: rgba(255,255,255,.04);
        }

        .dinora-summary-label {
          position: relative;
          z-index: 1;
          margin: 0;
          color: #8c948e;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .dinora-summary-card.featured .dinora-summary-label {
          color: rgba(255,255,255,.65);
        }

        .dinora-summary-value {
          position: relative;
          z-index: 1;
          margin-top: 11px;
          color: #293a30;
          font-family: "Playfair Display", serif;
          font-size: 42px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .dinora-summary-card.featured .dinora-summary-value {
          color: #fffdf8;
        }

        .dinora-summary-caption {
          position: relative;
          z-index: 1;
          margin: 9px 0 0;
          color: #8e968f;
          font-size: 11px;
        }

        .dinora-summary-card.featured .dinora-summary-caption {
          color: rgba(255,255,255,.56);
        }

        .dinora-status-section {
          padding: 20px;
          border: 1px solid rgba(38,57,45,.07);
          border-radius: 22px;
          background: rgba(255,255,255,.84);
          box-shadow:
            0 13px 36px rgba(35,41,37,.05),
            0 2px 7px rgba(35,41,37,.02);
        }

        .dinora-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 16px;
        }

        .dinora-section-title {
          margin: 0;
          color: #344139;
          font-size: 13px;
          font-weight: 700;
        }

        .dinora-section-meta {
          color: #969c97;
          font-size: 11px;
        }

        .dinora-status-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .dinora-status-card {
          min-height: 106px;
          padding: 15px;
          border: 1px solid #ecebe5;
          border-radius: 16px;
          background: #fbfbf9;
          transition:
            transform .18s ease,
            background .18s ease,
            border-color .18s ease;
        }

        .dinora-status-card:hover {
          transform: translateY(-1px);
          background: #fff;
          border-color: #dedfd8;
        }

        .dinora-status-value {
          margin: 0;
          color: #334138;
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
        }

        .dinora-status-name {
          margin-top: 8px;
          color: #7f8881;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .dinora-status-indicator {
          width: 7px;
          height: 7px;
          margin-top: 13px;
          border-radius: 50%;
          background: #b8bdb8;
        }

        .dinora-status-card:nth-child(1) .dinora-status-indicator {
          background: #c18a59;
        }

        .dinora-status-card:nth-child(2) .dinora-status-indicator {
          background: #a68455;
        }

        .dinora-status-card:nth-child(3) .dinora-status-indicator {
          background: #748c78;
        }

        .dinora-status-card:nth-child(4) .dinora-status-indicator {
          background: #5c7a64;
        }

        .dinora-status-card:nth-child(5) .dinora-status-indicator {
          background: #6f8e76;
        }

        .dinora-status-card:nth-child(6) .dinora-status-indicator {
          background: #55755d;
        }

        .dinora-status-card:nth-child(7) .dinora-status-indicator {
          background: #a77b73;
        }

        .dinora-refresh-note {
          margin: 14px 0 0;
          color: #9a9f9a;
          text-align: center;
          font-size: 10px;
          line-height: 1.5;
        }

        .dinora-no-orders {
          padding: 21px;
          border: 1px solid rgba(38,57,45,.08);
          border-radius: 24px;
          background: rgba(255,255,255,.82);
          box-shadow: 0 15px 40px rgba(35,41,37,.05);
        }

        @media (max-width: 900px) {
          .dinora-summary-grid {
            grid-template-columns: 1fr 1fr;
          }

          .dinora-summary-card.featured {
            grid-column: span 2;
          }

          .dinora-status-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 650px) {
          .dinora-counter-page {
            padding: 18px 14px 24px;
          }

          .dinora-counter-header {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 20px;
          }

          .dinora-counter-title {
            font-size: 30px;
          }

          .dinora-counter-live {
            width: 100%;
            justify-content: center;
          }

          .dinora-summary-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .dinora-summary-card {
            min-height: 118px;
            padding: 17px;
          }

          .dinora-summary-card.featured {
            grid-column: span 2;
          }

          .dinora-summary-value {
            font-size: 34px;
          }

          .dinora-status-section {
            padding: 15px;
            border-radius: 19px;
          }

          .dinora-status-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 400px) {
          .dinora-status-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dinora-counter-page">
        <div className="dinora-counter-container">
          <header className="dinora-counter-header">
            <div className="dinora-counter-heading">
              <p className="dinora-counter-eyebrow">
                Restaurant overview
              </p>

              <h1 className="dinora-counter-title">
                Counter
              </h1>

              <p className="dinora-counter-subtitle">
                A live snapshot of your current order activity.
              </p>
            </div>

            <div className="dinora-counter-live">
              <span className="dinora-live-dot" />
              Updating automatically
            </div>
          </header>

          {entries.length === 0 ? (
            <div className="dinora-no-orders">
              <EmptyState
                icon="📊"
                title="No orders yet"
                message="Order status totals will appear here once guests start ordering."
              />
            </div>
          ) : (
            <>
              <div className="dinora-summary-grid">
                <div className="dinora-summary-card featured">
                  <p className="dinora-summary-label">
                    Total orders
                  </p>

                  <div className="dinora-summary-value">
                    {total}
                  </div>

                  <p className="dinora-summary-caption">
                    All order statuses combined
                  </p>
                </div>

                <div className="dinora-summary-card">
                  <p className="dinora-summary-label">
                    Active
                  </p>

                  <div className="dinora-summary-value">
                    {activeOrders}
                  </div>

                  <p className="dinora-summary-caption">
                    Pending, preparing & ready
                  </p>
                </div>

                <div className="dinora-summary-card">
                  <p className="dinora-summary-label">
                    Completed
                  </p>

                  <div className="dinora-summary-value">
                    {completedOrders}
                  </div>

                  <p className="dinora-summary-caption">
                    Paid & completed orders
                  </p>
                </div>
              </div>

              <section className="dinora-status-section">
                <div className="dinora-section-heading">
                  <h2 className="dinora-section-title">
                    Order status
                  </h2>

                  <span className="dinora-section-meta">
                    {entries.length} tracked statuses
                  </span>
                </div>

                <div className="dinora-status-grid">
                  {entries.map(([statusName, count]) => (
                    <div
                      key={statusName}
                      className="dinora-status-card"
                    >
                      <p className="dinora-status-value">
                        {count}
                      </p>

                      <div className="dinora-status-name">
                        {statusName}
                      </div>

                      <div
                        className="dinora-status-indicator"
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>

                <p className="dinora-refresh-note">
                  Refreshes automatically every 15 seconds.
                  Open Orders for live, per-order updates.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}