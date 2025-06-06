import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Card, CardContent, Spinner } from "@/components/UI";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  recentOrders: number;
  totalCategories: number;
  lowStockProducts: number;
}

export const AdminDashboardPage: React.FC = () => {
  const { adminUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Get products stats
      const { data: products } = await supabase
        .from("products")
        .select("is_active, stock_quantity");

      // Get orders stats
      const { data: orders } = await supabase
        .from("orders")
        .select("created_at, status");

      // Get categories count
      const { data: categories } = await supabase
        .from("categories")
        .select("id");

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: DashboardStats = {
        totalProducts: products?.length || 0,
        activeProducts: products?.filter((p) => p.is_active)?.length || 0,
        totalOrders: orders?.length || 0,
        recentOrders:
          orders?.filter((o) => new Date(o?.created_at || "") > weekAgo)
            ?.length || 0,
        totalCategories: categories?.length || 0,
        lowStockProducts:
          products?.filter((p) => p.stock_quantity && p.stock_quantity < 5)
            ?.length || 0,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Spinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-neutral-900 mb-2">
          Welcome back, {adminUser?.email.split("@")[0]}
        </h1>
        <p className="text-neutral-600">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card variant="outlined" className="border-neutral-200">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Products</p>
                  <p className="text-2xl font-light text-neutral-900">
                    {stats.totalProducts}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {stats.activeProducts} active
                  </p>
                </div>
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Package size={24} className="text-neutral-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="outlined" className="border-neutral-200">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Orders</p>
                  <p className="text-2xl font-light text-neutral-900">
                    {stats.totalOrders}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {stats.recentOrders} this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={24} className="text-neutral-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="outlined" className="border-neutral-200">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Categories</p>
                  <p className="text-2xl font-light text-neutral-900">
                    {stats.totalCategories}
                  </p>
                  <p className="text-xs text-neutral-500">Active categories</p>
                </div>
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-neutral-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alert for low stock */}
      {stats && stats.lowStockProducts > 0 && (
        <Card
          variant="outlined"
          className="border-yellow-200 bg-yellow-50 mb-8"
        >
          <CardContent>
            <div className="flex items-center space-x-3">
              <AlertTriangle size={20} className="text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Low Stock Alert
                </p>
                <p className="text-sm text-yellow-700">
                  {stats.lowStockProducts} products have low stock (less than 5
                  items)
                </p>
              </div>
              <Button
                as={Link}
                to="/admin/products?filter=low-stock"
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                View Products
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            as={Link}
            to="/admin/products/new"
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Plus size={20} />}
          >
            Add Product
          </Button>
          <Button
            as={Link}
            to="/admin/products"
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<Package size={20} />}
          >
            Manage Products
          </Button>
          <Button
            as={Link}
            to="/admin/orders"
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<ShoppingCart size={20} />}
          >
            View Orders
          </Button>
          <Button
            as={Link}
            to="/"
            variant="ghost"
            size="lg"
            fullWidth
            leftIcon={<Eye size={20} />}
          >
            View Store
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <Card variant="outlined" className="border-neutral-200">
        <CardContent>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-8 text-neutral-500">
            <p>Activity tracking will be implemented in future updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
