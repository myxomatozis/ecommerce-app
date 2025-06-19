import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/stores";
import { formatPrice } from "@thefolk/utils";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="group cursor-pointer">
      {/* Product Image Container */}
      <div className="aspect-[3/4] overflow-hidden bg-neutral-50 mb-4 relative">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
          <ProductImage product={product} />
        </Link>

        {/* Minimal hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Out of stock overlay */}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-sm text-neutral-600 font-light tracking-wide uppercase">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-1">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-base font-light text-neutral-900 group-hover:text-neutral-700 transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-sm font-light text-neutral-900 tracking-wide">
            {formatPrice(product.price, product.currency || "USD")}
          </p>

          {/* Low stock indicator */}
          {product.stock_quantity &&
            product.stock_quantity > 0 &&
            product.stock_quantity <= 5 && (
              <span className="text-xs text-amber-600 font-light">
                Only {product.stock_quantity} left
              </span>
            )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
