import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Award, Truck, RotateCcw } from "lucide-react";
import { Button, Card, Badge } from "@thefolk/ui";
import { Product, useAppData, useCartStore } from "@/stores";
import { formatPrice, getCurrencySymbol } from "@thefolk/utils";
import { config } from "@/config";

const HomePage: React.FC = () => {
  const { addToCart, loading } = useCartStore();
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const { getProducts } = useAppData();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts({ limit: 4 });
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [getProducts]);

  return (
    <div className="bg-white">
      {/* Hero Section - Modern minimal approach */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
            alt="Fashion Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-8">
              Discover Premium Collection
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Elevate your style with our curated selection of premium products
            </p>
            <Button
              as={Link}
              to="/products"
              variant="minimal"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
              className="bg-white text-neutral-900 hover:bg-neutral-100 px-10 py-4 text-base shadow-soft"
            >
              Explore Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding">
        <div className="container-modern">
          {/* Section Header */}
          <div className="text-center mb-16 space-content">
            <h2 className="heading-lg mb-6">Featured Products</h2>
            <p className="body-large max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid-products">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                variant="minimal"
                padding="none"
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Product Image */}
                <div className="relative aspect-product overflow-hidden bg-neutral-100">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image_url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Rating Badge */}
                  {product.rating && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" size="sm">
                        <div className="flex items-center text-xs text-neutral-900 mr-1 ml-1">
                          <Star
                            size={12}
                            className="text-neutral-600 fill-current mr-1"
                          />
                          {product.rating.toFixed(1)}
                        </div>
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-lg font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <span className="text-xl font-medium text-neutral-900">
                        {formatPrice(product.price, product.currency || "USD")}
                      </span>
                      {product.price > config.freeShippingThreshold && (
                        <p className="text-xs text-neutral-500">
                          Free shipping
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={loading}
                      onClick={() => addToCart(product.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Button
              as={Link}
              to="/products"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
              className="px-10"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Additional Section - Values/Features */}
      <section className="bg-neutral-50 section-padding">
        <div className="container-modern">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Premium Quality
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Carefully curated products that meet our high standards
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Fast Shipping
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Free shipping on orders over
                {getCurrencySymbol(config.storeCurrency)}
                {config.freeShippingThreshold}, delivered to your door
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCcw size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                Easy Returns
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                30-day return policy with hassle-free exchanges
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
