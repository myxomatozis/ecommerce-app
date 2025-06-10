import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import SupabaseAPI, { Order } from "@thefolk/utils/supabase";
import { formatPrice } from "@thefolk/utils";
import { config } from "@/config";

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const estimatedDelivery = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    SupabaseAPI.getOrderByStripeSession(sessionId)
      .then((fetchedOrder) => {
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          setError("Order not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-light text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            {error || "We couldn't find your order details"}
          </p>
          <Link
            to="/products"
            className="inline-block bg-gray-900 text-white px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Success Icon & Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-8">
            <CheckCircle size={32} className="text-gray-700" />
          </div>

          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Order Confirmed
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Thank you for your purchase
          </p>

          <div className="inline-block bg-gray-50 px-6 py-3 rounded">
            <span className="text-sm text-gray-600">Order number</span>
            <p className="font-mono text-lg text-gray-900 mt-1">
              {order.external_id}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-12 mb-16">
          {/* Delivery Info */}
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Estimated Delivery
            </h2>
            <p className="text-2xl font-light text-gray-900 mb-1">
              {estimatedDelivery}
            </p>
            <p className="text-sm text-gray-500">
              Standard shipping (5-7 business days)
            </p>
          </div>

          {/* Order Total */}
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Order Total
            </h2>
            <p className="text-2xl font-light text-gray-900">
              {formatPrice(
                order.total_amount,
                order.currency || config.storeCurrency
              )}
            </p>
          </div>

          {/* Customer Info */}
          {(order.customer_email || order.shipping_address) && (
            <div className="space-y-6">
              {order.customer_email && (
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Confirmation Email
                  </h2>
                  <p className="text-gray-600">{order.customer_email}</p>
                </div>
              )}

              {order.shipping_address && (
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Shipping Address
                  </h2>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {typeof order.shipping_address === "object" &&
                      order.shipping_address && (
                        <>
                          <p>{(order.shipping_address as any).line1}</p>
                          {(order.shipping_address as any).line2 && (
                            <p>{(order.shipping_address as any).line2}</p>
                          )}
                          <p>
                            {(order.shipping_address as any).city},{" "}
                            {(order.shipping_address as any).state}{" "}
                            {(order.shipping_address as any).postal_code}
                          </p>
                          <p>{(order.shipping_address as any).country}</p>
                        </>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className="space-y-8 mb-16">
          <h2 className="text-lg font-medium text-gray-900 text-center">
            What's Next
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Confirmation Email
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  You'll receive an order confirmation shortly
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Processing</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We'll prepare your order for shipment (1-2 business days)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Shipping</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your order ships with tracking information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/products"
            className="w-full bg-gray-900 text-white py-4 hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.print()}
              className="py-3 text-center text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-300"
            >
              Download Receipt
            </button>
            <Link
              to={`/track-order?order=${order.external_id}`}
              className="py-3 text-center text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-300"
            >
              Track Order
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-16 pt-16 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-500 mb-6">
            Our support team is here to assist you with order #
            {order.external_id}
          </p>
          <div className="space-y-3">
            <a
              href={`mailto:support@thefolkproject.com?subject=Order ${order.external_id}`}
              className="block text-gray-900 underline hover:no-underline transition-all"
            >
              Contact Support
            </a>
            <p className="text-sm text-gray-400">Response within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
