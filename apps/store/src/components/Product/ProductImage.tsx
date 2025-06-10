import { Product } from "@/stores";
import { useState } from "react";
import ProductImagePlaceholder from "./ImagePlaceholder";

const ProductImage = ({ product }: { product: Product }) => {
  const [loadingError, setLoadingError] = useState(false);
  if (!product.image_url || loadingError)
    return (
      <ProductImagePlaceholder
        category={product.category}
        size="md"
        className="w-full h-full object-cover"
      />
    );
  return (
    <img
      src={product.image_url}
      onError={() => setLoadingError(true)}
      alt={product.name}
      className="w-full h-full object-cover"
    />
  );
};

export default ProductImage;
