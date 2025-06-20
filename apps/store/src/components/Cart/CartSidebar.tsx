import React from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/stores";
import { config } from "@/config";
import { formatPrice } from "@thefolk/utils";
import { Button } from "@thefolk/ui";

const CartSidebar: React.FC = () => {
  const {
    cartItems,
    cartSummary,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
  } = useCartStore();

  const subtotal =
    cartSummary.total_amount - cartSummary.shipping - cartSummary.tax;

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Cart</h2>
              <p className="text-sm text-gray-500 mt-1">
                {cartSummary.item_count}{" "}
                {cartSummary.item_count === 1 ? "item" : "items"}
              </p>
            </div>
            <Button
              variant="text"
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              rightIcon={<X size={20} />}
              aria-label="Close cart"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some products to get started
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="flex items-start space-x-4"
                  >
                    <Link
                      to={`/products/${item.product_id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.image_url || "/placeholder.jpg"}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded hover:opacity-75 transition-opacity"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product_id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="block"
                      >
                        <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-gray-700 transition-colors line-clamp-2">
                          {item.product_name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-3">
                        {formatPrice(item.product_price, item.product_currency)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded">
                          <Button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                            rightIcon={<Minus size={12} />}
                            variant="text"
                          />

                          <span className="px-3 text-sm font-medium min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="text"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-50 transition-colors"
                            rightIcon={<Plus size={12} />}
                          />
                        </div>

                        <Button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          variant="text"
                          aria-label="Remove item"
                          rightIcon={<X size={16} />}
                        />
                      </div>
                    </div>

                    <div className="text-right min-w-20">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.total_price, config.storeCurrency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 bg-white">
              {/* Free Shipping Progress */}
              {cartSummary.shipping > 0 && (
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="text-center text-sm text-gray-600">
                    Add{" "}
                    {formatPrice(
                      config.freeShippingThreshold - subtotal,
                      config.storeCurrency
                    )}{" "}
                    more for free shipping
                  </div>
                </div>
              )}

              {cartSummary.shipping === 0 &&
                subtotal >= config.freeShippingThreshold && (
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="text-center text-sm text-gray-600">
                      You qualify for free shipping
                    </div>
                  </div>
                )}

              <div className="p-6 space-y-4">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {formatPrice(subtotal, config.storeCurrency)}
                    </span>
                  </div>
                  {cartSummary.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        {formatPrice(
                          cartSummary.shipping,
                          config.storeCurrency
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      {formatPrice(cartSummary.tax, config.storeCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatPrice(
                        cartSummary.total_amount,
                        config.storeCurrency
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full bg-gray-900 text-white py-3 text-center hover:bg-gray-800 transition-colors"
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full text-sm text-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    View Full Cart
                  </Link>
                </div>

                {/* Security */}
                <div className="text-center text-xs text-gray-400">
                  Secure checkout
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
