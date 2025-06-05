import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/UI";
import { useCartStore } from "@/stores";

const CartPage: React.FC = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartSummary = useCartStore((state) => state.cartSummary);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal =
    cartSummary.total_amount - cartSummary.shipping - cartSummary.tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              as={Link}
              to="/products"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            as={Link}
            to="/products"
            variant="ghost"
            leftIcon={<ArrowLeft size={20} />}
            className="mb-4"
          >
            Continue Shopping
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>

              <CardContent padding="none">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.cart_item_id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <Link
                          to={`/products/${item.product_id}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image_url || "/placeholder.jpg"}
                            alt={item.product_name}
                            className="w-24 h-24 object-cover rounded-lg hover:opacity-75 transition-opacity"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product_id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                          >
                            {item.product_name}
                          </Link>
                          <p className="text-gray-600 mt-1">
                            ${item.product_price.toFixed(2)} each
                          </p>

                          {/* Mobile Quantity Controls */}
                          <div className="flex items-center justify-between mt-4 sm:hidden">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="p-2 hover:bg-gray-100"
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="px-3 py-2 font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product_id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>

                        {/* Desktop Quantity Controls */}
                        <div className="hidden sm:flex items-center space-x-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </Button>
                          </div>

                          <div className="text-right min-w-[5rem]">
                            <p className="text-lg font-semibold text-gray-900">
                              ${item.total_price.toFixed(2)}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product_id)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>

                        {/* Mobile Total */}
                        <div className="sm:hidden text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
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
                        `${cartSummary.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${cartSummary.tax.toFixed(2)}
                    </span>
                  </div>

                  {/* Promo Code */}
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Tag size={16} />}
                      className="text-primary-600 hover:text-primary-700 p-0"
                    >
                      Add promo code
                    </Button>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        ${cartSummary.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {subtotal < 100 && subtotal > 0 && (
                  <Card
                    variant="outlined"
                    className="mb-6 border-green-200 bg-green-50"
                  >
                    <CardContent padding="sm">
                      <p className="text-sm text-green-800">
                        <strong>Add ${(100 - subtotal).toFixed(2)} more</strong>{" "}
                        for free shipping!
                      </p>
                      <div className="mt-2 bg-green-200 rounded-full h-2">
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
                    className="mb-6 border-green-200 bg-green-50"
                  >
                    <CardContent padding="sm">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 You've qualified for free shipping!
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Checkout Button */}
                <Button
                  as={Link}
                  to="/checkout"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="mb-4"
                >
                  Proceed to Checkout
                </Button>

                {/* Security Features */}
                <div className="text-center text-sm text-gray-600">
                  <p className="mb-2">🔒 Secure 256-bit SSL encryption</p>
                  <div className="flex justify-center space-x-2 text-xs">
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

            {/* Customer Service */}
            <Card className="mt-6">
              <CardContent>
                <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start text-primary-600 hover:text-primary-700"
                  >
                    Contact Customer Service
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start text-primary-600 hover:text-primary-700"
                  >
                    Shipping Information
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start text-primary-600 hover:text-primary-700"
                  >
                    Return Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recently Viewed or Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover className="text-center">
              <CardContent>
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Recommended Products</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Based on your cart items, we'll show personalized
                  recommendations here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
