import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import { IconTable } from "../../components/ui/Icons";

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

  useEffect(() => {
    if (status !== "ready" || tables.length === 0) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-table-card]").forEach((card) => { card.style.opacity = "1"; });
      return undefined;
    }
    const animation = animate("[data-table-card]", {
      opacity: [0, 1],
      scale: [0.92, 1],
      translateY: [12, 0],
      delay: stagger(55),
      duration: 480,
      ease: "outBack",
    });
    return () => animation.cancel();
  }, [status, tables.length]);

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
      setQrPreview({ tableId: table.id, url, guestUrl, number: table.number });
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
      <div className="admin-tables-page admin-tables-loading" aria-busy="true">
        <div className="admin-page-head">
          <div>
            <div className="tables-page-kicker">FLOOR PLAN</div>
            <h1>Tables</h1>
            <p>Setting up your guest stations…</p>
          </div>
          <div className="tables-loading-pulse" />
        </div>
        <div className="tables-map-skeleton">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} />)}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState icon="⚠️" title="Something went wrong" message={error} />;
  }

  return (
    <div className="admin-tables-page">
      <div className="admin-page-head">
        <div>
          <div className="tables-page-kicker"><span /> Floor plan</div>
          <h1>Tables</h1>
          <p>Give every guest station a clear, scan-ready home.</p>
        </div>
      </div>

      <div className="tables-toolbar">
        <div className="tables-stat-line">
          <strong>{tables.length}</strong>
          <span>{tables.length === 1 ? "guest station" : "guest stations"} ready</span>
        </div>
        <form className="tables-add-form" onSubmit={handleCreate}>
          <input
            type="number"
            min="1"
            placeholder="New table number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            required
            aria-label="New table number"
          />
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? <Spinner size={16} /> : "Add table"}
          </button>
        </form>
      </div>

      {tables.length === 0 ? (
        <EmptyState
          icon={<span className="icon" style={{ width: 28, height: 28 }}><IconTable /></span>}
          title="No tables yet"
          message="Add your first table above to generate its QR code."
        />
      ) : (
        <div className="tables-simple-grid">
          {tables.map((table) => (
            <div key={table.id} className="table-simple-card" data-table-card>
              <div className="table-simple-number">{String(table.number).padStart(2, "0")}</div>
              <div className="table-simple-details">
                <strong>Table {table.number}</strong>
                <span><i className={`table-simple-dot table-simple-dot-${table.status}`} />{table.status}</span>
              </div>
              <button className="table-simple-qr" onClick={() => handleShowQr(table)} aria-label={`View QR for table ${table.number}`}>
                View QR
              </button>
            </div>
          ))}
        </div>
      )}

      <Sheet open={!!qrPreview} onClose={() => setQrPreview(null)} title={qrPreview ? `Table ${qrPreview.number} QR` : ""}>
        {qrPreview && (
          <div className="qr-sheet-content">
            <img className="qr-image" src={qrPreview.url} alt="Table QR code" />
            <div className="qr-url-box" onClick={handleCopyGuestUrl} style={{ cursor: "pointer" }} title="Tap to copy">
              {qrPreview.guestUrl}
            </div>
            <div className="qr-sheet-actions">
              <button className="btn btn-secondary" onClick={handleCopyGuestUrl}>
                Copy link
              </button>
              <button className="btn btn-secondary" onClick={handleDownloadQr}>
                Download
              </button>
              <button className="btn btn-primary" onClick={() => setQrPreview(null)}>
                Done
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
