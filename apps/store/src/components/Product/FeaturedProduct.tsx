import { config } from "@/config";
import { Product, useCartStore } from "@/stores";
import { Card, Button, Badge } from "@thefolk/ui";
import { formatPrice } from "@thefolk/utils";
import { Star, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

const FeaturedProduct = ({ product }: { product: Product }) => {
  const { addToCart, loading } = useCartStore();
  return (
    <Card
      key={product.id}
      variant="minimal"
      padding="none"
      className="group cursor-pointer overflow-hidden hover:shadow-md transition-all duration-700 bg-white"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Main clickable area - Link covers entire image */}
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0 z-10 block"
        >
          <ProductImage product={product} />
        </Link>

        {/* Floating Rating Badge */}
        {product.rating && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <Badge
              variant="default"
              size="sm"
              className="bg-white/95 backdrop-blur-md shadow-sm border-0"
            >
              <div className="flex items-center text-xs text-neutral-800 px-1">
                <Star size={11} className="text-amber-500 fill-current mr-1" />
                {product.rating.toFixed(1)}
              </div>
            </Badge>
          </div>
        )}

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 pointer-events-none z-20" />

        {/* Quick Add Button - appears on hover */}
        <div className="absolute bottom-4 left-4 right-4 z-30 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <Button
            variant="minimal"
            size="sm"
            fullWidth
            aria-label="Quick Add to Cart"
            isLoading={loading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product.id);
            }}
            className=" bg-white/95 backdrop-blur-md text-neutral-900 hover:bg-white hover:shadow-md font-medium border-0 py-3 pointer-events-auto"
          >
            <div className="flex items-center justify-center space-x-2">
              <ShoppingBag size={14} className="mr-2" />
              {loading ? "Adding..." : "Quick Add"}
            </div>
          </Button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-lg font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors duration-200 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and shipping info */}
        <div className="flex items-end justify-between pt-3 border-t border-neutral-100">
          <div className="space-y-1">
            <span className="text-xl font-light text-neutral-900 block">
              {formatPrice(product.price, product.currency || "USD")}
            </span>
            {product.price > config.freeShippingThreshold && (
              <p className="text-xs text-emerald-600 font-medium">
                Free shipping
              </p>
            )}
          </div>

          {/* Secondary CTA for mobile/accessibility */}
          <Link
            to={`/products/${product.id}`}
            className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors underline-offset-2 hover:underline hidden sm:block"
          >
            View details
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedProduct;
