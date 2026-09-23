import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperAdminAuth } from "../../context/SuperAdminAuthContext";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/ui/Spinner";

export default function SuperAdminLogin() {
  const { login } = useSuperAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/super-admin", { replace: true });
    } catch (err) {
      setError(err.detail || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="superadmin-login-page">
      <div className="superadmin-login-visual" data-animate="fade-in-up">
        <div className="superadmin-login-visual-top">
          <div className="superadmin-brand-wrap">
            <div className="superadmin-brand-mark" aria-hidden="true">D</div>
            <div className="superadmin-brand-text">
              <span className="superadmin-brand-name">Dinora</span>
              <span className="superadmin-brand-subtitle">Platform</span>
            </div>
          </div>
          <span className="superadmin-login-status">
            <span className="dot" aria-hidden="true" />
            Live
          </span>
        </div>

        <div className="superadmin-login-visual-copy">
          <p className="superadmin-login-kicker">System access</p>
          <h1>
            THE <em>ART</em> OF <br />
            MANAGING<br />
            EVERY TABLE.
          </h1>
          <p>
            Every restaurant, owner, and operational state sits in one system designed for confident oversight.
          </p>
        </div>
      </div>

      <div className="superadmin-login-panel" data-animate="fade-in-up-delay">
        <div className="superadmin-login-form-wrap">
          <div className="superadmin-login-form-header">
            <p className="superadmin-login-kicker alt">Platform</p>
            <h2>Super admin login</h2>
            <p>Dinora staff only — not for restaurant owners.</p>
          </div>

          <form onSubmit={handleSubmit} className="superadmin-login-form">
            <div className="field superadmin-field">
              <label htmlFor="saEmail">Email</label>
              <input
                id="saEmail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@dinora.app"
                required
              />
            </div>
            <div className="field superadmin-field">
              <label htmlFor="saPassword">Password</label>
              <input
                id="saPassword"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="form-error superadmin-form-error">{error}</p>}
            <button type="submit" className="superadmin-login-submit" disabled={submitting}>
              {submitting ? <Spinner size={16} /> : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
