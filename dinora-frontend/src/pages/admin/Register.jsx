import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { Link, useNavigate } from "react-router-dom";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import Eye from "lucide-react/dist/esm/icons/eye";
import EyeOff from "lucide-react/dist/esm/icons/eye-off";
import LockKeyhole from "lucide-react/dist/esm/icons/lock-keyhole";
import Utensils from "lucide-react/dist/esm/icons/utensils";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/ui/Spinner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Register() {
  const { register } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const animation = animate(pageRef.current?.querySelectorAll("[data-register-reveal]"), {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(85),
      duration: 720,
      ease: "out(4)",
    });
    return () => animation.revert();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password, restaurantName);
      toast.success("Account created");
      // New admins land in the onboarding wizard (payment setup + first
      // table) rather than straight into an empty dashboard — see
      // pages/admin/Onboarding.jsx and AdminGuard's completeness check.
      navigate("/admin/onboarding", { replace: true });
    } catch (err) {
      setError(err.detail || err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page register-page" ref={pageRef}>
      <section className="login-story" aria-label="Dinora restaurant operations">
        <div className="login-story-top" data-register-reveal>
          <Link className="login-logo" to="/" aria-label="Dinora home">
            <span className="login-logo-mark" aria-hidden="true">D</span>
            <span>Dinora</span>
          </Link>
          <span className="login-status"><span />Your next chapter</span>
        </div>

        <div className="login-story-copy" data-register-reveal>
          <p className="login-eyebrow"><Utensils size={15} /> Restaurant OS</p>
          <h1>Give your service<br /><em>room to shine.</em></h1>
          <p>Set up one calm workspace for every table, order, dish, and moment that makes your restaurant yours.</p>
        </div>

        <div className="login-story-footer" data-register-reveal>
          <span>Built for the rhythm of hospitality</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </div>
      </section>

      <section className="login-panel register-panel">
        <div className="login-form-wrap">
          <div className="login-form-heading" data-register-reveal>
            <p className="login-form-kicker">Start your workspace</p>
            <h2>Set up your restaurant</h2>
            <p>Create your admin account and make your next service feel effortless.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form register-form" data-register-reveal>
            <div className="login-field">
              <label htmlFor="restaurantName">Restaurant name</label>
              <Input id="restaurantName" placeholder="e.g. Spice Route Kitchen" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required />
            </div>
            <div className="login-field">
              <label htmlFor="name">Your name</label>
              <Input id="name" placeholder="The person running the floor" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="login-field">
              <label htmlFor="email">Work email</label>
              <Input id="email" type="email" autoComplete="email" placeholder="you@restaurant.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-password-input">
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
                <button type="button" className="login-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className="login-error" role="alert"><LockKeyhole size={15} />{error}</p>}
            <Button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? <Spinner size={16} /> : <>Create workspace <ArrowUpRight size={17} /></>}
            </Button>
          </form>

          <p className="login-register" data-register-reveal>
            Already have an account? <Link to="/admin/login">Sign in <ArrowUpRight size={14} /></Link>
          </p>
          <p className="login-legal" data-register-reveal>By continuing, you agree to Dinora's terms and privacy policy.</p>
        </div>
      </section>
    </main>
  );
}
