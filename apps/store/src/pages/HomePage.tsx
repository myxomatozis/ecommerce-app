import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  Users,
  Leaf,
} from "lucide-react";
import { Button, Card, Badge } from "@thefolk/ui";
import { Product, useAppData, useCartStore } from "@/stores";
import { formatPrice, getCurrencySymbol } from "@thefolk/utils";
import { config } from "@/config";

const HomePage: React.FC = () => {
  const { addToCart, loading } = useCartStore();
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const { getProducts } = useAppData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=1080&fit=crop&auto=format",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts({ limit: 6 });
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [getProducts]);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="bg-white">
      {/* Hero Section - Full-screen with dynamic backgrounds */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Fashion Collection ${index + 1}`}
              className="w-full h-full object-cover scale-105 transition-transform duration-[20000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
          </div>
        ))}

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-2000" />

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Curated for the
                <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  Modern Folk
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
                Discover timeless pieces that tell your story through
                thoughtfully selected fashion and lifestyle essentials
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                as={Link}
                to="/products"
                variant="minimal"
                size="lg"
                rightIcon={<ArrowRight size={20} />}
                className="bg-white text-neutral-900 hover:bg-gray-100 px-12 py-4 text-lg font-medium shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
              >
                Explore Collection
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline"
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white/10 px-12 py-4 text-lg backdrop-blur-sm transition-all duration-500"
              >
                Our Story
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Values Section - Modern cards */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container-modern">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-6 tracking-tight">
              Why Choose The Folk
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Every piece in our collection is carefully curated to meet our
              standards of quality, sustainability, and timeless design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Curated Quality",
                description:
                  "Each item is hand-selected by our team for exceptional craftsmanship and lasting appeal that transcends seasons.",
              },
              {
                icon: Leaf,
                title: "Sustainable Choice",
                description:
                  "We partner with brands committed to ethical practices and environmental responsibility for a better tomorrow.",
              },
              {
                icon: Users,
                title: "Community Driven",
                description:
                  "Join thousands of style enthusiasts who trust us to bring them the finest in contemporary fashion.",
              },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                variant="minimal"
                className="group p-10 text-center hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-neutral-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 bg-white">
        <div className="container-modern">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mb-6 tracking-tight">
              Featured Collection
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium products that define
              contemporary style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                variant="minimal"
                padding="none"
                className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-1"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image_url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </Link>

                  {/* Floating Badge */}
                  {product.rating && (
                    <div className="absolute top-6 left-6">
                      <Badge
                        variant="default"
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm"
                      >
                        <div className="flex items-center text-xs text-neutral-900">
                          <Star
                            size={12}
                            className="text-yellow-500 fill-current mr-1"
                          />
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
                        <p className="text-sm text-green-600 font-medium">
                          Free shipping
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              as={Link}
              to="/products"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
              className="px-12 py-4 text-lg border-2 hover:bg-neutral-900 hover:text-white transition-all duration-500"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Modern gradient */}
      <section className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        </div>

        <div className="container-modern relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Join Our Community
            </h2>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Be the first to discover new arrivals, exclusive events, and
              styling inspiration from The Folk
            </p>

            <form className="max-w-lg mx-auto flex gap-4 mt-12">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                required
              />
              <Button
                type="submit"
                variant="minimal"
                size="lg"
                className="bg-white text-neutral-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container-modern">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                description: `Carefully curated products that meet our high standards`,
              },
              {
                icon: Truck,
                title: "Fast Shipping",
                description: `Free shipping on orders over ${getCurrencySymbol(config.storeCurrency)}${config.freeShippingThreshold}, delivered to your door`,
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                description: "30-day return policy with hassle-free exchanges",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center space-y-4">
                <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
