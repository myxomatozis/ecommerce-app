import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Plus,
  Eye,
  AlertTriangle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/PageHeader";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Spinner,
  Badge,
  toast,
} from "@thefolk/ui";
import { formatPrice, formatDate } from "@thefolk/utils";
import AdminAPI, {
  AdminDashboardStats,
  AdminRecentOrder,
} from "@thefolk/utils/admin";

const DashboardPage = () => {
  const { adminUser } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminRecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${adminUser?.email.split("@")[0]}`}
        description="Here's what's happening with your store today."
      />

      <div className="p-6">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Products</p>
                    <p className="text-2xl font-light text-neutral-900">
                      {stats.total_products}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {stats.active_products} active
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-neutral-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Orders</p>
                    <p className="text-2xl font-light text-neutral-900">
                      {stats.total_orders}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {stats.pending_orders} pending
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart size={24} className="text-neutral-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Revenue</p>
                    <p className="text-2xl font-light text-neutral-900">
                      {formatPrice(Number(stats.total_revenue), "GBP")}
                    </p>
                    <p className="text-xs text-neutral-500">Completed orders</p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} className="text-neutral-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Low Stock</p>
                    <p className="text-2xl font-light text-neutral-900">
                      {stats.low_stock_products}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Products below 5 items
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={24} className="text-neutral-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Low Stock Alert */}
        {stats && Number(stats.low_stock_products) > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle size={20} className="text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Low Stock Alert
                  </p>
                  <p className="text-sm text-yellow-700">
                    {stats.low_stock_products} products have low stock (less
                    than 5 items)
                  </p>
                </div>
                <Button
                  as={Link}
                  to="/products?filter=low-stock"
                  variant="secondary"
                  size="sm"
                  className="ml-auto"
                >
                  View Products
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  as={Link}
                  to="/products/new"
                  variant="primary"
                  fullWidth
                  leftIcon={<Plus size={20} />}
                >
                  Add Product
                </Button>
                <Button
                  as={Link}
                  to="/products"
                  variant="secondary"
                  fullWidth
                  leftIcon={<Package size={20} />}
                >
                  Manage Products
                </Button>
                <Button
                  as={Link}
                  to="/orders"
                  variant="secondary"
                  fullWidth
                  leftIcon={<ShoppingCart size={20} />}
                >
                  View Orders
                </Button>
                <Button
                  as="a"
                  href="https://thefolkproject.com"
                  variant="ghost"
                  fullWidth
                  leftIcon={<Eye size={20} />}
                >
                  View Store
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button as={Link} to="/orders" variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No recent orders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">
                          #{order.external_id}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {order.customer_email}
                        </p>
                        <p className="text-xs text-neutral-500 flex items-center mt-1">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-neutral-900">
                          {formatPrice(Number(order.total_amount), "GBP")}
                        </p>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "primary"
                              : order.status === "shipped"
                                ? "secondary"
                                : order.status === "cancelled"
                                  ? "outline"
                                  : "counter"
                          }
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
