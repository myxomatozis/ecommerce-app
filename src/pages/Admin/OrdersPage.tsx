import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Search,
  ShoppingCart,
  Calendar,
  User,
  Package,
} from "lucide-react";
import {
  Button,
  Input,
  Dropdown,
  Card,
  CardContent,
  Badge,
  Spinner,
} from "@/components/UI";
import { supabase } from "@/lib/supabase";

interface AdminOrder {
  id: string;
  external_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  status: string | null;
  total_amount: number | null;
  currency: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadOrders();
  }, [searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(
          `external_id.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%`
        );
      }

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      case "refunded":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Spinner size="lg" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-neutral-900">Orders</h1>
        <p className="text-neutral-600">
          Manage customer orders and track shipments
        </p>
      </div>

      {/* Filters */}
      <Card variant="outlined" className="border-neutral-200 mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={20} />}
              fullWidth
            />
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
              fullWidth
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card variant="outlined" className="border-neutral-200">
          <CardContent>
            <div className="text-center py-12">
              <ShoppingCart
                size={48}
                className="mx-auto text-neutral-400 mb-4"
              />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No orders found
              </h3>
              <p className="text-neutral-600">
                {searchTerm || statusFilter
                  ? "Try adjusting your filters"
                  : "Orders will appear here when customers make purchases"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              variant="outlined"
              className="border-neutral-200"
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-neutral-600" />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-neutral-900">
                        Order #{order.external_id}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-neutral-600">
                          <User size={14} />
                          <span>
                            {order.customer_name || order.customer_email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-neutral-600">
                          <Calendar size={14} />
                          <span>
                            {new Date(
                              order?.created_at || ""
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-medium text-neutral-900">
                        ${order?.total_amount?.toFixed(2)}
                      </p>
                      <Badge
                        variant={getStatusVariant(order?.status || "") as any}
                        size="sm"
                        className="capitalize"
                      >
                        {order.status}
                      </Badge>
                    </div>

                    <Button
                      as={Link}
                      to={`/admin/orders/${order.id}`}
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye size={16} />}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
