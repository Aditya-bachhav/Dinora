import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import { adminApi, markOnboardingComplete } from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { IconStore, IconCard, IconTable, IconInfo, IconCheck, IconArrowRight, IconSkip } from "../../components/ui/Icons";

const TOTAL_STEPS = 3;

export default function Onboarding() {
  const { admin } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [restaurantName, setRestaurantName] = useState(null);

  // Step 2 — payment
  const [paymentChoice, setPaymentChoice] = useState(null); // "own" | "later"
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSaved, setPaymentSaved] = useState(false);

  // Step 3 — first table
  const [tableNumber, setTableNumber] = useState("1");
  const [tableError, setTableError] = useState("");
  const [tableCreated, setTableCreated] = useState(false);

  function finish() {
    markOnboardingComplete(admin?.id);
    navigate("/admin/orders", { replace: true });
  }

  function goToStep(n) {
    setStep(Math.min(TOTAL_STEPS, Math.max(1, n)));
  }

  useEffect(() => {
    if (!admin?.restaurant_id) return;
    let cancelled = false;
    adminApi
      .getMyRestaurant(admin.restaurant_id)
      .then((data) => !cancelled && setRestaurantName(data.name))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [admin?.restaurant_id]);

  async function handleSavePayment() {
    if (!keyId.trim() || !keySecret.trim()) {
      setPaymentError("Both fields are required.");
      return;
    }
    setPaymentError("");
    setSubmitting(true);
    try {
      await adminApi.setPaymentSettings(keyId.trim(), keySecret.trim());
      setPaymentSaved(true);
      toast.success("Payment account connected");
      goToStep(3);
    } catch (err) {
      setPaymentError(err.detail || err.message || "Could not save payment settings");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTable() {
    const n = parseInt(tableNumber, 10);
    if (!n || n <= 0) {
      setTableError("Enter a valid table number.");
      return;
    }
    setTableError("");
    setSubmitting(true);
    try {
      await adminApi.createTable(n);
      setTableCreated(true);
      toast.success(`Table ${n} created`);
    } catch (err) {
      setTableError(err.detail || err.message || "Could not create table");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <div className="onboarding-brand">
          <div className="onboarding-brand-mark" aria-hidden="true">D</div>
          <span className="onboarding-brand-name">Dinora</span>
        </div>
        <div className="onboarding-steps">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`onboarding-step-dot ${n < step ? "done" : n === step ? "active" : ""}`} />
          ))}
        </div>
      </div>

      <div className="onboarding-body">
        {step === 1 && (
          <>
            <div className="onboarding-step-label">Step 1 of 3</div>
            <h1 className="onboarding-title">Welcome, {admin?.name?.split(" ")[0] || "there"}</h1>
            <p className="onboarding-subtitle">
              Here's what we've set up for your restaurant so far. You're all set on this — let's
              move on to getting paid.
            </p>

            <div className="onboarding-summary-card">
              <div className="onboarding-summary-row">
                <span className="onboarding-summary-label">Restaurant</span>
                <span className="onboarding-summary-value">
                  <span className="icon" style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 6, width: 15, height: 15, color: "var(--color-text-faint)" }}>
                    <IconStore />
                  </span>
                  {restaurantName || "Loading…"}
                </span>
              </div>
              <div className="onboarding-summary-row">
                <span className="onboarding-summary-label">Admin</span>
                <span className="onboarding-summary-value">{admin?.name}</span>
              </div>
              <div className="onboarding-summary-row">
                <span className="onboarding-summary-label">Email</span>
                <span className="onboarding-summary-value">{admin?.email}</span>
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--color-text-faint)" }}>
              Want to change your restaurant's name later? You can update it any time from Settings.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="onboarding-step-label">Step 2 of 3</div>
            <h1 className="onboarding-title">Get paid directly</h1>
            <p className="onboarding-subtitle">
              Connect your own Razorpay account so payments from your guests settle straight to
              your bank — not a shared account. You can also set this up later from Settings.
            </p>

            {!paymentChoice && (
              <>
                <button className="onboarding-option-card" onClick={() => setPaymentChoice("own")}>
                  <div className="onboarding-option-icon">
                    <span className="icon"><IconCard /></span>
                  </div>
                  <div className="onboarding-option-text">
                    <strong>Connect my Razorpay account</strong>
                    <span>Payments settle directly to your restaurant's bank account</span>
                  </div>
                </button>
                <button className="onboarding-option-card" onClick={() => goToStep(3)}>
                  <div className="onboarding-option-icon">
                    <span className="icon"><IconSkip /></span>
                  </div>
                  <div className="onboarding-option-text">
                    <strong>Set this up later</strong>
                    <span>You can add your payment details any time from Settings</span>
                  </div>
                </button>
              </>
            )}

            {paymentChoice === "own" && (
              <>
                <div className="credential-callout">
                  <span className="icon"><IconInfo /></span>
                  <p>
                    Find your Key ID and Key Secret in your Razorpay Dashboard under Settings → API
                    Keys. Your key secret is encrypted before it's stored — Dinora never displays it
                    again once saved.
                  </p>
                </div>
                <div className="field" style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="keyId">Razorpay Key ID</label>
                  <input
                    id="keyId"
                    placeholder="rzp_live_xxxxxxxxxxxx"
                    value={keyId}
                    onChange={(e) => setKeyId(e.target.value)}
                  />
                </div>
                <div className="field" style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="keySecret">Razorpay Key Secret</label>
                  <input
                    id="keySecret"
                    type="password"
                    placeholder="Your key secret"
                    value={keySecret}
                    onChange={(e) => setKeySecret(e.target.value)}
                  />
                </div>
                {paymentError && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{paymentError}</p>}
                <button className="btn btn-ghost btn-block" style={{ marginBottom: "var(--space-3)" }} onClick={() => setPaymentChoice(null)}>
                  ← Back
                </button>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div className="onboarding-step-label">Step 3 of 3</div>
            <h1 className="onboarding-title">Add your first table</h1>
            <p className="onboarding-subtitle">
              Each table gets its own QR code guests scan to open your menu and order. You can add
              the rest of your tables any time from the Tables page.
            </p>

            {!tableCreated ? (
              <>
                <div className="field" style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="tableNumber">Table number</label>
                  <input
                    id="tableNumber"
                    type="number"
                    min="1"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
                {tableError && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{tableError}</p>}
              </>
            ) : (
              <div className="onboarding-summary-card" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div className="onboarding-option-icon" style={{ background: "var(--color-success-soft)", color: "var(--color-success)" }}>
                  <span className="icon"><IconCheck /></span>
                </div>
                <div>
                  <strong style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 700 }}>
                    Table {tableNumber} created
                  </strong>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--color-text-muted)" }}>
                    Find its QR code any time on the Tables page
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="onboarding-footer">
        {step === 2 && paymentChoice === "own" ? (
          <button className="btn btn-primary" onClick={handleSavePayment} disabled={submitting}>
            {submitting ? <Spinner size={16} /> : "Connect account"}
          </button>
        ) : step === 3 && !tableCreated ? (
          <>
            <button className="btn btn-ghost" onClick={finish} disabled={submitting}>
              Skip for now
            </button>
            <button className="btn btn-primary" onClick={handleCreateTable} disabled={submitting}>
              {submitting ? <Spinner size={16} /> : "Create table"}
            </button>
          </>
        ) : step === 3 && tableCreated ? (
          <button className="btn btn-primary" onClick={finish}>
            Go to dashboard
            <span className="icon" style={{ width: 16, height: 16 }}><IconArrowRight /></span>
          </button>
        ) : step === 1 ? (
          <button className="btn btn-primary" onClick={() => goToStep(2)}>
            Continue
            <span className="icon" style={{ width: 16, height: 16 }}><IconArrowRight /></span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
