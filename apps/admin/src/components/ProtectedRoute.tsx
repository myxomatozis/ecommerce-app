import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@thefolk/ui";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireSuperAdmin = false,
}: ProtectedRouteProps) => {
  const { loading, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-neutral-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
