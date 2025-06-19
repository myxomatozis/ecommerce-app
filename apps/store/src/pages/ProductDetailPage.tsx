import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  Shield,
  RefreshCw,
  Plus,
  Minus,
  ShoppingCart,
  AlertCircle,
  ZoomIn,
  Heart,
} from "lucide-react";
import { Button, Spinner, CategoryBadge, StatusBadge } from "@thefolk/ui";
import { Product, useAppData, useCartStore } from "@/stores";
import { formatPrice } from "@thefolk/utils";
import { config } from "@/config";
import { SizeGuideButton } from "@/components/SizeGuide";
import ProductImage from "@/components/Product/ProductImage";
import ProductImageCarousel from "@/components/Product/ImageCaroucel";

const ProductDetailPage: React.FC = () => {
  const { getProduct, categories, getCategories, getProductSKU } = useAppData();
  const [product, setProduct] = useState<Product | null>(null);
  const [sku, setSKU] = useState<string | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [_, setCategorySlug] = useState("");
  const { id } = useParams<{ id: string }>();

  const addToCart = useCartStore((state) => state.addToCart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const getCartItemQuantity = useCartStore(
    (state) => state.getCartItemQuantity
  );
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [currentCartQuantity, setCurrentCartQuantity] = useState(
    getCartItemQuantity(id || "")
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id)
      .then((data) => {
        if (data) {
          setProduct(data);
          getProductSKU(data.id).then((skuData) => {
            setSKU(skuData || null);
          });
          if (categories.length === 0) {
            getCategories().then((cat) => {
              setCategorySlug(
                cat.find((c) => c.name === data.category)?.slug || ""
              );
            });
          } else {
            setCategorySlug(
              categories.find((c) => c.name === data.category)?.slug || ""
            );
          }
        } else {
          setProduct(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const productImage = product?.image_url || "";
  const imagesGallery = product?.images_gallery?.filter(Boolean) || [];
  const productImages = product ? [productImage, ...imagesGallery] : [];

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1, false);
      setCurrentCartQuantity(getCartItemQuantity(product.id));
      setIsCartOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleUpdateCartQuantity = async (newQuantity: number) => {
    if (!product || newQuantity < 0) return;

    if (newQuantity === 0) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, newQuantity);
    }
    setCurrentCartQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="text-neutral-400 mx-auto" />
          <h2 className="text-xl font-light text-neutral-900">
            Product not found
          </h2>
          <Link to="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      icon: RefreshCw,
      title: "Free Returns",
      description: "30-day return policy",
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "SSL encrypted payments",
    },
  ];

  return (
    <div className="bg-white">
      {/* Product Content - Toteme-inspired Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Image Gallery - Left Side (Scrollable) */}
          <div className="lg:col-span-8 bg-neutral-50">
            {/* Back Button - Only on mobile */}
            <div className="lg:hidden p-6 bg-white">
              <Button
                as={Link}
                to="/products"
                variant="ghost"
                leftIcon={<ArrowLeft size={16} />}
                className="text-neutral-600 hover:text-neutral-900 font-normal"
              >
                Back
              </Button>
            </div>

            {/* Image Gallery */}
            <div className="space-y-1 lg:space-y-2 bg-white">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-full transition-all duration-300 cursor-zoom-in group aspect-[2.5/4]`}
                  onClick={() => {
                    setSelectedImage(index);
                    setIsCarouselOpen(true);
                  }}
                >
                  <ProductImage
                    product={{
                      ...product,
                      image_url: image,
                    }}
                    imageProps={{
                      className:
                        "w-full h-full object-cover object-center transition-transform duration-700",
                    }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                  {/* Zoom indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                      <ZoomIn size={14} className="text-neutral-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details - Right Side (Sticky) */}
          <div className="lg:col-span-4 bg-white border-l border-neutral-100">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="p-6 lg:p-8 space-y-6 lg:space-y-8">
                {/* Back Button - Desktop only */}
                <div className="hidden lg:block">
                  <Button
                    as={Link}
                    to="/products"
                    variant="ghost"
                    leftIcon={<ArrowLeft size={16} />}
                    className="text-neutral-600 hover:text-neutral-900 font-normal -ml-2"
                  >
                    Back
                  </Button>
                </div>

                {/* Category & Status */}
                <div className="flex items-center justify-between">
                  <CategoryBadge category={product.category || ""} size="sm" />
                  {product.stock_quantity && product.stock_quantity > 0 ? (
                    <StatusBadge status="active" size="sm">
                      In Stock
                    </StatusBadge>
                  ) : (
                    <StatusBadge status="inactive" size="sm">
                      Out of Stock
                    </StatusBadge>
                  )}
                </div>

                {/* Product Title & Price */}
                <div className="space-y-3">
                  <h1 className="text-xl lg:text-2xl font-light text-neutral-900 leading-tight">
                    {product.name}
                  </h1>
                  <div className="text-lg lg:text-xl text-neutral-900 font-normal">
                    {formatPrice(product.price, config.storeCurrency)}
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-neutral prose-sm max-w-none">
                  <p className="text-neutral-600 leading-relaxed text-sm lg:text-base">
                    {product.description}
                  </p>
                </div>

                {/* Size Guide */}
                <div className="flex items-center space-x-4">
                  <SizeGuideButton />
                </div>

                {/* Quantity & Add to Cart */}
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  {currentCartQuantity === 0 ? (
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || product.stock_quantity === 0}
                      variant="primary"
                      size="lg"
                      fullWidth
                      leftIcon={
                        isAddingToCart ? (
                          <Spinner size="sm" />
                        ) : (
                          <ShoppingCart size={16} />
                        )
                      }
                      className="h-11 text-sm font-medium tracking-wide"
                    >
                      {isAddingToCart ? "Adding..." : "Add to Bag"}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
                        <span className="text-sm font-medium text-neutral-900">
                          In your bag
                        </span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              handleUpdateCartQuantity(currentCartQuantity - 1)
                            }
                            disabled={currentCartQuantity <= 1}
                            className="w-7 h-7 p-0"
                          >
                            <Minus size={12} />
                          </Button>
                          <span className="font-medium text-neutral-900 min-w-[1.5rem] text-center text-sm">
                            {currentCartQuantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              handleUpdateCartQuantity(currentCartQuantity + 1)
                            }
                            disabled={
                              currentCartQuantity >=
                              (product?.stock_quantity || 0)
                            }
                            className="w-7 h-7 p-0"
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </div>

                      <Button
                        as={Link}
                        to="/cart"
                        variant="outline"
                        size="lg"
                        fullWidth
                        className="h-11 text-sm font-medium"
                      >
                        View Bag
                      </Button>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon size={14} className="text-neutral-600 mt-1" />
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-neutral-900">
                            {feature.title}
                          </div>
                          <div className="text-xs text-neutral-600">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Product Details */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">SKU</span>
                      <span className="text-neutral-900 font-mono text-xs">
                        {sku || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Availability</span>
                      <span className="text-neutral-900">
                        {product.stock_quantity} in stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wishlist */}
                <div className="pt-4 border-t border-neutral-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    leftIcon={<Heart size={14} />}
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    Add to Wishlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      <ProductImageCarousel
        productImages={productImages}
        product={product}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        initialIndex={selectedImage}
      />
    </div>
  );
};

export default ProductDetailPage;
