import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import { adminApi, markOnboardingComplete } from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { IconCard, IconInfo, IconCheck, IconArrowRight, IconSkip } from "../../components/ui/Icons";

const TOTAL_STEPS = 3;

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

export default function Onboarding() {
  const { admin } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Step 1 — business details, so the owner (and Dinora) has a real
  // picture of the restaurant on file, not just its name.
  const [crewSize, setCrewSize] = useState("");
  const [restaurantType, setRestaurantType] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [profileError, setProfileError] = useState("");

  // Step 2 — payment
  const [paymentChoice, setPaymentChoice] = useState(null); // "own" | "later"
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Step 3 — initial table set
  const [tableCount, setTableCount] = useState("1");
  const [tableError, setTableError] = useState("");
  const [tableCreated, setTableCreated] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const animation = animate(pageRef.current?.querySelectorAll("[data-onboarding-reveal]"), {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(75),
      duration: 650,
      ease: "out(4)",
    });
    return () => animation.revert();
  }, [step]);

  // Onboarding is done — go straight to the dashboard, no extra confirm
  // click. Called automatically (with a short beat so the "done" state is
  // actually visible) or immediately for the explicit skip actions.
  function finish() {
    markOnboardingComplete(admin?.id);
    navigate("/admin/orders", { replace: true });
  }

  function finishWithDelay(delayMs = 900) {
    setLeaving(true);
    window.setTimeout(finish, delayMs);
  }

  function goToStep(n) {
    setStep(Math.min(TOTAL_STEPS, Math.max(1, n)));
  }

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
    setSubmitting(true);
    try {
      await adminApi.setRestaurantProfile(n, restaurantType || null, seats);
      goToStep(2);
    } catch (err) {
      setProfileError(err.detail || err.message || "Could not save your restaurant's details");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSavePayment() {
    if (!keyId.trim() || !keySecret.trim()) {
      setPaymentError("Both fields are required.");
      return;
    }
    setPaymentError("");
    setSubmitting(true);
    try {
      await adminApi.setPaymentSettings(keyId.trim(), keySecret.trim());
      toast.success("Payment account connected");
      goToStep(3);
    } catch (err) {
      setPaymentError(err.detail || err.message || "Could not save payment settings");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTable() {
    const n = parseInt(tableCount, 10);
    if (!n || n <= 0) {
      setTableError("Enter how many tables you need.");
      return;
    }
    setTableError("");
    setSubmitting(true);
    try {
      for (let tableNumber = 1; tableNumber <= n; tableNumber += 1) {
        await adminApi.createTable(tableNumber);
      }
      setTableCreated(true);
      toast.success(`${n} ${n === 1 ? "table" : "tables"} created`);
      finishWithDelay();
    } catch (err) {
      setTableError(err.detail || err.message || "Could not create table");
      setSubmitting(false);
    }
  }

  return (
    <main className="onboarding-page" ref={pageRef}>
      <section className="onboarding-story" data-onboarding-reveal aria-label="Dinora restaurant operations">
        <div className="onboarding-story-top">
          <div className="onboarding-brand">
            <div className="onboarding-brand-mark" aria-hidden="true">D</div>
            <span className="onboarding-brand-name">Dinora</span>
          </div>
          <span className="onboarding-story-status"><span />Almost there</span>
        </div>
        <div className="onboarding-story-copy">
          <p>RESTAURANT OS</p>
          <h1>Make your<br /><em>first service</em> count.</h1>
          <span>Three quick steps to shape your workspace, connect payments, and put your first table on the floor.</span>
        </div>
        <div className="onboarding-story-footer">Built for the rhythm of hospitality</div>
      </section>

      <section className="onboarding-workspace">
      <div className="onboarding-header" data-onboarding-reveal>
        <div className="onboarding-progress-label">Workspace setup <strong>0{step}</strong> / 03</div>
        <div className="onboarding-steps">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`onboarding-step-dot ${n < step ? "done" : n === step ? "active" : ""}`} />
          ))}
        </div>
      </div>

      <div className="onboarding-body" data-onboarding-reveal>
        {step === 1 && (
          <>
            <div className="onboarding-step-label">Step 1 of {TOTAL_STEPS}</div>
            <h1 className="onboarding-title">Tell us about your restaurant</h1>
            <p className="onboarding-subtitle">Just the basics — you can change these any time in Settings.</p>

            <div className="field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="crewSize">Crew size</label>
              <input
                id="crewSize"
                type="number"
                min="1"
                placeholder="e.g. 6"
                value={crewSize}
                onChange={(e) => setCrewSize(e.target.value)}
                autoFocus
              />
              <small>Everyone working here day to day — kitchen, floor, and you.</small>
            </div>

            <div className="field" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="restaurantType">Restaurant type</label>
              <select
                id="restaurantType"
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
              <label htmlFor="seatingCapacity">Seating capacity</label>
              <input
                id="seatingCapacity"
                type="number"
                min="1"
                placeholder="e.g. 40 (optional)"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
              />
            </div>

            {profileError && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{profileError}</p>}
          </>
        )}

        {step === 2 && (
          <>
            <div className="onboarding-step-label">Step 2 of {TOTAL_STEPS}</div>
            <h1 className="onboarding-title">Get paid directly</h1>
            <p className="onboarding-subtitle">Connect Razorpay so payments go straight to your bank. Skip this and do it later if you want.</p>

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
                    autoFocus
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
            <div className="onboarding-step-label">Step 3 of {TOTAL_STEPS}</div>
            <h1 className="onboarding-title">Set up your tables</h1>
            <p className="onboarding-subtitle">Tell us how many tables you have. Dinora will create numbered QR-ready tables from 1 to your count.</p>

            {!tableCreated ? (
              <>
                <div className="field" style={{ marginBottom: "var(--space-4)" }}>
                  <label htmlFor="tableCount">Number of tables</label>
                  <input
                    id="tableCount"
                    type="number"
                    min="1"
                    value={tableCount}
                    onChange={(e) => setTableCount(e.target.value)}
                    autoFocus
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
                    {tableCount} {Number(tableCount) === 1 ? "table" : "tables"} created
                  </strong>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 12.5, color: "var(--color-text-muted)" }}>
                    Taking you to your dashboard…
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="onboarding-footer" data-onboarding-reveal>
        {step === 1 ? (
          <button className="btn btn-primary" onClick={handleSaveProfile} disabled={submitting}>
            {submitting ? <Spinner size={16} /> : "Continue"}
            {!submitting && <span className="icon" style={{ width: 16, height: 16 }}><IconArrowRight /></span>}
          </button>
        ) : step === 2 && paymentChoice === "own" ? (
          <button className="btn btn-primary" onClick={handleSavePayment} disabled={submitting}>
            {submitting ? <Spinner size={16} /> : "Connect account"}
          </button>
        ) : step === 3 && !tableCreated ? (
          <>
            <button className="btn btn-ghost" onClick={() => finishWithDelay(0)} disabled={submitting || leaving}>
              Skip for now
            </button>
            <button className="btn btn-primary" onClick={handleCreateTable} disabled={submitting || leaving}>
              {submitting ? <Spinner size={16} /> : "Create table"}
            </button>
          </>
        ) : step === 3 && tableCreated ? (
          <button className="btn btn-primary" disabled>
            <Spinner size={16} />
          </button>
        ) : null}
      </div>
      </section>
    </main>
  );
}
