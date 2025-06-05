import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, X } from "lucide-react";
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
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <Link
              to="/products"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Start adding items to see them here
          </p>
          <Link
            to="/products"
            className="inline-block bg-gray-900 text-white px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            to="/products"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-light text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-500 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </p>
              </div>

              {cartItems.length > 1 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex items-start space-x-6 pb-8 border-b border-gray-100 last:border-b-0"
                >
                  <Link
                    to={`/products/${item.product_id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded hover:opacity-75 transition-opacity"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product_id}`} className="block">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-gray-700 transition-colors">
                        {item.product_name}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-sm mb-4">
                      ${item.product_price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      ${item.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="space-y-8">
              <h2 className="text-lg font-medium text-gray-900">Summary</h2>

              {/* Pricing */}
              <div className="space-y-3">
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
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}

              {cartSummary.shipping === 0 && subtotal >= 100 && (
                <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded">
                  You qualify for free shipping
                </div>
              )}

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full bg-gray-900 text-white py-4 text-center hover:bg-gray-800 transition-colors"
              >
                Checkout
              </Link>

              {/* Security */}
              <div className="text-center text-xs text-gray-400">
                Secure checkout powered by Stripe
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <h2 className="text-xl font-light text-gray-900 mb-8 text-center">
            You might also like
          </h2>

          <div className="text-center text-gray-500">
            <p className="mb-4">
              Discover more products tailored to your style
            </p>
            <Link
              to="/products"
              className="inline-block text-gray-900 underline hover:no-underline transition-all"
            >
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
