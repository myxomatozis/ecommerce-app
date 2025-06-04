// src/pages/CheckoutPage.tsx - Updated with Stripe Integration

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button, Card, CardContent, Input, Badge } from "@/components/UI";
import SupabaseAPI from "@/lib/supabase";

const CheckoutPage: React.FC = () => {
  const { cartItems, cartSummary } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const subtotal =
    cartSummary.total_amount - cartSummary.shipping - cartSummary.tax;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <CardContent>
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

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { url } = await SupabaseAPI.createCheckoutSession({
        customerInfo: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        },
      });

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", completed: step > 1 },
    { number: 2, title: "Payment", completed: step > 2 },
    { number: 3, title: "Review", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-center justify-center space-x-8">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      stepItem.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : step === stepItem.number
                        ? "border-primary-600 text-primary-600"
                        : "border-gray-300 text-gray-300"
                    }`}
                  >
                    {stepItem.completed ? (
                      <CheckCircle size={20} />
                    ) : (
                      stepItem.number
                    )}
                  </div>
                  <span
                    className={`ml-2 font-medium transition-colors duration-200 ${
                      step === stepItem.number
                        ? "text-primary-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stepItem.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`ml-8 w-16 h-0.5 transition-colors duration-200 ${
                        stepItem.completed ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                {/* Step 1: Customer Information */}
                {step === 1 && (
                  <form onSubmit={handleShippingSubmit}>
                    <div className="flex items-center mb-6">
                      <User className="mr-2 text-primary-600" size={24} />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Customer Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            firstName: e.target.value,
                          })
                        }
                        leftIcon={<User size={20} />}
                      />

                      <Input
                        label="Last Name"
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            lastName: e.target.value,
                          })
                        }
                        leftIcon={<User size={20} />}
                      />

                      <Input
                        label="Email"
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        leftIcon={<Mail size={20} />}
                      />

                      <Input
                        label="Phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        leftIcon={<Phone size={20} />}
                      />
                    </div>

                    <div className="mt-8">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                      >
                        Continue to Shipping
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 2: Shipping Address */}
                {step === 2 && (
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="flex items-center mb-6">
                      <MapPin className="mr-2 text-primary-600" size={24} />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Shipping Address
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Input
                          label="Address"
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              address: e.target.value,
                            })
                          }
                          leftIcon={<MapPin size={20} />}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          label="Apartment, suite, etc."
                          type="text"
                          value={shippingInfo.apartment}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              apartment: e.target.value,
                            })
                          }
                        />
                      </div>

                      <Input
                        label="City"
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                      />

                      <Input
                        label="State"
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            state: e.target.value,
                          })
                        }
                      />

                      <Input
                        label="ZIP Code"
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            zipCode: e.target.value,
                          })
                        }
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          required
                          value={shippingInfo.country}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              country: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 flex space-x-4">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        variant="secondary"
                        size="lg"
                        fullWidth
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                      >
                        Review Order
                      </Button>
                    </div>
                  </form>
                )}

                {/* Step 3: Review Order */}
                {step === 3 && (
                  <form onSubmit={handleFinalSubmit}>
                    <div className="flex items-center mb-6">
                      <Lock className="mr-2 text-primary-600" size={24} />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Review Your Order
                      </h2>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.cart_item_id}
                            className="flex items-center space-x-4 py-3 border-b border-gray-200"
                          >
                            <img
                              src={item.image_url || "/placeholder.jpg"}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.product_name}
                              </h4>
                              <p className="text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${item.total_price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Shipping Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <Card variant="outlined">
                        <CardContent padding="sm">
                          <h3 className="font-medium text-gray-900 mb-2">
                            Customer Information
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              {shippingInfo.firstName} {shippingInfo.lastName}
                            </p>
                            <p>{shippingInfo.email}</p>
                            {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                          </div>
                        </CardContent>
                      </Card>

                      <Card variant="outlined">
                        <CardContent padding="sm">
                          <h3 className="font-medium text-gray-900 mb-2">
                            Shipping Address
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{shippingInfo.address}</p>
                            {shippingInfo.apartment && (
                              <p>{shippingInfo.apartment}</p>
                            )}
                            <p>
                              {shippingInfo.city}, {shippingInfo.state}{" "}
                              {shippingInfo.zipCode}
                            </p>
                            <p>{shippingInfo.country}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <CreditCard
                          className="text-blue-600 flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">
                            Secure Payment with Stripe
                          </h4>
                          <p className="text-sm text-blue-700">
                            You'll be redirected to Stripe's secure checkout to
                            complete your payment. All payment information is
                            encrypted and processed securely.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        variant="secondary"
                        size="lg"
                        fullWidth
                        disabled={isProcessing}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isProcessing}
                        disabled={isProcessing}
                      >
                        {isProcessing
                          ? "Redirecting to Payment..."
                          : `Pay $${cartSummary.total_amount.toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
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
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${cartSummary.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center space-y-2">
                  <p>🔒 Secure checkout powered by Stripe</p>
                  <p>256-bit SSL encryption</p>
                  <div className="flex justify-center space-x-2">
                    <Badge variant="secondary" size="sm">
                      VISA
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      MC
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      AMEX
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      PayPal
                    </Badge>
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
