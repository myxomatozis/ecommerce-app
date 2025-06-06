import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/UI";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireSuperAdmin = false,
}) => {
  const { loading, isAdmin, isSuperAdmin, user } = useAuth();
  const location = useLocation();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" text="Loading..." />
          <p className="mt-4 text-sm text-neutral-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Check if user is logged in but not an admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-light text-neutral-900 mb-4">
            Access Denied
          </h2>
          <p className="text-neutral-600 mb-6">
            You don't have admin privileges to access this area.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Back to store
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check super admin requirement
  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-light text-neutral-900 mb-4">
            Super Admin Required
          </h2>
          <p className="text-neutral-600 mb-6">
            This section requires super admin privileges.
          </p>
          <button
            onClick={() => (window.location.href = "/admin")}
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
