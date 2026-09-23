import { Navigate } from "react-router-dom";
import { useSuperAdminAuth } from "../context/SuperAdminAuthContext";
import Spinner from "./ui/Spinner";

// This is a UI convenience only, same as AdminGuard — every
// /api/super-admin/* route independently requires a valid super admin
// bearer token (current_super_admin dependency), which a restaurant
// AdminUser's token can never satisfy (see routes/super_admin.py).
export default function SuperAdminGuard({ children }) {
  const { isAuthenticated, loading } = useSuperAdminAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <Spinner size={24} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
}
