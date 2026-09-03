import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

export default function Tables() {
  const toast = useToast();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [creating, setCreating] = useState(false);
  const [qrPreview, setQrPreview] = useState(null); // { tableId, url, guestUrl, number }

  async function load() {
    setStatus("loading");
    try {
      const list = await adminApi.listTables();
      setTables(list);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.detail || err.message || "Could not load tables");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const number = parseInt(newNumber, 10);
    if (!number || number <= 0) return;

    setCreating(true);
    try {
      await adminApi.createTable(number);
      setNewNumber("");
      toast.success(`Table ${number} added`);
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not create table");
    } finally {
      setCreating(false);
    }
  }

  async function handleShowQr(table) {
    // The QR encodes a link the guest's phone opens directly:
    //   <frontend origin>/t/<table token>
    // Never the numeric table id — see backend README on why.
    const guestUrl = `${window.location.origin}/t/${table.token}`;

    try {
      const blob = await adminApi.fetchTableQrBlob(table.token, guestUrl);
      const url = URL.createObjectURL(blob);

      setQrPreview({
        tableId: table.id,
        url,
        guestUrl,
        number: table.number,
      });
    } catch (err) {
      toast.error(err.detail || err.message || "Could not generate QR code");
    }
  }

  function handleDownloadQr() {
    if (!qrPreview) return;

    const a = document.createElement("a");
    a.href = qrPreview.url;
    a.download = `dinora-table-${qrPreview.number}-qr.png`;
    a.click();
  }

  async function handleCopyGuestUrl() {
    if (!qrPreview) return;

    try {
      await navigator.clipboard.writeText(qrPreview.guestUrl);
      toast.success("Guest link copied");
    } catch {
      const input = document.createElement("textarea");
      input.value = qrPreview.guestUrl;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();

      if (copied) {
        toast.success("Guest link copied");
      } else {
        toast.error("Could not copy guest link");
      }
    }
  }

  if (status === "loading") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-tables-loading {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
            font-family: "DM Sans", sans-serif;
          }

          .dinora-loading-card {
            width: 52px;
            height: 52px;
            display: grid;
            place-items: center;
            border-radius: 16px;
            background: rgba(255,255,255,.84);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 12px 30px rgba(35,41,37,.06);
          }
        `}</style>

        <div className="dinora-tables-loading">
          <div className="dinora-loading-card">
            <Spinner size={24} />
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <style>{`
          .dinora-tables-error {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
          }

          .dinora-error-card {
            width: 100%;
            max-width: 520px;
            padding: 34px;
            border-radius: 24px;
            background: rgba(255,255,255,.88);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 25px 65px rgba(35,41,37,.07);
          }
        `}</style>

        <div className="dinora-tables-error">
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .dinora-tables-page {
          min-height: 100%;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 25%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #202923;
        }

        .dinora-tables-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .dinora-tables-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 27px;
        }

        .dinora-tables-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-tables-eyebrow {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          color: #8c928d;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .dinora-tables-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 35px;
          line-height: 1;
          letter-spacing: -.8px;
          color: #26372d;
        }

        .dinora-tables-subtitle {
          margin: 2px 0 0;
          color: #858b86;
          font-size: 13px;
        }

        .dinora-create-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px;
          margin-bottom: 21px;
          border-radius: 20px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow: 0 12px 32px rgba(35,41,37,.045);
        }

        .dinora-create-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dinora-create-title {
          margin: 0;
          color: #344139;
          font-size: 13px;
          font-weight: 700;
        }

        .dinora-create-hint {
          margin: 0;
          color: #929992;
          font-size: 11px;
        }

        .dinora-create-form {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dinora-table-input {
          width: 160px;
          height: 42px;
          padding: 0 13px;
          border: 1px solid #dfe3dd;
          border-radius: 11px;
          background: #fbfbf9;
          color: #263129;
          font: 400 12px "DM Sans", sans-serif;
          outline: none;
          transition: .18s ease;
        }

        .dinora-table-input::placeholder {
          color: #a7ada8;
        }

        .dinora-table-input:hover {
          border-color: #cfd5cf;
          background: #fff;
        }

        .dinora-table-input:focus {
          border-color: #5b715f;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(91,113,95,.09);
        }

        .dinora-add-table-btn {
          height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 11px;
          background: #26392d;
          color: #fffdf8;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
          transition: .18s ease;
        }

        .dinora-add-table-btn:hover:not(:disabled) {
          background: #31493a;
          transform: translateY(-1px);
          box-shadow: 0 11px 23px rgba(38,57,45,.18);
        }

        .dinora-add-table-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .dinora-tables-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .dinora-table-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px;
          border-radius: 20px;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 12px 35px rgba(35,41,37,.055),
            0 2px 7px rgba(35,41,37,.025);
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            border-color .2s ease;
        }

        .dinora-table-card:hover {
          transform: translateY(-2px);
          border-color: rgba(38,57,45,.11);
          box-shadow:
            0 18px 40px rgba(35,41,37,.075),
            0 3px 10px rgba(35,41,37,.035);
        }

        .dinora-table-info {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .dinora-table-number {
          width: 50px;
          height: 50px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #26392d;
          color: #fffdf8;
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
        }

        .dinora-table-details {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-table-name {
          color: #354139;
          font-size: 14px;
          font-weight: 700;
        }

        .dinora-table-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #8b938c;
          font-size: 11px;
          text-transform: capitalize;
        }

        .dinora-table-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8ba48d;
        }

        .dinora-view-qr {
          height: 38px;
          padding: 0 13px;
          border-radius: 10px;
          border: 1px solid #dfe2dc;
          background: #fff;
          color: #445249;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          white-space: nowrap;
          transition: .18s ease;
        }

        .dinora-view-qr:hover {
          background: #f6f7f3;
          border-color: #cad1ca;
          transform: translateY(-1px);
        }

        .dinora-empty-state {
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 15px 40px rgba(35,41,37,.05);
        }

        /* QR Sheet */

        .dinora-qr-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 17px;
        }

        .dinora-qr-image-wrap {
          width: 230px;
          height: 230px;
          padding: 13px;
          display: grid;
          place-items: center;
          border-radius: 21px;
          background: #fff;
          border: 1px solid #e9e7e0;
          box-shadow:
            0 15px 35px rgba(35,41,37,.08),
            0 3px 9px rgba(35,41,37,.03);
        }

        .dinora-qr-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .dinora-qr-description {
          margin: 0;
          text-align: center;
          color: #858c86;
          font-size: 12px;
          line-height: 1.5;
          max-width: 330px;
        }

        .dinora-qr-url-box {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 8px 13px;
          border-radius: 11px;
          border: 1px solid #e4e4de;
          background: #f8f8f5;
          color: #687169;
          font-size: 11px;
          line-height: 1.5;
          overflow-wrap: anywhere;
          text-align: center;
        }

        .dinora-qr-url {
          min-width: 0;
          flex: 1;
        }

        .dinora-copy-url-btn {
          flex: 0 0 auto;
          height: 32px;
          padding: 0 10px;
          border: 1px solid #d8ddd6;
          border-radius: 8px;
          background: #fff;
          color: #445249;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-copy-url-btn:hover {
          background: #f0f2ed;
          border-color: #c6cec5;
        }

        .dinora-qr-actions {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 2px;
        }

        .dinora-qr-btn {
          height: 45px;
          border-radius: 12px;
          border: 1px solid transparent;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-qr-btn-secondary {
          background: #f0eee8;
          border-color: #e5e2da;
          color: #48554c;
        }

        .dinora-qr-btn-secondary:hover {
          background: #e8e5dd;
        }

        .dinora-qr-btn-primary {
          background: #26392d;
          color: #fffdf8;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
        }

        .dinora-qr-btn-primary:hover {
          background: #31493a;
          transform: translateY(-1px);
        }

        @media (max-width: 760px) {
          .dinora-tables-page {
            padding: 18px 14px 24px;
          }

          .dinora-tables-header {
            align-items: flex-start;
          }

          .dinora-tables-title {
            font-size: 30px;
          }

          .dinora-create-panel {
            align-items: stretch;
            flex-direction: column;
          }

          .dinora-create-form {
            width: 100%;
          }

          .dinora-table-input {
            flex: 1;
            width: auto;
          }

          .dinora-add-table-btn {
            flex: 0 0 auto;
          }

          .dinora-tables-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {
          .dinora-create-form {
            flex-direction: column;
          }

          .dinora-table-input,
          .dinora-add-table-btn {
            width: 100%;
          }

          .dinora-table-card {
            padding: 15px;
          }

          .dinora-table-number {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }

          .dinora-view-qr {
            padding: 0 10px;
          }
        }
      `}</style>

      <div className="dinora-tables-page">
        <div className="dinora-tables-container">
          <header className="dinora-tables-header">
            <div className="dinora-tables-heading">
              <p className="dinora-tables-eyebrow">
                Restaurant setup
              </p>

              <h1 className="dinora-tables-title">
                Tables
              </h1>

              <p className="dinora-tables-subtitle">
                Manage dining tables and generate guest QR codes.
              </p>
            </div>
          </header>

          <form
            className="dinora-create-panel"
            onSubmit={handleCreate}
          >
            <div className="dinora-create-copy">
              <p className="dinora-create-title">
                Add a new table
              </p>

              <p className="dinora-create-hint">
                Use the physical table number from your restaurant.
              </p>
            </div>

            <div className="dinora-create-form">
              <input
                className="dinora-table-input"
                type="number"
                min="1"
                placeholder="Table number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                required
              />

              <button
                type="submit"
                className="dinora-add-table-btn"
                disabled={creating}
              >
                {creating ? (
                  <Spinner size={16} />
                ) : (
                  <>
                    <span>+</span>
                    Add table
                  </>
                )}
              </button>
            </div>
          </form>

          {tables.length === 0 ? (
            <div className="dinora-empty-state">
              <EmptyState
                icon="🪑"
                title="No tables yet"
                message="Add your first table above to generate its QR code."
              />
            </div>
          ) : (
            <div className="dinora-tables-grid">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="dinora-table-card"
                >
                  <div className="dinora-table-info">
                    <div className="dinora-table-number">
                      {table.number}
                    </div>

                    <div className="dinora-table-details">
                      <div className="dinora-table-name">
                        Table {table.number}
                      </div>

                      <div className="dinora-table-status">
                        {table.status}
                      </div>
                    </div>
                  </div>

                  <button
                    className="dinora-view-qr"
                    onClick={() => handleShowQr(table)}
                  >
                    View QR
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet
        open={!!qrPreview}
        onClose={() => setQrPreview(null)}
        title={
          qrPreview
            ? `Table ${qrPreview.number} QR`
            : ""
        }
      >
        {qrPreview && (
          <div className="dinora-qr-content">
            <div className="dinora-qr-image-wrap">
              <img
                className="dinora-qr-image"
                src={qrPreview.url}
                alt={`QR code for Table ${qrPreview.number}`}
              />
            </div>

            <p className="dinora-qr-description">
              Guests can scan this code from the table to
              open the Dinora menu and place an order.
            </p>

            <div className="dinora-qr-url-box">
              <span className="dinora-qr-url">
                {qrPreview.guestUrl}
              </span>

              <button
                type="button"
                className="dinora-copy-url-btn"
                onClick={handleCopyGuestUrl}
              >
                Copy link
              </button>
            </div>

            <div className="dinora-qr-actions">
              <button
                className="dinora-qr-btn dinora-qr-btn-secondary"
                onClick={handleDownloadQr}
              >
                Download QR
              </button>

              <button
                className="dinora-qr-btn dinora-qr-btn-primary"
                onClick={() => setQrPreview(null)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}