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
    const startAnimation = () => import("animejs").then(({ animate, stagger }) => {
      if (cancelled) return;
      animation = animate(pageRef.current?.querySelectorAll("[data-login-reveal]"), {
        opacity: [0, 1],
        translateY: [18, 0],
        delay: stagger(85),
        duration: 720,
        ease: "out(4)",
      });
    });
    const idleId = window.requestIdleCallback ? window.requestIdleCallback(startAnimation, { timeout: 1200 }) : window.setTimeout(startAnimation, 120);
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
      navigate("/admin/orders", { replace: true });
    } catch (err) {
      setError(err.detail || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page" ref={pageRef}>
      <section className="login-story" aria-label="Dinora restaurant operations">
        <div className="login-story-top" data-login-reveal>
          <Link className="login-logo" to="/" aria-label="Dinora home">
            <span className="login-logo-mark" aria-hidden="true">D</span>
            <span>Dinora</span>
          </Link>
          <span className="login-status"><span />Live operations</span>
        </div>

        <div className="login-story-copy" data-login-reveal>
          <p className="login-eyebrow"><Utensils size={15} /> Restaurant OS</p>
          <h1>Make every service<br /><em>feel effortless.</em></h1>
          <p>One calm workspace for orders, tables, menus, and the moments that keep guests coming back.</p>
        </div>

        <div className="login-story-footer" data-login-reveal>
          <span>Built for the rhythm of hospitality</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-logo" data-login-reveal>
            <span className="login-logo-mark" aria-hidden="true">D</span>
            <span>Dinora</span>
          </div>
          <div className="login-form-heading" data-login-reveal>
            <p className="login-form-kicker">Welcome back</p>
            <h2>Sign in to your workspace</h2>
            <p>Pick up where your next great service begins.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" data-login-reveal>
            <div className="login-field">
              <label htmlFor="email">Work email</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">Password</label>
                <button type="button" className="login-forgot" onClick={() => setError("Password recovery is available through your account administrator.")}>
                  Forgot password?
                </button>
              </div>
              <div className="login-password-input">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="login-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className="login-error" role="alert"><LockKeyhole size={15} />{error}</p>}
            <Button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? <Spinner size={16} /> : <>Enter workspace <ArrowUpRight size={17} /></>}
            </Button>
          </form>

          <p className="login-register" data-login-reveal>
            New to Dinora? <Link to="/admin/register">Create your restaurant account <ArrowUpRight size={14} /></Link>
          </p>
          <p className="login-legal" data-login-reveal>By continuing, you agree to Dinora's terms and privacy policy.</p>
        </div>
      </section>
    </main>
  );
}
