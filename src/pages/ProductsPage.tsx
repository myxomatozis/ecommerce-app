import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Grid,
  List,
  Star,
  Heart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Button,
  Card,
  CardContent,
  Input,
  Badge,
  Dropdown,
} from "@/components/UI";
import { Category, getCategories, getProducts, Product } from "@/lib/supabase";

const ProductsPage: React.FC = () => {
  const { addToCart, getCartItemQuantity } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
    getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 500 });
    setSortBy("featured");
    setSearchParams({});
  };

  const handleAddToCart = async (productId: string) => {
    addToCart(productId);
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "name", label: "Name A-Z" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Discover our complete collection of premium products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search size={20} />}
                  fullWidth
                />
              </div>

              {/* Mobile Filters Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="secondary"
                leftIcon={<SlidersHorizontal size={20} />}
                className="lg:hidden"
              >
                Filters
              </Button>

              {/* Desktop Filters */}
              <div
                className={`flex flex-col lg:flex-row gap-4 ${
                  showFilters ? "block" : "hidden lg:flex"
                }`}
              >
                {/* Category Filter */}
                <div className="min-w-[180px]">
                  <Dropdown
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="All Categories"
                  />
                </div>

                {/* Sort */}
                <div className="min-w-[200px]">
                  <Dropdown
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    placeholder="Sort by"
                  />
                </div>

                {/* View Mode */}
                <Card
                  variant="outlined"
                  className="inline-flex overflow-hidden"
                >
                  <CardContent padding="none" className="flex">
                    <Button
                      variant={viewMode === "grid" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid size={20} />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none border-l border-gray-200"
                    >
                      <List size={20} />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Price Range Filter - Mobile */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange.min} - ${priceRange.max}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: Number(e.target.value),
                      }))
                    }
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: Number(e.target.value),
                      }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(searchQuery || selectedCategory) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge
                        variant="primary"
                        className="inline-flex items-center"
                      >
                        Search: "{searchQuery}"
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="ml-1 p-0 h-4 w-4 hover:bg-primary-200 rounded-full"
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    )}
                    {selectedCategory && (
                      <Badge
                        variant="primary"
                        className="inline-flex items-center"
                      >
                        Category: {selectedCategory}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategory("")}
                          className="ml-1 p-0 h-4 w-4 hover:bg-primary-200 rounded-full"
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {isLoading && (
            <Badge variant="secondary" className="animate-pulse">
              Filtering...
            </Badge>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={clearFilters} variant="primary">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                hover
                className={
                  viewMode === "grid"
                    ? "overflow-hidden group"
                    : "overflow-hidden flex"
                }
              >
                {viewMode === "grid" ? (
                  // Grid View
                  <>
                    <div className="relative overflow-hidden">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.image_url || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                      >
                        <Heart size={18} className="text-gray-600" />
                      </Button>
                      {product.rating && (
                        <Badge
                          variant="default"
                          size="sm"
                          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900"
                        >
                          <Star
                            size={14}
                            className="text-yellow-400 fill-current mr-1"
                          />
                          {product.rating}
                        </Badge>
                      )}
                      {getCartItemQuantity(product.id) > 0 && (
                        <Badge
                          variant="primary"
                          size="sm"
                          className="absolute bottom-4 left-4"
                        >
                          {getCartItemQuantity(product.id)} in cart
                        </Badge>
                      )}
                    </div>

                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" size="sm">
                          {product.category}
                        </Badge>
                        {product.reviews_count && (
                          <span className="text-sm text-gray-400">
                            ({product.reviews_count} reviews)
                          </span>
                        )}
                      </div>

                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
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
                          onClick={() => handleAddToCart(product.id)}
                          variant="primary"
                          size="sm"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  // List View
                  <>
                    <div className="w-48 flex-shrink-0 relative">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.image_url || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                      >
                        <Heart size={16} className="text-gray-600" />
                      </Button>
                    </div>

                    <CardContent className="flex-1">
                      <div className="flex items-start justify-between h-full">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <Badge variant="secondary" size="sm">
                              {product.category}
                            </Badge>
                            {product.rating && (
                              <div className="flex items-center space-x-1">
                                <Star
                                  size={14}
                                  className="text-yellow-400 fill-current"
                                />
                                <span className="text-sm text-gray-600">
                                  {product.rating}
                                </span>
                                <span className="text-sm text-gray-400">
                                  ({product.reviews_count})
                                </span>
                              </div>
                            )}
                          </div>

                          <Link to={`/products/${product.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {product.description}
                          </p>

                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-gray-900">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.price > 50 && (
                              <Badge variant="success" size="sm">
                                Free shipping
                              </Badge>
                            )}
                            {getCartItemQuantity(product.id) > 0 && (
                              <Badge variant="primary" size="sm">
                                {getCartItemQuantity(product.id)} in cart
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="ml-6 flex flex-col space-y-2">
                          <Button
                            onClick={() => handleAddToCart(product.id)}
                            variant="primary"
                            size="md"
                          >
                            Add to Cart
                          </Button>
                          <Button
                            as={Link}
                            to={`/products/${product.id}`}
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button (for pagination in real app) */}
        {filteredProducts.length > 0 &&
          filteredProducts.length === products.length && (
            <div className="text-center mt-12">
              <Button variant="secondary" size="lg">
                Load More Products
              </Button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductsPage;
