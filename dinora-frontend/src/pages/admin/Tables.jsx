import { useEffect, useState } from "react";
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
      <div>
        <table className="admin-table">
          <tbody>
            <TableRowSkeleton cols={3} />
            <TableRowSkeleton cols={3} />
          </tbody>
        </table>
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
          <h1>Tables</h1>
          <p>Manage your tables and their QR codes</p>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <input
          type="number"
          min="1"
          placeholder="Table number"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={creating}>
          {creating ? <Spinner size={16} /> : "Add table"}
        </button>
      </form>

      {tables.length === 0 ? (
        <EmptyState
          icon={<span className="icon" style={{ width: 28, height: 28 }}><IconTable /></span>}
          title="No tables yet"
          message="Add your first table above to generate its QR code."
        />
      ) : (
        <div className="table-list">
          {tables.map((table) => (
            <div key={table.id} className="card table-row-card">
              <div className="table-row-card-info">
                <div className="table-number-badge">{table.number}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14 }}>Table {table.number}</div>
                  <div className="table-status">{table.status}</div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => handleShowQr(table)}>
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
