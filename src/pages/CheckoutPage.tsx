import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import SupabaseAPI from "@/lib/supabase";
import { useCartStore } from "@/stores";
import { Checkbox } from "@/components/UI";
import { toast } from "@/utils/toast";
import { getCurrencySymbol } from "@/utils/currency";
import { config } from "@/config";

const CheckoutPage: React.FC = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartSummary = useCartStore((state) => state.cartSummary);

  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const subtotal =
    cartSummary.total_amount - cartSummary.shipping - cartSummary.tax;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">Add some items to continue</p>
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !agreeToTerms) return;

    setIsProcessing(true);

    try {
      const { url } = await SupabaseAPI.createCheckoutSession({
        customerInfo: { email: customerEmail },
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = url;
    } catch (error) {
      toast.error(
        "An error occurred while processing your checkout. Please try again."
      );
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = customerEmail.trim() && agreeToTerms;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            to="/cart"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Checkout Form */}
          <div className="space-y-12">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">
                Checkout
              </h1>
              <p className="text-gray-500">Complete your order</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-12">
              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Contact</h2>

                <div>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-0 py-3 text-gray-900 placeholder-gray-400 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent"
                    required
                  />
                </div>
              </div>

              {/* Payment Notice */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-start space-x-3">
                  <Lock
                    size={20}
                    className="text-gray-400 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Secure Payment
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      You'll be redirected to Stripe to complete your payment
                      securely. Your card details are never stored on our
                      servers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                label={
                  <span className="text-sm text-gray-600 flex items-center space-x-1">
                    I agree to the&nbsp;
                    <Link to="/terms" className="underline hover:no-underline">
                      Terms of Service
                    </Link>
                    and&nbsp;
                    <Link
                      to="/privacy"
                      className="underline hover:no-underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isProcessing}
                className={`w-full py-4 text-center font-medium transition-all ${
                  isFormValid && !isProcessing
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Continue to Payment — $${cartSummary.total_amount.toFixed(
                    2
                  )}`
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="space-y-8">
              {/* Order Items */}
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.cart_item_id}
                      className="flex items-center space-x-4"
                    >
                      <div className="relative">
                        <img
                          src={item.image_url || "/placeholder.jpg"}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        {item.quantity > 1 && (
                          <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ${item.product_price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      <div className="text-sm font-medium text-gray-900">
                        ${item.total_price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {cartSummary.shipping === 0
                      ? "Free"
                      : `$${cartSummary.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">
                    ${cartSummary.tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-medium pt-3 border-t border-gray-100">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    ${cartSummary.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {cartSummary.shipping > 0 && (
                <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded">
                  Add {getCurrencySymbol(config.storeCurrency)}
                  {(100 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}

              {/* Trust Indicators */}
              <div className="text-center space-y-2 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                  <Lock size={14} />
                  <span>Secure checkout</span>
                </div>
                <div className="text-xs text-gray-400">Powered by Stripe</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
