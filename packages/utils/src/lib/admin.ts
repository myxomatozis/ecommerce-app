// packages/utils/src/lib/admin.ts
// AdminAPI rewritten to use database functions from the migration

import { supabase } from "./supabase";
import type { Database } from "../../types/database.types";

// Use database function return types
export type AdminUser =
  Database["public"]["Functions"]["get_admin_user_by_email"]["Returns"][number];
export type AdminProduct =
  Database["public"]["Functions"]["admin_get_products"]["Returns"][number];
export type AdminDashboardStats =
  Database["public"]["Functions"]["admin_get_dashboard_stats"]["Returns"][number];
export type AdminRecentOrder =
  Database["public"]["Functions"]["admin_get_recent_orders"]["Returns"][number];

// Additional types for API responses
export interface AdminProductFilters {
  search?: string;
  category_id?: string;
  is_active?: boolean | null;
  limit?: number;
  offset?: number;
}

export interface AdminOrderFilters {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export class AdminAPI {
  // ============================================================================
  // AUTHENTICATION & USER MANAGEMENT
  // ============================================================================

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  // Check admin status using database function
  static async checkAdminStatus(userId: string): Promise<AdminUser | null> {
    // First get the user's email from auth.users
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user || authUser.user.id !== userId) {
      return null;
    }

    const { data, error } = await supabase.rpc("get_admin_user_by_email", {
      user_email: authUser.user.email!,
    });

    if (error) {
      console.error("Error checking admin status:", error);
      return null;
    }

    return data?.[0] || null;
  }

  // Get admin user by email using database function
  static async getAdminByEmail(email: string): Promise<AdminUser | null> {
    const { data, error } = await supabase.rpc("get_admin_user_by_email", {
      user_email: email,
    });

    if (error) {
      console.error("Error getting admin by email:", error);
      return null;
    }

    return data?.[0] || null;
  }

