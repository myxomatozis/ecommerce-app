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

  // Filter states - simplified
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortBy, setSortBy] = useState<ProductFilters["sortBy"]>("name");

  const ITEMS_PER_PAGE = 12;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Products
            </h2>
            <p className="text-gray-600">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">{productsError}</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <Input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={20} />}
            fullWidth
            className="text-lg py-4"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Category:</span>
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

          <div className="flex gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <Dropdown
              options={sortOptions}
              value={sortBy || "name"}
              onChange={(value) => setSortBy(value as ProductFilters["sortBy"])}
              placeholder="Sort by"
              variant="bordered"
              size="sm"
            />
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image_url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-semibold text-gray-900">
                      ${product.price.toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  disabled={loadingMore}
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
