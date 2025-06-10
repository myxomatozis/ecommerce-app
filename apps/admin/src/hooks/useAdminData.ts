import { useState, useEffect } from "react";

import { toast } from "@thefolk/ui";
import AdminAPI, {
  AdminDashboardStats,
  AdminRecentOrder,
  AdminProductFilters,
  AdminProduct,
  AdminOrderFilters,
} from "@thefolk/utils/admin";

// Dashboard data hook
export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminRecentOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData] = await Promise.all([
        AdminAPI.getDashboardStats(),
        AdminAPI.getRecentOrders(5),
      ]);

      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    stats,
    recentOrders,
    loading,
    refetch: loadData,
  };
};

// Products data hook
export const useAdminProducts = (initialFilters?: AdminProductFilters) => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AdminProductFilters>(
    initialFilters || {}
  );

  const loadProducts = async (newFilters?: AdminProductFilters) => {
    try {
      setLoading(true);
      const currentFilters = newFilters || filters;
      const data = await AdminAPI.getAllProducts(currentFilters);
      setProducts(data);
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const createProduct = async (productData: any) => {
    try {
      await AdminAPI.createProduct(productData);
      toast.success("Product created successfully");
      await loadProducts(); // Refresh list
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
      throw error;
    }
  };

  const updateProduct = async (productId: string, updates: any) => {
    try {
      await AdminAPI.updateProduct(productId, updates);
      toast.success("Product updated successfully");
      await loadProducts(); // Refresh list
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await AdminAPI.deleteProduct(productId);
      toast.success("Product deleted successfully");
      await loadProducts(); // Refresh list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      throw error;
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      await AdminAPI.toggleProductStatus(productId, isActive);
      toast.success(
        `Product ${isActive ? "activated" : "deactivated"} successfully`
      );
      await loadProducts(); // Refresh list
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
      throw error;
    }
  };

  return {
    products,
    loading,
    filters,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    refetch: () => loadProducts(filters),
  };
};

// Orders data hook
export const useAdminOrders = (initialFilters?: AdminOrderFilters) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AdminOrderFilters>(
    initialFilters || {}
  );

  const loadOrders = async (newFilters?: AdminOrderFilters) => {
    try {
      setLoading(true);
      const currentFilters = newFilters || filters;
      const data = await AdminAPI.getAllOrders(currentFilters);
      setOrders(data);
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await AdminAPI.updateOrderStatus(orderId, status);
      toast.success("Order status updated successfully");
      await loadOrders(); // Refresh list
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
      throw error;
    }
  };

  const getOrderDetails = async (orderId: string) => {
    try {
      return await AdminAPI.getOrderDetails(orderId);
    } catch (error) {
      console.error("Error loading order details:", error);
      toast.error("Failed to load order details");
      throw error;
    }
  };

  return {
    orders,
    loading,
    filters,
    loadOrders,
    updateOrderStatus,
    getOrderDetails,
    refetch: () => loadOrders(filters),
  };
};

// Admin users data hook
export const useAdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.getAllAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading admin users:", error);
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const promoteUser = async (email: string, role: "admin" | "super_admin") => {
    try {
      await AdminAPI.promoteUserToAdmin(email, role);
      toast.success("User promoted successfully");
      await loadUsers(); // Refresh list
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user");
      throw error;
    }
  };

  const updateUserRole = async (
    userId: string,
    role: "admin" | "super_admin"
  ) => {
    try {
      await AdminAPI.updateAdminUser(userId, { role });
      toast.success("User role updated successfully");
      await loadUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
      throw error;
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      await AdminAPI.updateAdminUser(userId, { is_active: false });
      toast.success("User deactivated successfully");
      await loadUsers(); // Refresh list
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user");
      throw error;
    }
  };

  const activateUser = async (userId: string) => {
    try {
      await AdminAPI.updateAdminUser(userId, { is_active: true });
      toast.success("User activated successfully");
      await loadUsers(); // Refresh list
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
      throw error;
    }
  };

  return {
    users,
    loading,
    loadUsers,
    promoteUser,
    updateUserRole,
    deactivateUser,
    activateUser,
    refetch: loadUsers,
  };
};

// Analytics data hook
export const useAdminAnalytics = (days: number = 30) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await AdminAPI.getRevenueAnalytics(days);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  return {
    analytics,
    loading,
    refetch: loadAnalytics,
  };
};
