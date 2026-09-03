import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import Spinner from "./ui/Spinner";

// This is a UI convenience only — it stops a logged-out browser from
// rendering admin screens. It is NOT the security boundary: every admin
// route on the backend independently requires a valid bearer token
// (current_admin dependency) and re-checks restaurant ownership on every
// request. A user bypassing this guard client-side gains nothing, because
// the backend will still reject unauthenticated or cross-restaurant calls.
export default function AdminGuard({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <Spinner size={24} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
