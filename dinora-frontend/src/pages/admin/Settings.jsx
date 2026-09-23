import { useEffect, useState } from "react";
import { animate, stagger } from "animejs";
import { adminApi } from "../../services/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import Spinner from "../../components/ui/Spinner";
import { IconCard, IconCheck, IconInfo, IconUsers } from "../../components/ui/Icons";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";

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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 min-h-screen bg-background text-foreground flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-primary"></span> Workspace settings
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm">Keep your restaurant profile and payment setup in one calm place.</p>
        </div>
      </div>

      {/* Admin Section */}
      <div className="bg-card border border-border flex flex-col opacity-0" data-settings-section>
        <div className="p-6 border-b border-border bg-muted/20">
          <h2 className="text-2xl font-bold tracking-tight">Restaurant</h2>
          <p className="text-sm text-muted-foreground mt-1">Your account details</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border last:border-0 gap-2">
          <span className="font-bold text-sm">Admin name</span>
          <span className="text-muted-foreground text-sm">{admin?.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border last:border-0 gap-2">
          <span className="font-bold text-sm">Email</span>
          <span className="text-muted-foreground text-sm">{admin?.email}</span>
        </div>
      </div>

      {/* Business Details Section */}
      <div className="bg-card border border-border flex flex-col opacity-0" data-settings-section>
        <div className="p-6 border-b border-border bg-muted/20">
          <h2 className="text-2xl font-bold tracking-tight">Business details</h2>
          <p className="text-sm text-muted-foreground mt-1">Crew size, restaurant type, and seating — helps us tailor Dinora to your operation</p>
        </div>

        {profileStatus === "loading" && (
          <div className="p-8 flex justify-center">
            <Spinner size={24} />
          </div>
        )}

        {profileStatus === "ready" && !editingProfile && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border last:border-0 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-muted border border-border">
                  <span className="w-4 h-4 text-muted-foreground flex items-center justify-center">
                    <IconUsers />
                  </span>
                </div>
                <div>
                  <div className="font-bold text-sm">Crew size</div>
                  <div className="text-muted-foreground text-sm mt-0.5">
                    {profile?.crew_size != null ? `${profile.crew_size} people` : "Not set yet"}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="rounded-none font-bold border-border" onClick={() => setEditingProfile(true)}>
                {profile?.profile_complete ? "Edit details" : "Add details"}
              </Button>
            </div>

            {profile?.profile_complete && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border last:border-0 gap-2">
                  <span className="font-bold text-sm">Restaurant type</span>
                  <span className="text-muted-foreground text-sm">
                    {profile.restaurant_type ? restaurantTypeLabel(profile.restaurant_type) : "Not set"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border last:border-0 gap-2">
                  <span className="font-bold text-sm">Seating capacity</span>
                  <span className="text-muted-foreground text-sm">
                    {profile.seating_capacity != null ? `${profile.seating_capacity} guests` : "Not set"}
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {editingProfile && (
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="settingsCrewSize" className="font-bold text-sm">Crew size</Label>
              <Input
                id="settingsCrewSize"
                type="number"
                min="1"
                className="rounded-none border-border focus-visible:ring-primary"
                value={crewSize}
                onChange={(e) => setCrewSize(e.target.value)}
                placeholder="e.g. 6"
              />
              <p className="text-xs text-muted-foreground">Everyone working here day to day — kitchen, floor, and you.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="settingsRestaurantType" className="font-bold text-sm">Restaurant type</Label>
              <Select
                id="settingsRestaurantType"
                className="w-full rounded-none border-border focus-visible:ring-primary bg-background"
                value={restaurantType}
                onChange={(e) => setRestaurantType(e.target.value)}
              >
                <option value="">Select one (optional)</option>
                {RESTAURANT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settingsSeatingCapacity" className="font-bold text-sm">Seating capacity</Label>
              <Input
                id="settingsSeatingCapacity"
                type="number"
                min="1"
                className="rounded-none border-border focus-visible:ring-primary"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(e.target.value)}
                placeholder="e.g. 40 (optional)"
              />
            </div>

            {profileError && (
              <div className="text-destructive font-bold text-sm p-3 bg-destructive/10 border border-destructive/20">
                {profileError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-none font-bold border-border"
                onClick={() => { setEditingProfile(false); setProfileError(""); }}
                disabled={profileSaving}
              >
                Cancel
              </Button>
              <Button className="rounded-none font-bold" onClick={handleSaveProfile} disabled={profileSaving}>
                {profileSaving ? <Spinner size={16} /> : "Save details"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Account Section */}
      <div className="bg-card border border-border flex flex-col opacity-0" data-settings-section>
        <div className="p-6 border-b border-border bg-muted/20">
          <h2 className="text-2xl font-bold tracking-tight">Payment account</h2>
          <p className="text-sm text-muted-foreground mt-1">Connect your own Razorpay account so payments settle directly to you</p>
        </div>

        {status === "loading" && (
          <div className="p-8 flex justify-center">
            <Spinner size={24} />
          </div>
        )}

        {status === "ready" && !editing && (
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {configured ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-primary/10 border border-primary/20">
                    <span className="w-4 h-4 text-primary flex items-center justify-center">
                      <IconCheck />
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm">Connected</div>
                    <div className="text-muted-foreground text-sm mt-0.5">Key ID: {savedKeyId}</div>
                  </div>
                </div>
                <Button variant="outline" className="rounded-none font-bold border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors" onClick={handleRemove}>
                  Remove
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-muted border border-border">
                    <span className="w-4 h-4 text-muted-foreground flex items-center justify-center">
                      <IconCard />
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-sm">Not connected</div>
                    <div className="text-muted-foreground text-sm mt-0.5">Using the platform's default payment account</div>
                  </div>
                </div>
                <Button className="rounded-none font-bold" onClick={() => setEditing(true)}>
                  Connect account
                </Button>
              </>
            )}
          </div>
        )}

        {editing && (
          <div className="p-6 space-y-6">
            <div className="flex gap-4 items-start bg-muted/50 border border-border p-4">
              <span className="text-primary w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                <IconInfo />
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find your Key ID and Key Secret in your Razorpay Dashboard under <strong>Settings → API Keys</strong>. 
                Your key secret is encrypted before it's stored and is never shown again.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settingsKeyId" className="font-bold text-sm">Razorpay Key ID</Label>
              <Input
                id="settingsKeyId"
                className="rounded-none border-border focus-visible:ring-primary"
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
                placeholder="rzp_live_xxxxxxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settingsKeySecret" className="font-bold text-sm">Razorpay Key Secret</Label>
              <Input
                id="settingsKeySecret"
                type="password"
                className="rounded-none border-border focus-visible:ring-primary"
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                placeholder="Your key secret"
              />
            </div>

            {error && (
              <div className="text-destructive font-bold text-sm p-3 bg-destructive/10 border border-destructive/20">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-none font-bold border-border"
                onClick={() => { setEditing(false); setError(""); }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button className="rounded-none font-bold" onClick={handleSave} disabled={saving}>
                {saving ? <Spinner size={16} /> : "Save connection"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}