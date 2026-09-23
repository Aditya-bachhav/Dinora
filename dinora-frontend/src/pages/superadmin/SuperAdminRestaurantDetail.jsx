import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { superAdminApi } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Spinner from "../../components/ui/Spinner";
import { IconArrowRight } from "../../components/ui/Icons";

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

export default function SuperAdminRestaurantDetail() {
  const { id } = useParams();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [restaurant, setRestaurant] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setStatus("loading");
    try {
      const data = await superAdminApi.getRestaurant(id);
      setRestaurant(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      toast.error(err.detail || err.message || "Could not load this restaurant");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function toggleActive() {
    const goingActive = !restaurant.is_active;
    const ok = await confirm(
      goingActive
        ? `${restaurant.name} will regain access — the owner and staff will be able to log in again.`
        : `${restaurant.name}'s owner and staff will be immediately signed out and unable to log in until reinstated.`,
      { title: goingActive ? "Reinstate restaurant?" : "Suspend restaurant?", danger: !goingActive }
    );
    if (!ok) return;
    setBusy(true);
    try {
      await superAdminApi.setRestaurantActive(restaurant.id, goingActive);
      toast.success(goingActive ? `${restaurant.name} reinstated` : `${restaurant.name} suspended`);
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not update restaurant status");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="superadmin-detail-loading">
        <Spinner size={24} />
      </div>
    );
  }

  if (status === "error" || !restaurant) {
    return (
      <div className="superadmin-detail-page superadmin-detail-empty">
        <Link to="/super-admin" className="superadmin-detail-back">← Back to restaurants</Link>
        <p>Could not load this restaurant.</p>
      </div>
    );
  }

  return (
    <div className="superadmin-detail-page" data-animate="fade-in-up">
      <Link to="/super-admin" className="superadmin-detail-back">← Back to restaurants</Link>

      <header className="superadmin-detail-header">
        <div className="superadmin-detail-heading">
          <p className="superadmin-kicker">Restaurant profile</p>
          <h1>{restaurant.name}</h1>
          <p className="superadmin-detail-location">{restaurant.location || "No location on file"}</p>
        </div>
        <span className={`superadmin-detail-status ${restaurant.is_active ? "active" : "suspended"}`}>
          {restaurant.is_active ? "Active" : "Suspended"}
        </span>
      </header>

      <div className="superadmin-detail-grid">
        <section className="superadmin-detail-card">
          <div className="superadmin-detail-card-head">
            <div>
              <p className="superadmin-card-kicker">Business profile</p>
              <h2>Operational details</h2>
            </div>
          </div>

          <div className="superadmin-detail-row">
            <span>Crew size</span>
            <strong>{restaurant.crew_size != null ? `${restaurant.crew_size} people` : "Not set"}</strong>
          </div>
          <div className="superadmin-detail-row">
            <span>Restaurant type</span>
            <strong>{restaurant.restaurant_type ? (TYPE_LABELS[restaurant.restaurant_type] || restaurant.restaurant_type) : "Not set"}</strong>
          </div>
          <div className="superadmin-detail-row">
            <span>Seating capacity</span>
            <strong>{restaurant.seating_capacity != null ? `${restaurant.seating_capacity} guests` : "Not set"}</strong>
          </div>
          <div className="superadmin-detail-row">
            <span>Tables set up</span>
            <strong>{restaurant.table_count}</strong>
          </div>
          <div className="superadmin-detail-row">
            <span>Payments</span>
            <strong>{restaurant.payment_configured ? "Own Razorpay account connected" : "Using platform's shared account"}</strong>
          </div>
          <div className="superadmin-detail-row">
            <span>On Dinora since</span>
            <strong>{restaurant.created_at ? new Date(restaurant.created_at).toLocaleDateString() : "Unknown"}</strong>
          </div>
        </section>

        <section className="superadmin-detail-card">
          <div className="superadmin-detail-card-head">
            <div>
              <p className="superadmin-card-kicker">Admin access</p>
              <h2>Accounts</h2>
            </div>
          </div>

          {restaurant.admins.length === 0 && (
            <p className="superadmin-detail-empty-copy">No admin accounts on this restaurant.</p>
          )}

          {restaurant.admins.map((a, i) => (
            <div key={a.id} className="superadmin-detail-row compact">
              <span>{a.name}{i === 0 ? " (owner)" : ""}</span>
              <strong>{a.email}</strong>
            </div>
          ))}
        </section>
      </div>

      <section className="superadmin-detail-card superadmin-detail-controls">
        <div className="superadmin-detail-card-head">
          <div>
            <p className="superadmin-card-kicker">Platform controls</p>
            <h2>{restaurant.is_active ? "Suspend access" : "Restore access"}</h2>
          </div>
        </div>

        <p className="superadmin-detail-copy">
          {restaurant.is_active
            ? "Suspending signs everyone here out immediately."
            : "Reinstating restores access right away."}
        </p>

        {restaurant.is_active ? (
          <button className="superadmin-detail-button danger" onClick={toggleActive} disabled={busy}>
            {busy ? <Spinner size={16} /> : "Suspend restaurant"}
          </button>
        ) : (
          <button className="superadmin-detail-button" onClick={toggleActive} disabled={busy}>
            {busy ? <Spinner size={16} /> : "Reinstate restaurant"}
          </button>
        )}
      </section>
    </div>
  );
}
