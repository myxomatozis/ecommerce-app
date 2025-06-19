import { Product } from "@/stores";
import { FC, useEffect, useState } from "react";
import ProductImagePlaceholder from "./ImagePlaceholder";

type ProductImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  product: Product;
};

const ProductImage: FC<ProductImageProps> = ({ product, ...imageProps }) => {
  const [loadingError, setLoadingError] = useState(false);
  useEffect(() => {
    setLoadingError(false);
  }, [product.image_url]);
  if (!product.image_url || loadingError)
    return <ProductImagePlaceholder className="w-full h-full object-cover" />;
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
