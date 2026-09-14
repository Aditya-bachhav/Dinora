import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Spinner from "../../components/ui/Spinner";
import { IconCard, IconCheck, IconInfo } from "../../components/ui/Icons";

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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your restaurant's account and payment configuration</p>
        </div>
      </div>

      <div className="settings-section">
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

      <div className="settings-section">
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
