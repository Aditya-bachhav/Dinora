import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { adminApi, isOnboardingComplete, markOnboardingComplete } from "../services/api";
import Spinner from "./ui/Spinner";

// This is a UI convenience only — it stops a logged-out browser from
// rendering admin screens. It is NOT the security boundary: every admin
// route on the backend independently requires a valid bearer token
// (current_admin dependency) and re-checks restaurant ownership on every
// request. A user bypassing this guard client-side gains nothing, because
// the backend will still reject unauthenticated or cross-restaurant calls.
export default function AdminGuard({ children }) {
  const { isAuthenticated, admin, loading } = useAdminAuth();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!admin) return;

    // Fast path: already confirmed done for this admin, skip the API round
    // trip entirely.
    if (isOnboardingComplete(admin.id)) {
      setNeedsOnboarding(false);
      setCheckingOnboarding(false);
      return;
    }

    // Otherwise check REAL backend state rather than trusting the client
    // flag alone — this matters for admins who existed before onboarding
    // was added: they should never be forced through the wizard just
    // because the local flag was never set on their device. Having at
    // least one table, OR having payment settings configured, is treated
    // as clear evidence this restaurant is already up and running.
    let cancelled = false;
    async function check() {
      try {
        const [tables, paymentSettings] = await Promise.all([
          adminApi.listTables(),
          adminApi.getPaymentSettings(),
        ]);
        let hasMenu = false;
        try {
          // Best-effort extra signal: a restaurant with menu categories
          // already set up is clearly not a fresh signup either, even if
          // it happens to have zero tables yet. This call is guest-facing
          // and single-tenant-resolved (see backend restaurant_service.py)
          // so it can fail once multiple restaurants exist — that's fine,
          // it just means this signal is skipped, not that the whole
          // completeness check fails.
          const categories = await adminApi.listCategories();
          hasMenu = categories.length > 0;
        } catch {
          hasMenu = false;
        }

        const alreadySetUp = tables.length > 0 || paymentSettings.configured || hasMenu;
        if (cancelled) return;
        if (alreadySetUp) {
          markOnboardingComplete(admin.id);
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(true);
        }
      } catch {
        // If the check itself fails (e.g. transient network issue), fail
        // open rather than trapping an existing admin in a redirect loop —
        // they land on their normal dashboard, which independently handles
        // its own loading/error states.
        if (!cancelled) setNeedsOnboarding(false);
      } finally {
        if (!cancelled) setCheckingOnboarding(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [admin]);

  if (loading || (isAuthenticated && checkingOnboarding)) {
    return (
      <div className="page-loading">
        <Spinner size={24} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const onOnboardingRoute = location.pathname.startsWith("/admin/onboarding");
  if (!onOnboardingRoute && needsOnboarding) {
    return <Navigate to="/admin/onboarding" replace />;
  }

  return children;
}
