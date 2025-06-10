import { useAuth } from "@/contexts/AuthContext";

export const useAdminOperations = () => {
  const { adminUser, isAdmin, isSuperAdmin } = useAuth();

  // Permission checks
  const canManageProducts = isAdmin;
  const canManageOrders = isAdmin;
  const canManageUsers = isSuperAdmin;
  const canViewAnalytics = isAdmin;
  const canManageCategories = isAdmin;
  const canManageSettings = isSuperAdmin;
  const canViewAllOrders = isAdmin;
  const canUpdateOrderStatus = isAdmin;
  const canDeleteProducts = isAdmin;
  const canPromoteUsers = isSuperAdmin;

  // Role-based features
  const availableFeatures = {
    dashboard: isAdmin,
    products: {
      view: isAdmin,
      create: isAdmin,
      edit: isAdmin,
      delete: isAdmin,
      toggleStatus: isAdmin,
    },
    orders: {
      view: isAdmin,
      details: isAdmin,
      updateStatus: isAdmin,
      viewCustomerInfo: isAdmin,
    },
    users: {
      view: isSuperAdmin,
      promote: isSuperAdmin,
      demote: isSuperAdmin,
      deactivate: isSuperAdmin,
      changeRoles: isSuperAdmin,
    },
    analytics: {
      dashboard: isAdmin,
      revenue: isAdmin,
      detailed: isSuperAdmin,
    },
    settings: {
      view: isSuperAdmin,
      modify: isSuperAdmin,
    },
  };

  // Helper functions for UI
  const getAdminBadgeVariant = () => {
    return adminUser?.role === "super_admin" ? "primary" : "secondary";
  };

  const getAdminDisplayRole = () => {
    return adminUser?.role.replace("_", " ") || "User";
  };

  const hasPermission = (permission: string): boolean => {
    const permissions = permission.split(".");
    let current: any = availableFeatures;

    for (const perm of permissions) {
      if (current[perm] === undefined) return false;
      current = current[perm];
    }

    return Boolean(current);
  };

  return {
    // User info
    adminUser,
    isAdmin,
    isSuperAdmin,

    // Permission flags
    canManageProducts,
    canManageOrders,
    canManageUsers,
    canViewAnalytics,
    canManageCategories,
    canManageSettings,
    canViewAllOrders,
    canUpdateOrderStatus,
    canDeleteProducts,
    canPromoteUsers,

    // Feature availability
    availableFeatures,

    // Helper functions
    getAdminBadgeVariant,
    getAdminDisplayRole,
    hasPermission,
  };
};
