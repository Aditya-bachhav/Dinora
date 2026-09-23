import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Eye from "lucide-react/dist/esm/icons/eye";
import EyeOff from "lucide-react/dist/esm/icons/eye-off";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import LockKeyhole from "lucide-react/dist/esm/icons/lock-keyhole";
import Utensils from "lucide-react/dist/esm/icons/utensils";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/ui/Spinner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Login() {
  const { login } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let animation;
    let cancelled = false;
    const startAnimation = () =>
      import("animejs").then(({ animate, stagger }) => {
        if (cancelled) return;
        animation = animate(pageRef.current?.querySelectorAll("[data-login-reveal]"), {
          opacity: [0, 1],
          translateY: [18, 0],
          delay: stagger(85),
          duration: 720,
          ease: "out(4)",
        });
      });
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(startAnimation, { timeout: 1200 })
      : window.setTimeout(startAnimation, 120);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof idleId === "number") window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      animation?.revert();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/admin/overview", { replace: true });
    } catch (err) {
      setError(err.detail || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full bg-background text-foreground" ref={pageRef}>
      {/* Promo / Branding Panel (Left) */}
      <section
        className="hidden lg:flex w-1/2 flex-col justify-between border-r border-sidebar-border bg-sidebar p-12 text-sidebar-foreground"
        aria-label="Dinora restaurant operations"
      >
        <div className="flex items-center justify-between" data-login-reveal>
          <Link className="flex items-center gap-3 font-bold tracking-tight text-sidebar-foreground" to="/" aria-label="Dinora home">
            <img className="h-8 w-auto object-contain" src="https://res.cloudinary.com/dtczjdk8l/image/upload/v1790181227/logowithoutbg.png" alt="" />
            <span className="text-xl">Dinora</span>
          </Link>
          <span className="inline-flex items-center gap-2 border border-sidebar-border bg-sidebar-accent/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground">
            <span className="h-2 w-2 bg-emerald-500 animate-pulse" />
            Live operations
          </span>
        </div>

        <div className="my-auto max-w-md space-y-6" data-login-reveal>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sidebar-primary">
            <Utensils size={15} /> Restaurant OS
          </p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Make every service<br />
            <em className="font-serif italic font-normal text-sidebar-primary">feel effortless.</em>
          </h1>
          <p className="text-base text-sidebar-foreground/80 leading-relaxed">
            One calm workspace for orders, tables, menus, and the moments that keep guests coming back.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-sidebar-border pt-6 text-xs font-medium text-sidebar-foreground/60" data-login-reveal>
          <span>Built for the rhythm of hospitality</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>
      </section>

      {/* Form Panel (Right) */}
      <section className="flex flex-1 flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 lg:hidden" data-login-reveal>
            <img className="h-8 w-auto object-contain" src="https://res.cloudinary.com/dtczjdk8l/image/upload/v1790181227/logowithoutbg.png" alt="" />
            <span className="text-xl font-bold tracking-tight text-foreground">Dinora</span>
          </div>

          <div className="space-y-2" data-login-reveal>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Welcome back</p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign in to your workspace</h2>
            <p className="text-sm text-muted-foreground">Pick up where your next great service begins.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-login-reveal>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-foreground uppercase tracking-wider">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-medium text-foreground uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  onClick={() => setError("Password recovery is available through your account administrator.")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 pr-10 bg-background border-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20" role="alert">
                <LockKeyhole size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-10 font-semibold gap-2" disabled={submitting}>
              {submitting ? (
                <Spinner size={16} />
              ) : (
                <>
                  Enter workspace <ArrowUpRight size={17} />
                </>
              )}
            </Button>
          </form>

          <div className="space-y-3 text-center" data-login-reveal>
            <p className="text-xs text-muted-foreground">
              New to Dinora?{" "}
              <Link to="/admin/register" className="font-semibold text-foreground hover:underline inline-flex items-center gap-0.5">
                Create your restaurant account <ArrowUpRight size={14} />
              </Link>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              By continuing, you agree to Dinora's terms and privacy policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}