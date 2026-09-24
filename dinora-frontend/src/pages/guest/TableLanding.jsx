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
      <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 sm:p-6">
        <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl shadow-sm p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <EmptyState
            icon="⚠️"
            title="We couldn't find this table"
            message={error}
            action={
              <button 
                className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" 
                onClick={start}
              >
                Try again
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-sm bg-card text-card-foreground border border-border rounded-xl shadow-sm p-8 flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="text-primary">
          <Spinner size={32} />
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
          Finding your table…
        </p>
      </div>
    </div>
  );
}