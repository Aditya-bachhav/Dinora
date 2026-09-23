import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Spinner from "../../components/ui/Spinner";
import { IconCard, IconCheck, IconInfo, IconUsers } from "../../components/ui/Icons";

const RESTAURANT_TYPES = [
  { value: "cafe", label: "Cafe" },
  { value: "quick_service", label: "Quick service" },
  { value: "casual_dining", label: "Casual dining" },
  { value: "fine_dining", label: "Fine dining" },
  { value: "cloud_kitchen", label: "Cloud kitchen" },
  { value: "bar_pub", label: "Bar / pub" },
  { value: "bakery", label: "Bakery" },
  { value: "other", label: "Other" },
];

function restaurantTypeLabel(value) {
  return RESTAURANT_TYPES.find((t) => t.value === value)?.label || value;
}

export default function Settings() {
  const { admin } = useAdminAuth();
  const toast = useToast();
  const confirm = useConfirm();

  const [status, setStatus] = useState("loading");
  const [configured, setConfigured] = useState(false);
  const [savedKeyId, setSavedKeyId] = useState(null);

  const [editing, setEditing] = useState(false);
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Business profile (crew size, restaurant type, seating capacity) —
  // collected during onboarding, editable here any time after.
  const [profileStatus, setProfileStatus] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [crewSize, setCrewSize] = useState("");
  const [restaurantType, setRestaurantType] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  async function load() {
    setStatus("loading");
    try {
      const data = await adminApi.getPaymentSettings();
      setConfigured(data.configured);
      setSavedKeyId(data.razorpay_key_id);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      toast.error(err.detail || err.message || "Could not load payment settings");
    }
  }

  async function loadProfile() {
    setProfileStatus("loading");
    try {
      const data = await adminApi.getRestaurantProfile();
      setProfile(data);
      setCrewSize(data.crew_size != null ? String(data.crew_size) : "");
      setRestaurantType(data.restaurant_type || "");
      setSeatingCapacity(data.seating_capacity != null ? String(data.seating_capacity) : "");
      setProfileStatus("ready");
    } catch (err) {
      setProfileStatus("error");
      toast.error(err.detail || err.message || "Could not load your restaurant's details");
    }
  }

  useEffect(() => {
    load();
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "loading" && profileStatus === "loading") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-settings-section]").forEach((section) => { section.style.opacity = "1"; });
      return undefined;
    }
    const animation = animate("[data-settings-section]", {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(75),
      duration: 420,
      ease: "outQuart",
    });
    return () => animation.cancel();
  }, [status, profileStatus]);

  async function handleSaveProfile() {
    const n = parseInt(crewSize, 10);
    if (!n || n <= 0) {
      setProfileError("Enter how many people are on your crew (owner included).");
      return;
    }
    const seats = seatingCapacity.trim() ? parseInt(seatingCapacity, 10) : null;
    if (seatingCapacity.trim() && (!seats || seats <= 0)) {
      setProfileError("Seating capacity should be a positive number, or left blank.");
      return;
    }
    setProfileError("");
    setProfileSaving(true);
    try {
      await adminApi.setRestaurantProfile(n, restaurantType || null, seats);
      toast.success("Restaurant details updated");
      setEditingProfile(false);
      await loadProfile();
    } catch (err) {
      setProfileError(err.detail || err.message || "Could not save your restaurant's details");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleSave() {
    if (!keyId.trim() || !keySecret.trim()) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await adminApi.setPaymentSettings(keyId.trim(), keySecret.trim());
      toast.success("Payment account connected");
      setEditing(false);
      setKeyId("");
      setKeySecret("");
      await load();
    } catch (err) {
      setError(err.detail || err.message || "Could not save payment settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    const ok = await confirm(
      "This restaurant will revert to the platform's default payment account until you connect a new one.",
      { title: "Remove payment account?", danger: true }
    );
    if (!ok) return;
    try {
      await adminApi.clearPaymentSettings();
      toast.success("Payment account removed");
      await load();
    } catch (err) {
      toast.error(err.detail || err.message || "Could not remove payment settings");
    }
  }

  return (
    <div className="admin-settings-page">
      <div className="admin-page-head">
        <div>
          <div className="settings-page-kicker"><span /> Workspace settings</div>
          <h1>Settings</h1>
          <p>Keep your restaurant profile and payment setup in one calm place.</p>
        </div>
      </div>

      <div className="settings-section" data-settings-section>
        <div className="settings-section-head">
          <div>
            <h2>Restaurant</h2>
            <p>Your account details</p>
          </div>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Admin name</span>
          <span className="settings-row-value">{admin?.name}</span>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Email</span>
          <span className="settings-row-value">{admin?.email}</span>
        </div>
      </div>

      <div className="settings-section" data-settings-section>
        <div className="settings-section-head">
          <div>
            <h2>Business details</h2>
            <p>Crew size, restaurant type, and seating — helps us tailor Dinora to your operation</p>
          </div>
        </div>

        {profileStatus === "loading" && (
          <div style={{ padding: "var(--space-4) 0" }}>
            <Spinner size={20} />
          </div>
        )}

        {profileStatus === "ready" && !editingProfile && (
          <>
            <div className="settings-row" style={{ alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div className="onboarding-option-icon" style={{ width: 32, height: 32 }}>
                  <span className="icon" style={{ width: 16, height: 16 }}><IconUsers /></span>
                </div>
                <div>
                  <div className="settings-row-label">Crew size</div>
                  <div className="settings-row-value">
                    {profile?.crew_size != null ? `${profile.crew_size} people` : "Not set yet"}
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingProfile(true)}>
                {profile?.profile_complete ? "Edit" : "Add details"}
              </button>
            </div>
            {profile?.profile_complete && (
              <>
                <div className="settings-row">
                  <span className="settings-row-label">Restaurant type</span>
                  <span className="settings-row-value">
                    {profile.restaurant_type ? restaurantTypeLabel(profile.restaurant_type) : "Not set"}
                  </span>
                </div>
                <div className="settings-row">
                  <span className="settings-row-label">Seating capacity</span>
                  <span className="settings-row-value">
                    {profile.seating_capacity != null ? `${profile.seating_capacity} guests` : "Not set"}
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {editingProfile && (
          <div style={{ marginTop: "var(--space-3)" }}>
            <div className="field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="settingsCrewSize">Crew size</label>
              <input
                id="settingsCrewSize"
                type="number"
                min="1"
                value={crewSize}
                onChange={(e) => setCrewSize(e.target.value)}
                placeholder="e.g. 6"
              />
              <small>Everyone working here day to day — kitchen, floor, and you.</small>
            </div>
            <div className="field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="settingsRestaurantType">Restaurant type</label>
              <select
                id="settingsRestaurantType"
                value={restaurantType}
                onChange={(e) => setRestaurantType(e.target.value)}
              >
                <option value="">Select one (optional)</option>
                {RESTAURANT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="settingsSeatingCapacity">Seating capacity</label>
              <input
                id="settingsSeatingCapacity"
                type="number"
                min="1"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
                placeholder="e.g. 40 (optional)"
              />
            </div>
            {profileError && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{profileError}</p>}
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                className="btn btn-ghost"
                onClick={() => { setEditingProfile(false); setProfileError(""); }}
                disabled={profileSaving}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveProfile} disabled={profileSaving}>
                {profileSaving ? <Spinner size={16} /> : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section" data-settings-section>
        <div className="settings-section-head">
          <div>
            <h2>Payment account</h2>
            <p>Connect your own Razorpay account so payments settle directly to you</p>
          </div>
        </div>

        {status === "loading" && (
          <div style={{ padding: "var(--space-4) 0" }}>
            <Spinner size={20} />
          </div>
        )}

        {status === "ready" && !editing && (
          <>
            {configured ? (
              <div className="settings-row" style={{ alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div className="onboarding-option-icon" style={{ background: "var(--color-success-soft)", color: "var(--color-success)", width: 32, height: 32 }}>
                    <span className="icon" style={{ width: 16, height: 16 }}><IconCheck /></span>
                  </div>
                  <div>
                    <div className="settings-row-label">Connected</div>
                    <div className="settings-row-value">Key ID: {savedKeyId}</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleRemove}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="settings-row" style={{ alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div className="onboarding-option-icon" style={{ width: 32, height: 32 }}>
                    <span className="icon" style={{ width: 16, height: 16 }}><IconCard /></span>
                  </div>
                  <div>
                    <div className="settings-row-label">Not connected</div>
                    <div className="settings-row-value">Using the platform's default payment account</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
                  Connect
                </button>
              </div>
            )}
          </>
        )}

        {editing && (
          <div style={{ marginTop: "var(--space-3)" }}>
            <div className="credential-callout">
              <span className="icon"><IconInfo /></span>
              <p>
                Find your Key ID and Key Secret in your Razorpay Dashboard under Settings → API
                Keys. Your key secret is encrypted before it's stored and is never shown again.
              </p>
            </div>
            <div className="field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="settingsKeyId">Razorpay Key ID</label>
              <input id="settingsKeyId" value={keyId} onChange={(e) => setKeyId(e.target.value)} placeholder="rzp_live_xxxxxxxxxxxx" />
            </div>
            <div className="field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="settingsKeySecret">Razorpay Key Secret</label>
              <input
                id="settingsKeySecret"
                type="password"
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                placeholder="Your key secret"
              />
            </div>
            {error && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{error}</p>}
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button className="btn btn-ghost" onClick={() => { setEditing(false); setError(""); }} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <Spinner size={16} /> : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
