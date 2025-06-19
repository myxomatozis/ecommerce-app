import React, { useState } from "react";
import { config } from "@/config";
import { Product, useCartStore } from "@/stores";
import { formatPrice } from "@thefolk/utils";
import { Star, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

const FeaturedProduct = ({ product }: { product: Product }) => {
  const { addToCart, loading } = useCartStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id);
  };

  return (
    <article
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Product Container */}
      <div className="space-y-6">
        {/* Image Container - Luxury Fashion Style */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
          <Link
            to={`/products/${product.id}`}
            className="absolute inset-0 z-10"
            aria-label={`View ${product.name} details`}
          >
            <div
              className={`
                w-full h-full transition-all duration-700 ease-out
                ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
              `}
            >
              <ProductImage
                product={product}
                onLoad={() => setImageLoaded(true)}
                className="object-cover w-full h-full"
              />
            </div>
          </Link>

          {/* Minimal Rating Badge - Top Left */}
          {product.rating && (
            <div
              className={`
                absolute top-4 left-4 z-20 transition-all duration-300
                ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
              `}
            >
              <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                <Star size={12} className="text-amber-400 fill-current" />
                <span className="text-xs font-medium text-neutral-700">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Quick Add Button - Toteme Inspired */}
          <div
            className={`
              absolute bottom-4 right-4 z-20 transition-all duration-500 ease-out
              ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
            `}
          >
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock_quantity === 0}
              className={`
                group/btn w-12 h-12 rounded-full transition-all duration-300
                ${
                  loading
                    ? "bg-emerald-500 text-white"
                    : "bg-white/95 hover:bg-neutral-900 text-neutral-900 hover:text-white"
                }
                backdrop-blur-sm shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center
              `}
              aria-label="Add to cart"
            >
              {loading ? (
                <Check size={18} className="animate-pulse" />
              ) : (
                <Plus
                  size={18}
                  className="transition-transform duration-300 group-hover/btn:rotate-90"
                />
              )}
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-15">
              <span className="text-sm font-light text-neutral-600 tracking-wider uppercase">
                Sold Out
              </span>
            </div>
          )}

          {/* Subtle Hover Overlay */}
          <div
            className={`
              absolute inset-0 z-5 transition-all duration-700
              ${isHovered ? "bg-black/5" : "bg-transparent"}
            `}
          />
        </div>

        {/* Product Information - Jil Sander Inspired Typography */}
        <div className="space-y-3 px-1">
          {/* Product Name */}
          <Link to={`/products/${product.id}`} className="block group/title">
            <h3 className="text-base font-light text-neutral-900 tracking-wide leading-tight group-hover/title:text-neutral-600 transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Product Description */}
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 font-light">
            {product.description}
          </p>

          {/* Price and Details */}
          <div className="space-y-2 pt-2">
            {/* Price */}
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-light text-neutral-900 tracking-wide">
                {formatPrice(product.price, product.currency || "USD")}
              </span>

              {/* Stock Status */}
              {product.stock_quantity &&
                product.stock_quantity > 0 &&
                product.stock_quantity <= 5 && (
                  <span className="text-xs text-amber-600 font-light tracking-wide">
                    Only {product.stock_quantity} left
                  </span>
                )}
            </div>

            {/* Additional Information */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              {product.price > config.freeShippingThreshold && (
                <span className="font-light tracking-wide">Free shipping</span>
              )}

              <Link
                to={`/products/${product.id}`}
                className="hover:text-neutral-600 transition-colors duration-300 tracking-wide"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedProduct;
