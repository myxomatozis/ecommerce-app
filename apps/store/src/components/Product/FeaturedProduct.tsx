import { config } from "@/config";
import { addToCart } from "@/lib/supabase";
import { Product } from "@/stores";
import { Card, Button, Badge } from "@thefolk/ui";
import { formatPrice } from "@thefolk/utils";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

const FeaturedProduct = ({
  product,
  loading,
}: {
  product: Product;
  loading: boolean;
}) => (
  <Card
    key={product.id}
    variant="minimal"
    padding="none"
    className="group cursor-pointer overflow-hidden hover:shadow-sm transition-all duration-700"
  >
    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
      <Link to={`/products/${product.id}`}>
        <ProductImage product={product} />
      </Link>

      {/* Floating Badge */}
      {product.rating && (
        <div className="absolute top-6 left-6">
          <Badge
            variant="default"
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
          >
            <div className="flex items-center text-xs text-neutral-900 pl-1 pr-1">
              <Star size={12} className="text-yellow-500 fill-current mr-1" />
              {product.rating.toFixed(1)}
            </div>
          </Badge>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quick Add Button */}
      <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <Button
          variant="minimal"
          size="sm"
          isLoading={loading}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product.id);
          }}
          className="w-full bg-white text-neutral-900 hover:bg-gray-100 font-medium"
        >
          Quick Add
        </Button>
      </div>
    </div>

    <div className="p-8 space-y-4">
      <div className="space-y-3">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-xl font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-neutral-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="space-y-1">
          <span className="text-2xl font-light text-neutral-900">
            {formatPrice(product.price, product.currency || "USD")}
          </span>
          {product.price > config.freeShippingThreshold && (
            <p className="text-sm text-green-600 font-medium">Free shipping</p>
          )}
        </div>
      </div>
    </div>
  </Card>
);

export default FeaturedProduct;
