import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import { adminApi, markOnboardingComplete } from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
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

  // Step 1 — business details
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
    <main className="flex min-h-screen w-full bg-background text-foreground" ref={pageRef}>
      {/* Branding / Story Panel (Left) */}
      <section
        className="hidden lg:flex w-1/2 flex-col justify-between border-r border-sidebar-border bg-sidebar p-12 text-sidebar-foreground"
        data-onboarding-reveal
        aria-label="Dinora restaurant operations"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold tracking-tight text-sidebar-foreground">
            <div className="flex h-8 w-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg" aria-hidden="true">
              D
            </div>
            <span className="text-xl">Dinora</span>
          </div>
          <span className="inline-flex items-center gap-2 border border-sidebar-border bg-sidebar-accent/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground">
            <span className="h-2 w-2 bg-emerald-500 animate-pulse" />
            Almost there
          </span>
        </div>

        <div className="my-auto max-w-md space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-primary">
            Restaurant OS
          </p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Make your<br />
            <em className="font-serif italic font-normal text-sidebar-primary">first service</em> count.
          </h1>
          <p className="text-base text-sidebar-foreground/80 leading-relaxed">
            Three quick steps to shape your workspace, connect payments, and put your first table on the floor.
          </p>
        </div>

        <div className="border-t border-sidebar-border pt-6 text-xs font-medium text-sidebar-foreground/60">
          Built for the rhythm of hospitality
        </div>
      </section>

      {/* Steps / Form Workspace (Right) */}
      <section className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-2xl mx-auto w-full">
        {/* Step Progress Header */}
        <div className="space-y-4" data-onboarding-reveal>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Workspace setup <strong className="text-foreground">0{step}</strong> / 03
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 w-8 transition-colors ${
                    n < step
                      ? "bg-emerald-500"
                      : n === step
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Body */}
        <div className="my-auto py-8 space-y-6" data-onboarding-reveal>
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Step 1 of {TOTAL_STEPS}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Tell us about your restaurant
                </h1>
                <p className="text-sm text-muted-foreground">
                  Just the basics — you can change these any time in Settings.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="crewSize" className="text-xs font-medium text-foreground uppercase tracking-wider">
                    Crew size
                  </Label>
                  <Input
                    id="crewSize"
                    type="number"
                    min="1"
                    placeholder="e.g. 6"
                    value={crewSize}
                    onChange={(e) => setCrewSize(e.target.value)}
                    autoFocus
                    className="h-10 bg-background border-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Everyone working here day to day — kitchen, floor, and you.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="restaurantType" className="text-xs font-medium text-foreground uppercase tracking-wider">
                    Restaurant type
                  </Label>
                  <Select
                    id="restaurantType"
                    value={restaurantType}
                    onChange={(e) => setRestaurantType(e.target.value)}
                    className="h-10 w-full bg-background border border-input text-sm px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select one (optional)</option>
                    {RESTAURANT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seatingCapacity" className="text-xs font-medium text-foreground uppercase tracking-wider">
                    Seating capacity
                  </Label>
                  <Input
                    id="seatingCapacity"
                    type="number"
                    min="1"
                    placeholder="e.g. 40 (optional)"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                    className="h-10 bg-background border-input"
                  />
                </div>

                {profileError && (
                  <p className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 p-3" role="alert">
                    {profileError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Step 2 of {TOTAL_STEPS}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Get paid directly
                </h1>
                <p className="text-sm text-muted-foreground">
                  Connect Razorpay so payments go straight to your bank. Skip this and do it later if you want.
                </p>
              </div>

              {!paymentChoice && (
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full border border-border p-4 text-left hover:bg-accent/50 transition-colors flex items-start gap-4 group"
                    onClick={() => setPaymentChoice("own")}
                  >
                    <div className="p-2 border border-border bg-background text-foreground shrink-0 group-hover:border-primary">
                      <IconCard />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Connect my Razorpay account</p>
                      <p className="text-xs text-muted-foreground">Payments settle directly to your restaurant's bank account</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="w-full border border-border p-4 text-left hover:bg-accent/50 transition-colors flex items-start gap-4 group"
                    onClick={() => goToStep(3)}
                  >
                    <div className="p-2 border border-border bg-background text-foreground shrink-0 group-hover:border-primary">
                      <IconSkip />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Set this up later</p>
                      <p className="text-xs text-muted-foreground">You can add your payment details any time from Settings</p>
                    </div>
                  </button>
                </div>
              )}

              {paymentChoice === "own" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/40 border border-border text-xs text-muted-foreground">
                    <div className="shrink-0 pt-0.5 text-foreground">
                      <IconInfo />
                    </div>
                    <p className="leading-relaxed">
                      Find your Key ID and Key Secret in your Razorpay Dashboard under Settings → API Keys.
                      Your key secret is encrypted before it's stored — Dinora never displays it again once saved.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="keyId" className="text-xs font-medium text-foreground uppercase tracking-wider">
                      Razorpay Key ID
                    </Label>
                    <Input
                      id="keyId"
                      placeholder="rzp_live_xxxxxxxxxxxx"
                      value={keyId}
                      onChange={(e) => setKeyId(e.target.value)}
                      autoFocus
                      className="h-10 bg-background border-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="keySecret" className="text-xs font-medium text-foreground uppercase tracking-wider">
                      Razorpay Key Secret
                    </Label>
                    <Input
                      id="keySecret"
                      type="password"
                      placeholder="Your key secret"
                      value={keySecret}
                      onChange={(e) => setKeySecret(e.target.value)}
                      className="h-10 bg-background border-input"
                    />
                  </div>

                  {paymentError && (
                    <p className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 p-3" role="alert">
                      {paymentError}
                    </p>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start px-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setPaymentChoice(null)}
                  >
                    ← Back
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Step 3 of {TOTAL_STEPS}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Set up your tables
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tell us how many tables you have. Dinora will create numbered QR-ready tables from 1 to your count.
                </p>
              </div>

              {!tableCreated ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="tableCount" className="text-xs font-medium text-foreground uppercase tracking-wider">
                      Number of tables
                    </Label>
                    <Input
                      id="tableCount"
                      type="number"
                      min="1"
                      value={tableCount}
                      onChange={(e) => setTableCount(e.target.value)}
                      autoFocus
                      className="h-10 bg-background border-input"
                    />
                  </div>

                  {tableError && (
                    <p className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 p-3" role="alert">
                      {tableError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <div className="flex h-10 w-10 items-center justify-center bg-emerald-500/20 shrink-0">
                    <IconCheck />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {tableCount} {Number(tableCount) === 1 ? "table" : "tables"} created
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Taking you to your dashboard…
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6" data-onboarding-reveal>
          {step === 1 ? (
            <Button className="font-semibold gap-2 min-w-[120px]" onClick={handleSaveProfile} disabled={submitting}>
              {submitting ? <Spinner size={16} /> : "Continue"}
              {!submitting && <IconArrowRight />}
            </Button>
          ) : step === 2 && paymentChoice === "own" ? (
            <Button className="font-semibold min-w-[140px]" onClick={handleSavePayment} disabled={submitting}>
              {submitting ? <Spinner size={16} /> : "Connect account"}
            </Button>
          ) : step === 3 && !tableCreated ? (
            <>
              <Button variant="ghost" onClick={() => finishWithDelay(0)} disabled={submitting || leaving}>
                Skip for now
              </Button>
              <Button className="font-semibold min-w-[120px]" onClick={handleCreateTable} disabled={submitting || leaving}>
                {submitting ? <Spinner size={16} /> : "Create table"}
              </Button>
            </>
          ) : step === 3 && tableCreated ? (
            <Button disabled className="min-w-[120px]">
              <Spinner size={16} />
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}