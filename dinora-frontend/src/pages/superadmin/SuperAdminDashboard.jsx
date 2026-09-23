import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { superAdminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { IconStore, IconUsers, IconCard, IconTable } from "../../components/ui/Icons";

const TYPE_LABELS = {
  cafe: "Cafe",
  quick_service: "Quick service",
  casual_dining: "Casual dining",
  fine_dining: "Fine dining",
  cloud_kitchen: "Cloud kitchen",
  bar_pub: "Bar / pub",
  bakery: "Bakery",
  other: "Other",
};

export default function SuperAdminDashboard() {
  const toast = useToast();
  const confirm = useConfirm();
  const [status, setStatus] = useState("loading");
  const [restaurants, setRestaurants] = useState([]);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setStatus("loading");
    try {
      const data = await superAdminApi.listRestaurants();
      setRestaurants(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      toast.error(err.detail || err.message || "Could not load restaurants");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleActive(r) {
    const goingActive = !r.is_active;
    const ok = await confirm(
      goingActive
        ? `${r.name} will regain access — the owner and staff will be able to log in again.`
        : `${r.name}'s owner and staff will be immediately signed out and unable to log in until reinstated.`,
      { title: goingActive ? "Reinstate restaurant?" : "Suspend restaurant?", danger: !goingActive }
    );
    if (!ok) return;
    setBusyId(r.id);
    try {
      await superAdminApi.setRestaurantActive(r.id, goingActive);
      toast.success(goingActive ? `${r.name} reinstated` : `${r.name} suspended`);
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not update restaurant status");
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = restaurants.filter((r) => r.is_active).length;
  const totalCrew = restaurants.reduce((sum, r) => sum + (r.crew_size || 0), 0);

  return (
    <div className="superadmin-page">
      <header className="superadmin-page-head">
        <p className="superadmin-kicker">Platform</p>
        <h1>Restaurants</h1>
        <p className="superadmin-page-subtitle">Every restaurant on Dinora — owners, crew size, and account status.</p>
      </header>

      {status !== "loading" && restaurants.length > 0 && (
        <div className="superadmin-stats">
          <div className="superadmin-stat-card">
            <span className="superadmin-stat-label">Total</span>
            <strong>{restaurants.length}</strong>
          </div>
          <div className="superadmin-stat-card">
            <span className="superadmin-stat-label">Active</span>
            <strong>{activeCount}</strong>
          </div>
          <div className="superadmin-stat-card">
            <span className="superadmin-stat-label">Suspended</span>
            <strong>{restaurants.length - activeCount}</strong>
          </div>
          <div className="superadmin-stat-card">
            <span className="superadmin-stat-label">Crew</span>
            <strong>{totalCrew}</strong>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="superadmin-loading">
          <Spinner size={24} />
        </div>
      )}

      {status === "ready" && restaurants.length === 0 && (
        <EmptyState icon={<IconStore />} title="No restaurants yet" message="Restaurants will appear here as soon as owners register." />
      )}

      {status === "ready" && restaurants.map((r) => (
        <article key={r.id} className={`superadmin-restaurant-card ${r.is_active ? "" : "suspended"}`}>
          <div className="superadmin-restaurant-card-top">
            <div className="superadmin-restaurant-main">
              <Link to={`/super-admin/restaurants/${r.id}`} className="superadmin-restaurant-name">
                {r.name}
              </Link>
              <div className="superadmin-restaurant-owner">
                {r.owner ? `${r.owner.name} · ${r.owner.email}` : "No owner account"}
              </div>
            </div>

            <span className={`superadmin-status ${r.is_active ? "active" : "suspended"}`}>
              {r.is_active ? "Active" : "Suspended"}
            </span>
          </div>

          <div className="superadmin-restaurant-meta">
            {r.restaurant_type && (
              <span className="superadmin-meta-pill">{TYPE_LABELS[r.restaurant_type] || r.restaurant_type}</span>
            )}
            <span className="superadmin-meta-pill">
              <span className="icon" style={{ width: 12, height: 12 }}><IconUsers /></span>
              {r.crew_size != null ? `${r.crew_size} crew` : "Crew size not set"}
            </span>
            {r.seating_capacity != null && (
              <span className="superadmin-meta-pill">{r.seating_capacity} seats</span>
            )}
            <span className="superadmin-meta-pill">
              <span className="icon" style={{ width: 12, height: 12 }}><IconTable /></span>
              {r.table_count} table{r.table_count === 1 ? "" : "s"}
            </span>
            <span className="superadmin-meta-pill">
              <span className="icon" style={{ width: 12, height: 12 }}><IconCard /></span>
              {r.payment_configured ? "Payments connected" : "Using platform payments"}
            </span>
            <span className="superadmin-meta-pill">{r.staff_count} account{r.staff_count === 1 ? "" : "s"}</span>
          </div>

          <div className="superadmin-restaurant-actions">
            {r.is_active ? (
              <button className="superadmin-action-btn" onClick={() => toggleActive(r)} disabled={busyId === r.id}>
                {busyId === r.id ? <Spinner size={14} /> : "Suspend"}
              </button>
            ) : (
              <button className="superadmin-action-btn primary" onClick={() => toggleActive(r)} disabled={busyId === r.id}>
                {busyId === r.id ? <Spinner size={14} /> : "Reinstate"}
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
