import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Plus } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/UI";
import { Product, useAppData, useCartStore } from "@/stores";

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
    <div>
      {/* Hero Section - Viewport height minus header */}
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Full Screen Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
            alt="Fashion Collection"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Discover Premium Collection
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light">
              Elevate your style with our curated selection of premium products
            </p>
            <Button
              as={Link}
              to="/products"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={24} />}
              className="text-lg px-8 py-4"
            >
              Shop Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
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
                      isLoading={loading}
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
    </div>
  );
};

export default HomePage;
