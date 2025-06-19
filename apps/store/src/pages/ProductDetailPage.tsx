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
  const { getProduct, categories, getCategories } = useAppData();
  const [product, setProduct] = useState<Product | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
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
    <div className="min-h-screen bg-white">
      {/* Modern Header - Minimal Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              as={Link}
              to="/products"
              variant="ghost"
              leftIcon={<ArrowLeft size={16} />}
              className="text-neutral-600 hover:text-neutral-900 font-normal"
            >
              Back
            </Button>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <Heart size={18} className="text-neutral-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Content - Toteme-inspired Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
          {/* Image Gallery - Left Side (Larger) */}
          <div className="lg:col-span-8 bg-neutral-50">
            <div className="sticky top-16 h-[calc(100vh-4rem)] flex items-center justify-center">
              <div className="w-full top-0 aspect-[3/4] bg-white shadow-sm">
                <div
                  className="relative w-full h-full overflow-hidden cursor-zoom-in group"
                  onClick={() => setIsCarouselOpen(true)}
                >
                  <ProductImage
                    product={{
                      ...product,
                      image_url: productImages[selectedImage] || productImage,
                    }}
                  />
                </div>

                {/* Image Thumbnails */}
                {productImages.length > 1 && (
                  <div className="flex space-x-2 mt-4 justify-center">
                    {productImages.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-12 h-12 overflow-hidden transition-all duration-300 ${
                          selectedImage === index
                            ? "ring-2 ring-neutral-900 ring-offset-2"
                            : "hover:opacity-75"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details - Right Side (Narrower) */}
          <div className="lg:col-span-4 bg-white">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="p-8 lg:p-12 space-y-8">
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
                <div className="space-y-4">
                  <h1 className="text-2xl lg:text-3xl font-light text-neutral-900 leading-tight">
                    {product.name}
                  </h1>
                  <div className="text-xl text-neutral-900 font-normal">
                    {formatPrice(product.price, config.storeCurrency)}
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-neutral prose-sm max-w-none">
                  <p className="text-neutral-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Size Guide */}
                <div className="flex items-center space-x-4">
                  <SizeGuideButton />
                </div>

                {/* Quantity & Add to Cart */}
                <div className="space-y-6 pt-6 border-t border-neutral-100">
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
                          <ShoppingCart size={18} />
                        )
                      }
                      className="h-12 text-sm font-medium tracking-wide"
                    >
                      {isAddingToCart ? "Adding..." : "Add to Bag"}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded">
                        <span className="text-sm font-medium text-neutral-900">
                          In your bag
                        </span>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              handleUpdateCartQuantity(currentCartQuantity - 1)
                            }
                            disabled={currentCartQuantity <= 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="font-medium text-neutral-900 min-w-[2rem] text-center text-sm">
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
                            className="w-8 h-8 p-0"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>

                      <Button
                        as={Link}
                        to="/cart"
                        variant="outline"
                        size="lg"
                        fullWidth
                        className="h-12 text-sm font-medium"
                      >
                        View Bag
                      </Button>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon size={16} className="text-neutral-600 mt-0.5" />
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
                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">SKU</span>
                      <span className="text-neutral-900 font-mono">
                        {product.id.slice(-8).toUpperCase()}
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
