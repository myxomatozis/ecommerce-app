import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Eye,
  Search,
  ShoppingCart,
  Calendar,
  User,
  Package,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Spinner,
  Dropdown,
} from "@thefolk/ui";
import AdminAPI, { AdminOrderFilters } from "@thefolk/utils/admin";
import { formatDate, formatPrice, getOrderStatusColor } from "@thefolk/utils";

const OrdersPage = () => {
  const { id: orderId } = useParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    } else {
      loadOrders();
    }
  }, [orderId, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const filters: AdminOrderFilters = {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        limit: 100,
      };

      const data = await AdminAPI.getAllOrders(filters);
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = async (id: string) => {
    try {
      setLoading(true);
      const data = await AdminAPI.getOrderDetails(id);
      setOrderDetails(data);
    } catch (error) {
      console.error("Error loading order details:", error);
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Single order details view
  if (orderId && orderDetails) {
    return (
      <div>
        <PageHeader
          title={`Order #${orderDetails.external_id}`}
          description={`Created ${formatDate(orderDetails.created_at)}`}
        >
          <Button
            as={Link}
            to="/orders"
            variant="ghost"
            leftIcon={<ShoppingCart size={20} />}
          >
            Back to Orders
          </Button>
        </PageHeader>

        <div className="p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderDetails.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt={item.product_name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package size={16} className="text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">
                            {item.product_name}
                          </h4>
                          <p className="text-sm text-neutral-600">
                            Quantity: {item.quantity} ×{" "}
                            {formatPrice(
                              Number(item.product_price),
                              orderDetails.currency
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-neutral-900">
                            {formatPrice(
                              Number(item.total_price),
                              orderDetails.currency
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span>
                        {formatPrice(
                          Number(orderDetails.subtotal),
                          orderDetails.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Shipping</span>
                      <span>
                        {formatPrice(
                          Number(orderDetails.shipping_amount),
                          orderDetails.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tax</span>
                      <span>
                        {formatPrice(
                          Number(orderDetails.tax_amount),
                          orderDetails.currency
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        {formatPrice(
                          Number(orderDetails.total_amount),
                          orderDetails.currency
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {orderDetails.customer_name || "No name provided"}
                    </p>
                    <p className="text-neutral-600">
                      {orderDetails.customer_email}
                    </p>
                    {orderDetails.customer_phone && (
                      <p className="text-neutral-600">
                        {orderDetails.customer_phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders list view
  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage customer orders and track shipments"
      />

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                variant="ghost"
                leftIcon={<Filter size={16} />}
                fullWidth
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
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
              <Card key={order.id}>
                <CardContent className="p-6">
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
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-medium text-neutral-900">
                          {formatPrice(
                            Number(order.total_amount),
                            order.currency
                          )}
                        </p>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getOrderStatusColor(order.status)}`}
                        >
                          {order.status}
                        </div>
                      </div>

                      <Button
                        as={Link}
                        to={`/orders/${order.id}`}
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
    </div>
  );
};

export default OrdersPage;
