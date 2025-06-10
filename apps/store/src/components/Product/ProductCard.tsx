import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/stores";
import { Badge, Button, Card, CategoryBadge } from "@thefolk/ui";
import { formatPrice } from "@thefolk/utils";
import { config } from "@/config";
import ProductImage from "./ProductImage";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
  itemsPerPage: number;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  itemsPerPage,
  onAddToCart,
}) => {
  return (
    <Card
      key={product.id}
      variant="minimal"
      padding="none"
      className="group cursor-pointer overflow-hidden hover:shadow-md transition-all duration-700 bg-white"
      style={{
        animation: `fadeIn 0.6s ease-out forwards`,
        animationDelay: `${(index % itemsPerPage) * 50}ms`,
      }}
    >
      <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 mb-6 relative">
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0 z-10 block"
        >
          <ProductImage product={product} />
        </Link>

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 pointer-events-none z-20" />

        {/* Quick Add Button Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-50 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            aria-label="Quick Add to Cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product.id);
            }}
            className="backdrop-blur-md text-neutral-900 hover:shadow-md font-medium border-0 py-3"
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex items-center justify-center space-x-2">
              <ShoppingBag size={14} className="mr-2" />
              Add to Cart
            </div>
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3 px-2 pb-2">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline justify-between">
          <p className="text-lg font-light text-neutral-900">
            {formatPrice(
              product.price,
              product.currency || config.storeCurrency
            )}
          </p>

          {product.category && <CategoryBadge category={product.category} />}
        </div>

        {/* Free shipping indicator */}
        {product.price > config.freeShippingThreshold && (
          <div className="flex w-full justify-end">
            <Badge variant="minimal" size="xs">
              Free shipping
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
