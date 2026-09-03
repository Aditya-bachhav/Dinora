import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { guestApi, getStoredSessionId, setStoredSessionId } from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

// Route: /t/:tableToken
// This is the ONLY entry point into the guest flow. tableToken is the
// opaque token from the table's QR code — never a numeric database id.
// GET /api/tables/{token} intentionally 404s for a numeric id like "1".
export default function TableLanding() {
  const { tableToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | error
  const [error, setError] = useState("");

  const start = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      await guestApi.getTable(tableToken);
      // Idempotent: scanning the same QR again resumes the same active
      // session rather than creating a new one each time.
      const session = await guestApi.startSession(tableToken);
      setStoredSessionId(tableToken, session.session_id);
      navigate(`/t/${tableToken}/menu`, { replace: true });
    } catch (err) {
      setStatus("error");
      setError(err.detail || err.message || "Could not load this table");
    }
  }, [tableToken, navigate]);

  useEffect(() => {
    const existing = getStoredSessionId(tableToken);
    if (existing) {
      navigate(`/t/${tableToken}/menu`, { replace: true });
      return;
    }
    start();
  }, [tableToken, navigate, start]);

  if (status === "error") {
    return (
      <div className="table-landing">
        <div className="table-landing-card">
          <EmptyState
            icon="⚠️"
            title="We couldn't find this table"
            message={error}
            action={
              <button className="btn btn-primary" onClick={start}>
                Try again
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="table-landing">
      <div className="table-landing-card">
        <Spinner size={28} />
        <p style={{ marginTop: 16, color: "var(--color-text-muted)" }}>Finding your table…</p>
      </div>
    </div>
  );
}
