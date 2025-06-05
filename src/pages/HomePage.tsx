import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Heart,
  Plus,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/UI";
import { Product, useAppData, useCartStore } from "@/stores";

const HomePage: React.FC = () => {
  const addToCart = useCartStore((state) => state.addToCart);
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

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on orders over $100",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "24/7 customer support",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Discover the Latest Collection
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Step into style with our curated selection of fashion-forward
                pieces. Explore the newest trends and elevate your wardrobe
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  as={Link}
                  to="/products"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={20} />}
                >
                  Shop Now
                </Button>
                <Button
                  as={Link}
                  to="/products?sort=newest"
                  variant="outline"
                  size="lg"
                >
                  New Arrivals
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                  alt="Fashion Collection"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Simple floating badge */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    4.9 Rating
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">10,000+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of fashion essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Clothing",
                href: "/products?category=clothing",
                image:
                  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop",
              },
              {
                name: "Shoes",
                href: "/products?category=shoes",
                image:
                  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
              },
              {
                name: "Accessories",
                href: "/products?category=accessories",
                image:
                  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
              },
            ].map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/5]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <span className="text-white/90 group-hover:text-white transition-colors">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} hover className="overflow-hidden group">
                <div className="relative overflow-hidden">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image_url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart size={18} className="text-gray-600" />
                  </button>
                  {product.rating && (
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="default"
                        size="sm"
                        className="bg-white/90 text-gray-900"
                      >
                        <Star
                          size={14}
                          className="text-yellow-400 fill-current mr-1"
                        />
                        {product.rating.toFixed(1)}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.price > 50 && (
                        <Badge
                          variant="success"
                          size="sm"
                          className="block mt-1"
                        >
                          Free shipping
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      leftIcon={<Plus size={16} />}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              as={Link}
              to="/products"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter for exclusive offers and new arrivals
          </p>

          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
