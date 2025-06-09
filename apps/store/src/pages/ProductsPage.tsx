import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, AlertCircle, SlidersHorizontal, X } from "lucide-react";
import { Product, useAppData, useCartStore } from "@/stores";
import { Button, Input, Dropdown, Spinner, Badge } from "@thefolk/ui";
import { ProductFilters } from "@/lib/supabase";
import { formatPrice } from "@thefolk/utils";
import { config } from "@/config";

const ProductsPage: React.FC = () => {
  const { addToCart } = useCartStore();
  const {
    getProducts,
    loadMoreProducts,
    productsError,
    categories,
    getCategories,
    categoriesLoading,
  } = useAppData();

  const [searchParams, setSearchParams] = useSearchParams();

  // Simple local state - only for UI and data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const ITEMS_PER_PAGE = 16;

  // Derive all filter state from URL params - single source of truth
  const currentFilters = useMemo((): ProductFilters => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "name";

    return {
      categorySlug: category || undefined,
      searchTerm: search || undefined,
      sortBy: sort as ProductFilters["sortBy"],
      limit: ITEMS_PER_PAGE,
      offset: 0,
    };
  }, [searchParams]);

  // Helper to update URL params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === "") {
            newParams.delete(key);
          } else {
            newParams.set(key, value);
          }
        });

        return newParams;
      });
    },
    [setSearchParams]
  );

  // Initialize search input from URL on mount
  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
  }, []); // Only run once

  // Load categories on mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (searchInput !== currentSearch) {
        updateParams({ search: searchInput || null });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchParams, updateParams]);

  // Single effect for data fetching when filters change
  useEffect(() => {
    loadProducts();
  }, [currentFilters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(currentFilters);
      setProducts(data);
      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const data = await loadMoreProducts(currentFilters);
      setProducts(data);
      setHasMore(data.length > products.length);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  // Dropdown options
  const categoryOptions = useMemo(
    () => [
      { value: "", label: "All Categories" },
      ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    ],
    [categories]
  );

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  // Filter handlers
  const handleCategoryChange = (category: string) => {
    updateParams({ category: category || null });
  };

  const handleSortChange = (sort: string) => {
    updateParams({ sort: sort === "name" ? null : sort });
  };

  const clearFilters = () => {
    setSearchInput("");
    updateParams({ search: null, category: null, sort: null });
    setShowFilters(false);
  };

  // Derived state
  const hasActiveFilters =
    currentFilters.searchTerm ||
    currentFilters.categorySlug ||
    currentFilters.sortBy !== "name";

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-modern py-24">
          <div className="text-center max-w-md mx-auto">
            <div className="w-8 h-8 mx-auto mb-6">
              <Spinner size="lg" />
            </div>
            <p className="text-neutral-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-modern py-24">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle size={32} className="mx-auto text-neutral-400 mb-6" />
            <h2 className="text-lg font-medium text-neutral-900 mb-2">
              Unable to load products
            </h2>
            <p className="text-neutral-600 mb-8">{productsError}</p>
            <Button onClick={loadProducts} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <section className="border-b border-neutral-100">
        <div className="container-modern py-8">
          <div className="text-center">
            <h1 className="text-xl font-medium text-neutral-900">Products</h1>
          </div>
        </div>
      </section>

      <div className="container-modern py-8">
        {/* Search & Filters Section */}
        <div className="mb-12">
          {/* Top Bar */}
          <div className="flex items-center gap-4 mb-6">
            {/* Left: Filter Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<SlidersHorizontal size={16} />}
                className="text-neutral-600"
              >
                Filters
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="minimal"
                  size="sm"
                  onClick={clearFilters}
                  className="text-neutral-500"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 flex justify-center">
              <div className="relative max-w-sm w-full">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-10 pl-10 pr-4 text-sm border-neutral-200 focus:border-neutral-400"
                  fullWidth
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            {/* Right: Product Count */}
            <div className="flex-shrink-0">
              {products.length > 0 && (
                <p className="text-sm text-neutral-600">
                  {products.length} {products.length === 1 ? "item" : "items"}
                </p>
              )}
            </div>
          </div>

          {/* Expandable Filter Controls */}
          {showFilters && (
            <div className="bg-neutral-50 p-6 mb-8 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-neutral-900">
                  Filter Products
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <Dropdown
                    options={categoryOptions}
                    value={currentFilters.categorySlug || ""}
                    onChange={handleCategoryChange}
                    placeholder="All Categories"
                    disabled={categoriesLoading}
                    variant="bordered"
                    size="sm"
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort By
                  </label>
                  <Dropdown
                    options={sortOptions}
                    value={currentFilters.sortBy || "name"}
                    onChange={handleSortChange}
                    variant="bordered"
                    size="sm"
                    fullWidth
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-8">
              {currentFilters.searchTerm && (
                <Badge
                  variant="outline"
                  removable
                  onRemove={() => {
                    setSearchInput("");
                    updateParams({ search: null });
                  }}
                >
                  Search: {currentFilters.searchTerm}
                </Badge>
              )}
              {currentFilters.categorySlug && (
                <Badge
                  variant="outline"
                  removable
                  onRemove={() => updateParams({ category: null })}
                >
                  Category:{" "}
                  {
                    categories.find(
                      (c) => c.slug === currentFilters.categorySlug
                    )?.name
                  }
                </Badge>
              )}
              {currentFilters.sortBy !== "name" && (
                <Badge
                  variant="outline"
                  removable
                  onRemove={() => updateParams({ sort: null })}
                >
                  Sort:{" "}
                  {
                    sortOptions.find((s) => s.value === currentFilters.sortBy)
                      ?.label
                  }
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No products found
              </h3>
              <p className="text-neutral-600 mb-6">
                Try adjusting your search terms or filters
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className="group"
                  style={{
                    animation: `fadeIn 0.6s ease-out forwards`,
                    animationDelay: `${(index % ITEMS_PER_PAGE) * 50}ms`,
                  }}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-neutral-50 mb-4 relative">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image_url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02] cursor-pointer"
                        loading="lazy"
                      />
                    </Link>

                    {/* Quick Add Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none">
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddToCart(product.id)}
                          fullWidth
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1 group-hover:text-neutral-600">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline justify-between">
                      <p className="text-lg font-medium text-neutral-900">
                        {formatPrice(
                          product.price,
                          product.currency || config.storeCurrency
                        )}
                      </p>

                      {product.category && (
                        <Badge
                          variant="minimal"
                          size="xs"
                          className="text-neutral-500"
                        >
                          {product.category}
                        </Badge>
                      )}
                    </div>

                    {/* Free shipping indicator */}
                    {product.price > config.freeShippingThreshold && (
                      <p className="text-xs text-neutral-500">Free shipping</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  disabled={loadingMore}
                  className="px-12"
                >
                  {loadingMore ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
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
