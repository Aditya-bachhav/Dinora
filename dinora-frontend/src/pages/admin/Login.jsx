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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .dinora-auth-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 20px;
          background:
            radial-gradient(circle at 15% 15%, rgba(191, 105, 48, 0.07), transparent 28%),
            radial-gradient(circle at 85% 85%, rgba(32, 57, 42, 0.07), transparent 28%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #1d241f;
          position: relative;
          overflow: hidden;
        }

        .dinora-auth-page::before,
        .dinora-auth-page::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(2px);
        }

        .dinora-auth-page::before {
          width: 380px;
          height: 380px;
          top: -180px;
          left: -180px;
          background: rgba(190, 108, 54, 0.05);
        }

        .dinora-auth-page::after {
          width: 420px;
          height: 420px;
          bottom: -220px;
          right: -200px;
          background: rgba(47, 78, 57, 0.05);
        }

        .dinora-auth-shell {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 2;
        }

        .dinora-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }

        .dinora-brand-mark {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          margin-bottom: 13px;
          background: #26392d;
          color: #f7f3eb;
          box-shadow:
            0 12px 30px rgba(38, 57, 45, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transform: rotate(-3deg);
        }

        .dinora-brand-mark span {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          line-height: 1;
          font-weight: 700;
          transform: rotate(3deg);
        }

        .dinora-brand-name {
          font-family: "Playfair Display", serif;
          font-size: 29px;
          font-weight: 700;
          letter-spacing: -0.8px;
          color: #243229;
        }

        .dinora-brand-tagline {
          margin-top: 4px;
          font-size: 12px;
          color: #7d837e;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .dinora-auth-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(40, 54, 44, 0.08);
          border-radius: 28px;
          padding: 38px;
          box-shadow:
            0 30px 70px rgba(35, 41, 37, 0.08),
            0 4px 16px rgba(35, 41, 37, 0.04);
        }

        .dinora-auth-heading {
          margin: 0;
          text-align: center;
          font-family: "Playfair Display", serif;
          font-size: 31px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.6px;
          color: #202a24;
        }

        .dinora-auth-subtitle {
          margin: 10px 0 30px;
          text-align: center;
          color: #7a817c;
          font-size: 14px;
          line-height: 1.5;
        }

        .dinora-auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dinora-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dinora-field label {
          font-size: 12px;
          line-height: 1;
          font-weight: 700;
          color: #465149;
          letter-spacing: 0.02em;
        }

        .dinora-input {
          width: 100%;
          height: 52px;
          border: 1px solid #dfe3de;
          border-radius: 14px;
          background: #fbfbf9;
          padding: 0 15px;
          outline: none;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #202923;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .dinora-input::placeholder {
          color: #a7ada8;
        }

        .dinora-input:hover {
          border-color: #cfd5cf;
          background: #fff;
        }

        .dinora-input:focus {
          border-color: #536a5b;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(83, 106, 91, 0.10);
        }

        .dinora-form-error {
          margin: -4px 0 -4px;
          padding: 11px 13px;
          border-radius: 11px;
          border: 1px solid #ecd7d2;
          background: #fff5f3;
          color: #a04d42;
          font-size: 12px;
          line-height: 1.45;
        }

        .dinora-submit {
          width: 100%;
          height: 52px;
          margin-top: 2px;
          border: 0;
          border-radius: 14px;
          background: #26392d;
          color: #fffdf8;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 10px 22px rgba(38, 57, 45, 0.16);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .dinora-submit:hover:not(:disabled) {
          background: #31493a;
          transform: translateY(-1px);
          box-shadow: 0 14px 26px rgba(38, 57, 45, 0.20);
        }

        .dinora-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .dinora-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .dinora-auth-footer {
          margin: 24px 0 0;
          text-align: center;
          font-size: 13px;
          color: #7c827d;
        }

        .dinora-auth-footer a {
          color: #334b3c;
          font-weight: 700;
          text-decoration: none;
          margin-left: 3px;
        }

        .dinora-auth-footer a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .dinora-demo {
          margin-top: 16px;
          padding: 12px 14px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.62);
          border: 1px solid rgba(43, 53, 46, 0.07);
          text-align: center;
          font-size: 11px;
          line-height: 1.55;
          color: #8b918d;
        }

        .dinora-demo strong {
          color: #646d66;
          font-weight: 700;
        }

        @media (max-width: 520px) {
          .dinora-auth-page {
            padding: 22px 14px;
          }

          .dinora-auth-card {
            padding: 28px 22px;
            border-radius: 22px;
          }

          .dinora-auth-heading {
            font-size: 27px;
          }

          .dinora-brand {
            margin-bottom: 22px;
          }
        }
      `}</style>

      <div className="dinora-auth-page">
        <div className="dinora-auth-shell">
          <div className="dinora-brand">
            <div className="dinora-brand-mark" aria-hidden="true">
              <span>D</span>
            </div>

            <div className="dinora-brand-name">Dinora</div>
            <div className="dinora-brand-tagline">Restaurant Management</div>
          </div>

          <div className="dinora-auth-card">
            <h1 className="dinora-auth-heading">Welcome back</h1>

            <p className="dinora-auth-subtitle">
              Sign in to continue managing your restaurant.
            </p>

            <form onSubmit={handleSubmit} className="dinora-auth-form">
              <div className="dinora-field">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dinora-input"
                  required
                />
              </div>

              <div className="dinora-field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dinora-input"
                  required
                />
              </div>

              {error && <p className="dinora-form-error">{error}</p>}

              <button
                type="submit"
                className="dinora-submit"
                disabled={submitting}
              >
                {submitting ? <Spinner size={16} /> : "Sign in"}
              </button>
            </form>

            <p className="dinora-auth-footer">
              No account?
              <Link to="/admin/register">Create one</Link>
            </p>
          </div>

          <div className="dinora-demo">
            <strong>Demo access</strong>
            <br />
            admin@dinora.demo / dinora-demo-admin-123
          </div>
        </div>
      </div>
    </>
  );
}