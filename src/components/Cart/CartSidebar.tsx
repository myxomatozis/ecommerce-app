import React from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

import { Button, Card, CardContent, Badge } from "@/components/UI";
import { useCartStore } from "@/stores";
import { IconCounter } from "../UI/Badge";

const CartSidebar: React.FC = () => {
  const {
    cartItems,
    cartSummary,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCartStore();

  const subtotal =
    cartSummary.total_amount - cartSummary.shipping - cartSummary.tax;

  const handleCheckout = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ShoppingBag size={24} className="text-gray-700" />
                {cartSummary.item_count > 0 && (
                  <IconCounter
                    count={cartSummary.item_count}
                    size="xs"
                    max={9}
                  />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-600">
                  {cartSummary.item_count}{" "}
                  {cartSummary.item_count === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsCartOpen(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some products to get started!
                </p>
                <Button
                  as={Link}
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  variant="primary"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <Card
                    key={item.cart_item_id}
                    variant="outlined"
                    className="overflow-hidden"
                  >
                    <CardContent padding="sm">
                      <div className="flex items-start space-x-3">
                        <Link
                          to={`/products/${item.product_id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image_url || "/placeholder.jpg"}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded-lg hover:opacity-75 transition-opacity"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product_id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                          >
                            {item.product_name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.product_price.toFixed(2)} each
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <Card variant="outlined" className="inline-flex">
                              <CardContent
                                padding="none"
                                className="flex items-center"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product_id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="rounded-none text-gray-600 hover:text-gray-900 p-1"
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
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
                                  className="rounded-none text-gray-600 hover:text-gray-900 p-1"
                                >
                                  <Plus size={14} />
                                </Button>
                              </CardContent>
                            </Card>

                            <Button
                              onClick={() => removeFromCart(item.product_id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ${item.total_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Clear Cart Button */}
                {cartItems.length > 1 && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={clearCart}
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear All Items
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Summary and Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50">
              {/* Free Shipping Banner */}
              {subtotal < 100 && subtotal > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-800 font-medium">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </span>
                    <Badge variant="success" size="sm">
                      🚚 Free
                    </Badge>
                  </div>
                  <div className="bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((subtotal / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {subtotal >= 100 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="success" size="md">
                      🎉 You've qualified for free shipping!
                    </Badge>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {cartSummary.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        ${cartSummary.shipping.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${cartSummary.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        ${cartSummary.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    as={Link}
                    to="/checkout"
                    onClick={handleCheckout}
                    variant="primary"
                    size="lg"
                    fullWidth
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    as={Link}
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    variant="outline"
                    size="md"
                    fullWidth
                  >
                    View Full Cart
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="text-center">
                  <Badge variant="secondary" size="sm" className="text-xs">
                    🔒 Secure Checkout
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