  // Get all admin users using the view
  static async getAllAdminUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from("admin_users_with_email")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin users:", error);
      return [];
    }

    // fiter out data if value of keys is null
    return (data as AdminUser[]) || [];
  }

  // Promote user to admin using database function
  static async promoteUserToAdmin(
    email: string,
    role: "admin" | "super_admin" = "admin"
  ): Promise<string> {
    const { data, error } = await supabase.rpc("promote_user_to_admin", {
      user_email: email,
      admin_role: role,
    });

    if (error) {
      throw new Error(`Failed to promote user: ${error.message}`);
    }

    return data;
  }

  // Update admin user role/status
  static async updateAdminUser(
    userId: string,
    updates: {
      role?: "admin" | "super_admin";
      is_active?: boolean;
    }
  ): Promise<void> {
    const { error } = await supabase
      .from("admin_users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      throw new Error(`Failed to update admin user: ${error.message}`);
    }
  }

  // Remove admin privileges
  static async removeAdminUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", userId);

    if (error) {
      throw new Error(`Failed to remove admin user: ${error.message}`);
    }
  }

  // ============================================================================
  // PRODUCT MANAGEMENT
  // ============================================================================

  // Get all products using admin function
  static async getAllProducts(
    filters: AdminProductFilters = {}
  ): Promise<AdminProduct[]> {
    const { search, category_id, is_active, limit = 50, offset = 0 } = filters;

    const { data, error } = await supabase.rpc("admin_get_products", {
      p_search: search,
      p_category_id: category_id,
      p_is_active: Boolean(is_active),
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data || [];
  }

  // Create product using admin function
  static async createProduct(productData: {
    name: string;
    description?: string;
    price: number;
    currency?: string;
    image_url?: string;
    images_gallery?: string[];
    stripe_price_id?: string;
    stock_quantity?: number;
    category_id?: string;
    is_active?: boolean;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const { data, error } = await supabase.rpc("admin_upsert_product", {
      product_name: productData.name,
      product_description: productData.description,
      product_price: productData.price,
      product_currency: productData.currency || "USD",
      product_image_url: productData.image_url,
      product_images_gallery: productData.images_gallery,
      product_stripe_price_id: productData.stripe_price_id,
      product_stock_quantity: productData.stock_quantity,
      product_category_id: productData.category_id,
      product_is_active: productData.is_active ?? true,
      product_metadata: productData.metadata
        ? JSON.stringify(productData.metadata)
        : "{}",
    });

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  }

  // Update product using admin function
  static async updateProduct(
    productId: string,
    updates: {
      name?: string;
      description?: string;
      price?: number;
      currency?: string;
      image_url?: string;
      images_gallery?: string[];
      stripe_price_id?: string;
      stock_quantity?: number;
      category_id?: string;
      is_active?: boolean;
      metadata?: Record<string, any>;
    }
  ): Promise<string> {
    const { data, error } = await supabase.rpc("admin_upsert_product", {
      product_id: productId,
      product_name: updates.name,
      product_description: updates.description,
      product_price: updates.price,
      product_currency: updates.currency,
      product_image_url: updates.image_url,
      product_images_gallery: updates.images_gallery,
      product_stripe_price_id: updates.stripe_price_id,
      product_stock_quantity: updates.stock_quantity,
      product_category_id: updates.category_id,
      product_is_active: updates.is_active,
      product_metadata: updates.metadata
        ? JSON.stringify(updates.metadata)
        : null,
    });

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data;
  }

  // Delete product using admin function
  static async deleteProduct(productId: string): Promise<void> {
    const { data, error } = await supabase.rpc("admin_delete_product", {
      product_id: productId,
    });

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    if (!data) {
      throw new Error("Product not found or could not be deleted");
    }
  }

  // Toggle product active status
  static async toggleProductStatus(
    productId: string,
    isActive: boolean
  ): Promise<void> {
    const { error } = await supabase
      .from("products")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      throw new Error(`Failed to update product status: ${error.message}`);
    }
  }

  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================

  // Get all orders with filters
  static async getAllOrders(filters: AdminOrderFilters = {}): Promise<any[]> {
    const {
      search,
      status,
      date_from,
      date_to,
      limit = 100,
      offset = 0,
    } = filters;

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `external_id.ilike.%${search}%,customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (date_from) {
      query = query.gte("created_at", date_from);
    }

    if (date_to) {
      query = query.lte("created_at", date_to);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return data || [];
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<void> {
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  // Get order details with items
  static async getOrderDetails(orderId: string): Promise<any> {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      throw new Error(`Failed to fetch order: ${orderError.message}`);
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(
        `
        *,
        products (
          name,
          image_url
        )
      `
      )
      .eq("order_id", orderId);

    if (itemsError) {
      throw new Error(`Failed to fetch order items: ${itemsError.message}`);
    }

    return {
      ...order,
      items: items || [],
    };
  }

  // ============================================================================
  // DASHBOARD & ANALYTICS
  // ============================================================================

  // Get dashboard statistics using database function
  static async getDashboardStats(): Promise<AdminDashboardStats> {
    const { data, error } = await supabase.rpc("admin_get_dashboard_stats");

    if (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }

    return (
      data?.[0] || {
        total_products: 0,
        active_products: 0,
        inactive_products: 0,
        low_stock_products: 0,
        total_orders: 0,
        pending_orders: 0,
        total_revenue: 0,
        total_categories: 0,
        active_categories: 0,
      }
    );
  }

  // Get recent orders using database function
  static async getRecentOrders(limit: number = 5): Promise<AdminRecentOrder[]> {
    const { data, error } = await supabase.rpc("admin_get_recent_orders", {
      p_limit: limit,
    });

    if (error) {
      throw new Error(`Failed to fetch recent orders: ${error.message}`);
    }

    return data || [];
  }

  // Get revenue analytics (custom implementation)
  static async getRevenueAnalytics(days: number = 30): Promise<{
    total_revenue: number;
    daily_revenue: Array<{ date: string; revenue: number }>;
  }> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .in("status", ["delivered", "shipped"]);

    if (error) {
      throw new Error(`Failed to fetch revenue analytics: ${error.message}`);
    }

    const orders = data || [];
    const total_revenue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0
    );

    // Group by date
    const dailyRevenue: Record<string, number> = {};
    orders.forEach((order) => {
      const date = new Date(order?.created_at || "")
        .toISOString()
        .split("T")[0];
      dailyRevenue[date] =
        (dailyRevenue[date] || 0) + Number(order.total_amount);
    });

    const daily_revenue = Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total_revenue,
      daily_revenue,
    };
  }

  // ============================================================================
  // CATEGORY MANAGEMENT
  // ============================================================================

  // Get all categories (admin can see inactive ones)
  static async getAllCategories(): Promise<any[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  }

  // Create category
  static async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    is_active?: boolean;
  }): Promise<any> {
    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description || null,
          is_active: categoryData.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return data;
  }

  // Update category
  static async updateCategory(
    categoryId: string,
    updates: {
      name?: string;
      slug?: string;
      description?: string;
      is_active?: boolean;
    }
  ): Promise<any> {
    const { data, error } = await supabase
      .from("categories")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", categoryId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return data;
  }

  // Delete category
  static async deleteCategory(categoryId: string): Promise<void> {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}

// Export convenience functions for direct use
export const {
  checkAdminStatus,
  getAdminByEmail,
  getAllAdminUsers,
  promoteUserToAdmin,
  updateAdminUser,
  removeAdminUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
  getDashboardStats,
  getRecentOrders,
  getRevenueAnalytics,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  signIn,
  signOut,
  getCurrentUser,
} = AdminAPI;

// Default export
export default AdminAPI;
