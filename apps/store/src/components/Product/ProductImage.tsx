import { Product } from "@/stores";
import { useEffect, useState } from "react";
import ProductImagePlaceholder from "./ImagePlaceholder";

const ProductImage = ({
  product,
  imageProps,
}: {
  product: Product;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}) => {
  const [loadingError, setLoadingError] = useState(false);
  useEffect(() => {
    setLoadingError(false);
  }, [product.image_url]);
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
      loading="lazy"
      onError={() => setLoadingError(true)}
      className="w-full h-full object-cover"
      {...imageProps}
      alt={imageProps?.alt || product.name}
    />
  );
};

export default ProductImage;
