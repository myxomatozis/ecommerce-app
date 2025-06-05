import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Mail,
  ShoppingCart,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  Badge,
  Checkbox,
} from "@/components/UI";
import SupabaseAPI from "@/lib/supabase";
import { useCartStore } from "@/stores";

const CheckoutPage: React.FC = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartSummary = useCartStore((state) => state.cartSummary);

  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const subtotal =
    cartSummary.total_amount - cartSummary.shipping - cartSummary.tax;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <CardContent>
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No items to checkout
            </h1>
            <p className="text-gray-600 mb-6">
              Add some items to your cart first.
            </p>
            <Button as={Link} to="/products" variant="primary">
              Start Shopping
            </Button>
          </CardContent>
        </Card>
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

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      // Handle error - show toast notification
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = customerEmail.trim() && agreeToTerms;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            as={Link}
            to="/cart"
            variant="ghost"
            leftIcon={<ArrowLeft size={20} />}
            className="mb-4"
          >
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Review your order and provide your email to continue with Stripe
            checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <ShoppingCart className="mr-2 text-primary-600" size={24} />
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.cart_item_id}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={item.image_url || "/placeholder.jpg"}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ${item.product_price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${item.total_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {cartSummary.shipping === 0 ? (
                        <Badge variant="success" size="sm">
                          Free
                        </Badge>
                      ) : (
                        `$${cartSummary.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${cartSummary.tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        ${cartSummary.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {subtotal < 100 && subtotal > 0 && (
                  <Card
                    variant="outlined"
                    className="mt-6 border-green-200 bg-green-50"
                  >
                    <CardContent padding="sm">
                      <p className="text-sm text-green-800 mb-2">
                        <strong>Add ${(100 - subtotal).toFixed(2)} more</strong>{" "}
                        for free shipping!
                      </p>
                      <div className="bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((subtotal / 100) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {subtotal >= 100 && (
                  <Card
                    variant="outlined"
                    className="mt-6 border-green-200 bg-green-50"
                  >
                    <CardContent padding="sm">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <p className="text-sm text-green-800 font-medium">
                          You've qualified for free shipping!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Customer Information Form */}
            <Card>
              <CardContent>
                <form onSubmit={handleCheckout}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Mail className="mr-2 text-primary-600" size={24} />
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your@email.com"
                      leftIcon={<Mail size={20} />}
                      helperText="We'll send your order confirmation to this email"
                      fullWidth
                    />

                    <div className="space-y-4">
                      <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        label={
                          <span className="text-sm">
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              className="text-primary-600 hover:text-primary-700 underline"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              to="/privacy"
                              className="text-primary-600 hover:text-primary-700 underline"
                            >
                              Privacy Policy
                            </Link>
                          </span>
                        }
                        required
                      />

                      <Checkbox
                        checked={subscribeNewsletter}
                        onChange={(e) =>
                          setSubscribeNewsletter(e.target.checked)
                        }
                        label="Subscribe to our newsletter for updates and exclusive offers"
                        description="You can unsubscribe at any time"
                      />
                    </div>

                    <Card
                      variant="outlined"
                      className="bg-blue-50 border-blue-200"
                    >
                      <CardContent padding="sm">
                        <div className="flex items-start space-x-3">
                          <ExternalLink
                            size={20}
                            className="text-blue-600 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <h3 className="font-medium text-blue-900 mb-1">
                              Secure Stripe Checkout
                            </h3>
                            <p className="text-sm text-blue-700">
                              You'll be redirected to Stripe's secure checkout
                              page to complete your payment and provide shipping
                              information. Your payment details are never stored
                              on our servers.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={!isFormValid || isProcessing}
                      isLoading={isProcessing}
                      rightIcon={
                        !isProcessing ? <ExternalLink size={20} /> : undefined
                      }
                    >
                      {isProcessing
                        ? "Preparing checkout..."
                        : `Continue to Stripe Checkout - $${cartSummary.total_amount.toFixed(
                            2
                          )}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Lock className="mr-2 text-green-600" size={20} />
                  Secure Checkout
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">SSL Encrypted</p>
                      <p className="text-gray-600">Your data is protected</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Stripe Powered
                      </p>
                      <p className="text-gray-600">Trusted by millions</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Lock size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No Card Storage
                      </p>
                      <p className="text-gray-600">
                        We never see your card details
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Payment Methods
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="justify-center"
                    >
                      VISA
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="justify-center"
                    >
                      Mastercard
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="justify-center"
                    >
                      American Express
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="justify-center"
                    >
                      PayPal
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="justify-center"
                    >
                      Apple Pay
                    </Badge>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="justify-center"
                    >
                      Google Pay
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Need Help?
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start text-primary-600 hover:text-primary-700"
                    >
                      📧 Email Support
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start text-primary-600 hover:text-primary-700"
                    >
                      💬 Live Chat
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-start text-primary-600 hover:text-primary-700"
                    >
                      📞 Call Us
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
