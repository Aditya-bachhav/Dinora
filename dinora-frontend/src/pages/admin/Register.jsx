import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/ui/Spinner";

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
    <div className="auth-page-v2">
      <div className="auth-shell-v2">
        <div className="auth-brand-v2">
          <div className="auth-brand-v2-mark" aria-hidden="true">D</div>
          <div className="auth-brand-v2-name">Dinora</div>
        </div>

        <div className="auth-card-v2">
          <h1>Set up your restaurant</h1>
          <p className="auth-subtitle-v2">Create your admin account to get started</p>

          <form onSubmit={handleSubmit} className="auth-form-v2">
            <div className="field">
              <label htmlFor="restaurantName">Restaurant name</label>
              <input
                id="restaurantName"
                placeholder="e.g. Spice Route Kitchen"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <small>At least 8 characters.</small>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? <Spinner size={16} /> : "Create account"}
            </button>
          </form>
        </div>

        <p className="auth-footer-v2">
          Already have an account? <Link to="/admin/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
