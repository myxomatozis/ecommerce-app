import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
import { Product, useAppData, useCartStore } from "@/stores";
import { Button, Input, Dropdown, Spinner } from "@/components/UI";
import { ProductFilters } from "@/lib/supabase";

const ProductsPage: React.FC = () => {
  const addToCart = useCartStore((state) => state.addToCart);
  const {
    getProducts,
    loadMoreProducts,
    productsError,
    categories,
    getCategories,
    categoriesLoading,
  } = useAppData();

  const [searchParams, setSearchParams] = useSearchParams();

  // Local UI state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortBy, setSortBy] = useState<ProductFilters["sortBy"]>(
    (searchParams.get("sort") as ProductFilters["sortBy"]) || "name"
  );

  const ITEMS_PER_PAGE = 16;

  // Load categories on mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Build current filters object
  const currentFilters = useMemo(
    (): ProductFilters => ({
      categorySlug: selectedCategory || undefined,
      searchTerm: searchQuery || undefined,
      sortBy,
      limit: ITEMS_PER_PAGE,
      offset: 0,
    }),
    [selectedCategory, searchQuery, sortBy]
  );

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(true);
  }, [currentFilters]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy) params.set("sort", sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const fetchProducts = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        const cached = await getProducts(currentFilters);
        if (cached && cached.length > 0) {
          setProducts(cached);
          setLoading(false);
        }
      } else {
        setLoadingMore(true);
      }

      const data = reset
        ? await getProducts(currentFilters)
        : await loadMoreProducts(currentFilters);

      if (reset) {
        setProducts(data);
        setHasMore(data.length === ITEMS_PER_PAGE);
      } else {
        setProducts((prev) => [...prev, ...data]);
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const categoryOptions = useMemo(
    () => [
      { value: "", label: "All Products" },
      ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    ],
    [categories]
  );

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-modern section-padding">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <h2 className="text-xl font-medium text-neutral-900 mb-2">
              Loading Products
            </h2>
            <p className="text-neutral-600">
              Please wait while we fetch the latest products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-modern section-padding">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle size={48} className="mx-auto text-neutral-400 mb-4" />
            <h2 className="text-xl font-medium text-neutral-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-neutral-600 mb-6">{productsError}</p>
            <Button onClick={() => fetchProducts(true)} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-modern py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-lg mb-4">All Products</h1>
          <p className="body-large">
            Discover our complete collection of premium products
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={20} />}
            fullWidth
            className="h-12 text-base"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
              Category:
            </span>
            <div className="min-w-[140px]">
              <Dropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Products"
                disabled={categoriesLoading}
                variant="bordered"
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
              Sort by:
            </span>
            <div className="min-w-[140px]">
              <Dropdown
                options={sortOptions}
                value={sortBy || "name"}
                onChange={(value) =>
                  setSortBy(value as ProductFilters["sortBy"])
                }
                placeholder="Sort by"
                variant="bordered"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-neutral-300 mb-6" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No products found
            </h3>
            <p className="text-neutral-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-8">
              <p className="text-sm text-neutral-600 text-center">
                Showing {products.length} products
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {products.map((product) => (
                <div key={product.id} className="group">
                  {/* Product Image */}
                  <div className="aspect-product overflow-hidden bg-neutral-100 mb-4">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image_url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-neutral-900">
                        ${product.price.toFixed(0)}
                      </p>
                      <Button
                        variant="minimal"
                        size="sm"
                        onClick={() => handleAddToCart(product.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  disabled={loadingMore}
                  className="px-10"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
