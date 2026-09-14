import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/ui/Spinner";

export default function Login() {
  const { login } = useAdminAuth();
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
      navigate("/admin/orders", { replace: true });
    } catch (err) {
      setError(err.detail || err.message || "Login failed");
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
          <h1>Admin login</h1>
          <p className="auth-subtitle-v2">Sign in to manage your restaurant</p>

          <form onSubmit={handleSubmit} className="auth-form-v2">
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? <Spinner size={16} /> : "Sign in"}
            </button>
          </form>
        </div>

        <p className="auth-footer-v2">
          No account? <Link to="/admin/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
