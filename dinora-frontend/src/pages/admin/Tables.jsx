import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import Sheet from "../../components/ui/Sheet";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { IconTable } from "../../components/ui/Icons";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";

const STATUS_DOT_COLORS = {
  available: "bg-emerald-500",
  active: "bg-emerald-500",
  occupied: "bg-amber-500",
  reserved: "bg-sky-500",
};

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
      document.querySelectorAll("[data-table-card]").forEach((card) => {
        card.style.opacity = "1";
      });
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
      <div className="space-y-8 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto bg-background text-foreground" aria-busy="true">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">FLOOR PLAN</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tables</h1>
            <p className="text-sm text-muted-foreground">Setting up your guest stations…</p>
          </div>
          <div className="h-2.5 w-2.5 bg-primary animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-36 bg-muted/40 animate-pulse border border-border" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <EmptyState icon="⚠️" title="Something went wrong" message={error} />;
  }

  return (
    <div className="space-y-8 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto bg-background text-foreground">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-2 w-2 bg-primary" /> Floor plan
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Tables</h1>
          <p className="text-sm text-muted-foreground">Give every guest station a clear, scan-ready home.</p>
        </div>
      </div>

      {/* Toolbar / Create Table */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span>{tables.length}</span>
          <span className="text-xs font-normal text-muted-foreground border border-border px-2 py-0.5 bg-muted/30">
            {tables.length === 1 ? "guest station" : "guest stations"} ready
          </span>
        </div>
        <form className="flex items-center gap-2 sm:max-w-xs w-full" onSubmit={handleCreate}>
          <Input
            type="number"
            min="1"
            placeholder="New table number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            required
            aria-label="New table number"
            className="h-9 text-sm"
          />
          <Button type="submit" disabled={creating} className="h-9 px-4 font-semibold shrink-0">
            {creating ? <Spinner size={16} /> : "Add table"}
          </Button>
        </form>
      </div>

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <EmptyState
          icon={<span className="inline-block w-7 h-7 text-muted-foreground"><IconTable /></span>}
          title="No tables yet"
          message="Add your first table above to generate its QR code."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => {
            const dotColor = STATUS_DOT_COLORS[table.status] || "bg-muted-foreground";
            return (
              <Card
                key={table.id}
                className="border border-border bg-card p-5 space-y-4 flex flex-col justify-between hover:border-primary/50 transition-colors"
                data-table-card
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono block">
                      {String(table.number).padStart(2, "0")}
                    </span>
                    <strong className="block text-sm font-bold text-foreground mt-1">Table {table.number}</strong>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground capitalize border border-border px-2 py-0.5 bg-muted/20">
                    <span className={`h-1.5 w-1.5 ${dotColor}`} />
                    {table.status}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-semibold"
                  onClick={() => handleShowQr(table)}
                  aria-label={`View QR for table ${table.number}`}
                >
                  View QR
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* QR Code Preview Sheet */}
      <Sheet open={!!qrPreview} onClose={() => setQrPreview(null)} title={qrPreview ? `Table ${qrPreview.number} QR` : ""}>
        {qrPreview && (
          <div className="space-y-6 pt-4 flex flex-col items-center text-center">
            <img
              className="w-56 h-56 border border-border bg-white p-3 shadow-sm object-contain"
              src={qrPreview.url}
              alt={`Table ${qrPreview.number} QR code`}
            />

            <div
              className="w-full p-3 bg-muted/50 border border-border text-xs font-mono text-foreground break-all text-center hover:bg-muted transition-colors cursor-pointer select-all"
              onClick={handleCopyGuestUrl}
              title="Tap to copy"
            >
              {qrPreview.guestUrl}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-2">
              <Button variant="outline" size="sm" className="font-semibold" onClick={handleCopyGuestUrl}>
                Copy link
              </Button>
              <Button variant="outline" size="sm" className="font-semibold" onClick={handleDownloadQr}>
                Download
              </Button>
              <Button size="sm" className="font-semibold" onClick={() => setQrPreview(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}