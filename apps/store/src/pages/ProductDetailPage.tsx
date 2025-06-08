import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Product, useAppData, useCartStore } from "@/stores";
import { formatPrice, getCurrencySymbol } from "@/utils/currency";
import { config } from "@/config";
import { SizeGuideButton } from "@/components/SizeGuide";

const ProductDetailPage: React.FC = () => {
  const { getProduct, categories, getCategories } = useAppData();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const addToCart = useCartStore((state) => state.addToCart);
  const getCartItemQuantity = useCartStore(
    (state) => state.getCartItemQuantity
  );
  const updateQuantity = useCartStore((state) => state.updateQuantity);

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

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [categorySlug, setCategorySlug] = useState("");

  const [currentCartQuantity, setCurrentCartQuantity] = useState(
    getCartItemQuantity(id || "")
  );

  const productImages = product
    ? product.images_gallery?.filter(Boolean) || []
    : [];

  // Check if this product would benefit from size guide (clothing items)
  const isClothingItem =
    product?.category &&
    [
      "women",
      "men",
      "clothing",
      "tops",
      "bottoms",
      "dresses",
      "shirts",
      "pants",
      "jeans",
      "shoes",
      "sneakers",
      "boots",
    ].some((cat) => product.category?.toLowerCase().includes(cat));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner size="lg" variant="primary" text="Loading product..." inline />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-light text-neutral-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-neutral-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Button as={Link} to="/products" variant="primary">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    addToCart(product.id, selectedQuantity);
    setIsAddingToCart(false);
    setCurrentCartQuantity((prev) => prev + selectedQuantity);
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
    setCurrentCartQuantity(newQuantity);
  };

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description:
        product.price > config.freeShippingThreshold
          ? "Free delivery on this item"
          : `Add ${getCurrencySymbol(config.storeCurrency)}${(
              config.freeShippingThreshold - product.price
            ).toFixed(2)} for free shipping`,
      available: product.price > config.freeShippingThreshold,
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure checkout with Stripe",
      available: true,
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day return policy",
      available: true,
    },
  ];

  const getStockStatus = () => {
    if (product?.stock_quantity && product.stock_quantity > 10) {
      return {
        status: "In Stock",
        icon: CheckCircle,
      };
    } else if (product?.stock_quantity && product.stock_quantity > 0) {
      return {
        status: `Only ${product.stock_quantity} left`,
        icon: AlertCircle,
      };
    } else {
      return {
        status: "Out of Stock",
        icon: AlertCircle,
      };
    }
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-8">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-neutral-900 transition-colors"
          >
            Products
          </Link>
          {categorySlug && (
            <>
              <span>/</span>
              <Link
                to={{
                  pathname: "/products",
                  search: `?category=${categorySlug}`,
                }}
                className="hover:text-neutral-900 transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button
          as={Link}
          to="/products"
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          className="mb-8 text-neutral-600 hover:text-neutral-900"
        >
          Back to Products
        </Button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div>
            <div className="aspect-square mb-4 overflow-hidden bg-neutral-50">
              <img
                src={product.image_url || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border transition-colors ${
                      selectedImage === index
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.jpg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {product.category && (
              <div>
                <CategoryBadge category={product.category} />
              </div>
            )}

            <div>
              <h1 className="text-3xl font-light text-neutral-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.rating!)
                            ? "text-neutral-900 fill-current"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-900">
                    {product.rating}
                  </span>
                  <span className="text-sm text-neutral-600">
                    ({product.reviews_count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6 flex items-center">
                <span className="text-3xl font-light text-neutral-900">
                  {formatPrice(
                    product.price,
                    product.currency || config.storeCurrency
                  )}
                </span>
                {product.price > config.freeShippingThreshold && (
                  <Badge variant="minimal" size="sm" className="ml-4">
                    Free shipping
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <StockIcon size={14} className="text-neutral-600" />
              <span className="text-sm text-neutral-600">
                {stockStatus.status}
              </span>
            </div>

            {/* Size Guide for Clothing Items */}
            {isClothingItem && (
              <div>
                <SizeGuideButton
                  productCategory={product.category}
                  variant="minimal"
                  size="sm"
                  className="text-neutral-600 hover:text-neutral-900 pl-0 pr-0"
                />
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-neutral-600">Quantity:</span>
                  <div className="flex items-center border border-neutral-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                      }
                      disabled={selectedQuantity <= 1}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                      {selectedQuantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedQuantity(
                          Math.min(
                            product?.stock_quantity || 0,
                            selectedQuantity + 1
                          )
                        )
                      }
                      disabled={
                        selectedQuantity >= (product?.stock_quantity || 0)
                      }
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || isAddingToCart}
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isAddingToCart}
                leftIcon={
                  !isAddingToCart ? <ShoppingCart size={18} /> : undefined
                }
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>

              {/* Current Cart Status */}
              {currentCartQuantity > 0 && (
                <div className="p-4 bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      {currentCartQuantity} in cart
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          handleUpdateCartQuantity(currentCartQuantity - 1)
                        }
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
                          currentCartQuantity >= (product?.stock_quantity || 0)
                        }
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="border-t border-neutral-100 pt-8">
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon size={16} className="text-neutral-600" />
                      <div>
                        <span className="text-sm text-neutral-900">
                          {feature.title}
                        </span>
                        <span className="text-sm text-neutral-600 ml-1">
                          — {feature.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
