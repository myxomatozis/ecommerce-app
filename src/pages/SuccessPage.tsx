import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Download,
  Users,
  Star,
  Heart,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/UI";
import SupabaseAPI, { Order } from "@/lib/supabase";

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = React.useState<Order | null>(null);
  const estimatedDelivery = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!sessionId) {
      console.error("No session ID found in URL");
      return;
    }
    SupabaseAPI.getOrderByStripeSession(sessionId)
      .then((fetchedOrder) => {
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          console.error("No order found for session ID:", sessionId);
        }
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
      });
  }, [sessionId]);

  const nextSteps = [
    {
      icon: Mail,
      title: "Confirmation Email",
      description: "You'll receive an order confirmation email shortly.",
      status: "complete",
      time: "Just now",
    },
    {
      icon: Package,
      title: "Processing",
      description: "We'll prepare your order for shipment.",
      status: "current",
      time: "Within 24 hours",
    },
    {
      icon: Truck,
      title: "Shipping",
      description: "Your order will be shipped and you'll get tracking info.",
      status: "upcoming",
      time: "2-3 business days",
    },
  ];

  const supportOptions = [
    {
      title: "Email Support",
      description: "Get help via email",
      contact: "support@modernstore.com",
      icon: "📧",
    },
    {
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 24/7",
      icon: "💬",
    },
    {
      title: "Phone Support",
      description: "Call our customer service",
      contact: "+1 (555) 123-4567",
      icon: "📞",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <Card className="text-center mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce-in">
              <CheckCircle size={48} className="text-green-600" />
            </div>

            <Badge variant="success" size="lg" className="mb-4">
              <CheckCircle size={16} className="mr-1" />
              Order Confirmed
            </Badge>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your purchase has been successfully processed and confirmed.
            </p>
            <div className="inline-flex items-center space-x-2 bg-white rounded-lg px-4 py-2 mt-4">
              <span className="text-sm text-gray-600">Order Number:</span>
              <Badge variant="primary" size="md" className="font-mono">
                {order?.id || "Loading..."}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Estimated Delivery */}
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-3">
                  <Truck size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Estimated Delivery
                </h3>
                <p className="text-xl font-bold text-blue-600 mb-1">
                  {estimatedDelivery}
                </p>
                <Badge variant="secondary" size="sm">
                  Standard shipping (5-7 days)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-3">
                  <span className="text-xl font-bold">$</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Order Total
                </h3>
                <p className="text-xl font-bold text-gray-900 mb-1">$299.99</p>
                <Badge variant="secondary" size="sm">
                  Including tax & shipping
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-3">
                  <span className="text-sm font-bold">💳</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Method
                </h3>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  **** 1234
                </p>
                <Badge variant="secondary" size="sm">
                  Visa ending in 1234
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Timeline */}
        <Card className="mb-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What happens next?
            </h2>

            <div className="space-y-6">
              {nextSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        step.status === "complete"
                          ? "bg-green-100 text-green-600"
                          : step.status === "current"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`text-lg font-semibold ${
                            step.status === "upcoming"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <Badge
                          variant={
                            step.status === "complete"
                              ? "success"
                              : step.status === "current"
                              ? "primary"
                              : "secondary"
                          }
                          size="sm"
                        >
                          {step.time}
                        </Badge>
                      </div>
                      <p
                        className={`${
                          step.status === "upcoming"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    {step.status === "complete" && (
                      <CheckCircle size={20} className="text-green-600 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            as={Link}
            to="/products"
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={20} />}
            fullWidth
          >
            Continue Shopping
          </Button>

          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Download size={20} />}
            fullWidth
          >
            Download Receipt
          </Button>

          <Button
            as={Link}
            to="/track-order"
            variant="outline"
            size="lg"
            leftIcon={<Package size={20} />}
            fullWidth
          >
            Track Order
          </Button>
        </div>

        {/* Support Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users size={24} className="mr-2 text-blue-600" />
                Customer Support
              </h2>
              <p className="text-gray-600 mb-4">
                Our support team is here to help with any questions about your
                order.
              </p>
              <div className="space-y-3">
                {supportOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start text-left"
                  >
                    <span className="mr-3">{option.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {option.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.contact}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Package size={24} className="mr-2 text-green-600" />
                Order Information
              </h2>
              <p className="text-gray-600 mb-4">
                Keep your order number handy for easy tracking and support.
              </p>
              <Card variant="outlined" className="bg-gray-50">
                <CardContent padding="sm">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <Badge variant="primary" size="lg" className="font-mono">
                      {order?.id || "Loading..."}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600"
                >
                  📱 Add to Apple Wallet
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600"
                >
                  📧 Forward Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Reviews CTA */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Star size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Love your purchase?
              </h3>
              <p className="text-gray-600 mb-4">
                Share your experience and help other customers discover great
                products!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" size="md">
                  Write a Review
                </Button>
                <Button variant="outline" size="md">
                  Share with Friends
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Sharing */}
        <Card>
          <CardContent>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                <Heart size={20} className="mr-2 text-red-500" />
                Share the Love
              </h3>
              <p className="text-gray-600 mb-6">
                Spread the word about your great shopping experience!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  Share on Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  Share on Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
                >
                  Share on Instagram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  Share on Pinterest
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <Badge variant="info" size="lg" className="mb-4">
            💡 Pro Tip
          </Badge>
          <p className="text-gray-600">
            Save this page or screenshot your order details for your records.
            You can always find your order history in your account dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
