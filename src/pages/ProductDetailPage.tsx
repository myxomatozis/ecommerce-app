import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Product, useCart } from "@/contexts/CartContext";
import { Button, Card, CardContent, Badge } from "@/components/UI";
import { getProductById } from "@/lib/supabase";

const ProductDetailPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams<{ id: string }>();
  const { addToCart, getCartItemQuantity, updateQuantity } = useCart();

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((data) => {
        if (data) {
          setProduct(data);
        } else {
          setProduct(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null);
      });
  }, [id]);

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const currentCartQuantity = getCartItemQuantity(id || "");

  // Mock additional images for the product
  const productImages = product
    ? [
        product.image_url,
        product.image_url, // In real app, these would be different angles
        product.image_url,
        product.image_url,
      ].filter(Boolean)
    : [];

  // Mock related products
  const relatedProducts: Product[] = [];

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <CardContent>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Button as={Link} to="/products" variant="primary">
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    addToCart(product.id, selectedQuantity);
    setIsAddingToCart(false);
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description:
        product.price > 50
          ? "Free delivery on this item"
          : `Add ${(50 - product.price).toFixed(2)} for free shipping`,
      available: product.price > 50,
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure checkout",
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
    if (product.stock_quantity > 10) {
      return {
        status: "In Stock",
        variant: "success" as const,
        icon: CheckCircle,
      };
    } else if (product.stock_quantity > 0) {
      return {
        status: `Only ${product.stock_quantity} left`,
        variant: "warning" as const,
        icon: AlertCircle,
      };
    } else {
      return {
        status: "Out of Stock",
        variant: "danger" as const,
        icon: AlertCircle,
      };
    }
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-gray-900 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-gray-900 transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button
          as={Link}
          to="/products"
          variant="ghost"
          leftIcon={<ArrowLeft size={20} />}
          className="mb-8"
        >
          Back to Products
        </Button>

        {/* Product Detail */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="p-6">
              <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={productImages[selectedImage] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors p-0 ${
                        selectedImage === index
                          ? "border-primary-600"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.jpg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8">
              <div className="mb-4">
                <Badge variant="primary" size="md">
                  {product.category}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`${
                          i < Math.floor(product.rating!)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-gray-600">
                    ({product.reviews_count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.price > 50 && (
                  <Badge variant="success" size="sm" className="ml-4">
                    Free shipping included
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                <Badge
                  variant={stockStatus.variant}
                  size="md"
                  className="inline-flex items-center"
                >
                  <StockIcon size={16} className="mr-1" />
                  {stockStatus.status}
                </Badge>
              </div>

              {/* Quantity Selector and Add to Cart */}
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <Card variant="outlined" className="inline-flex">
                    <CardContent padding="none" className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                        }
                        disabled={selectedQuantity <= 1}
                        className="rounded-none border-r border-gray-200"
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {selectedQuantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedQuantity(
                            Math.min(
                              product.stock_quantity,
                              selectedQuantity + 1
                            )
                          )
                        }
                        disabled={selectedQuantity >= product.stock_quantity}
                        className="rounded-none border-l border-gray-200"
                      >
                        <Plus size={16} />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0 || isAddingToCart}
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isAddingToCart}
                    leftIcon={
                      !isAddingToCart ? <ShoppingCart size={20} /> : undefined
                    }
                  >
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>

                  <Button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    variant={isWishlisted ? "danger" : "outline"}
                    size="lg"
                    className="sm:w-auto"
                  >
                    <Heart
                      size={20}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                  </Button>
                </div>

                {/* Current Cart Status */}
                {currentCartQuantity > 0 && (
                  <Card
                    variant="outlined"
                    className="mt-4 border-primary-200 bg-primary-50"
                  >
                    <CardContent padding="sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="primary" size="sm">
                            {currentCartQuantity} in cart
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateCartQuantity(currentCartQuantity - 1)
                            }
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="font-medium text-primary-800 min-w-[2rem] text-center">
                            {currentCartQuantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateCartQuantity(currentCartQuantity + 1)
                            }
                            disabled={
                              currentCartQuantity >= product.stock_quantity
                            }
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Features */}
              <Card variant="outlined">
                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    What's Included
                  </h3>
                  <div className="space-y-4">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              feature.available
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  hover
                  className="overflow-hidden group"
                >
                  <Link to={`/products/${relatedProduct.id}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.image_url || "/placeholder.jpg"}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {relatedProduct.rating && (
                        <Badge
                          variant="default"
                          size="sm"
                          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900"
                        >
                          <Star
                            size={14}
                            className="text-yellow-400 fill-current mr-1"
                          />
                          {relatedProduct.rating}
                        </Badge>
                      )}
                    </div>

                    <CardContent>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        <Badge variant="secondary" size="sm">
                          {relatedProduct.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
