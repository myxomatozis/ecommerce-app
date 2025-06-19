import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, AlertCircle, SlidersHorizontal, X } from "lucide-react";
import { Product, useAppData } from "@/stores";
import { Button, Input, Dropdown, Spinner, Badge } from "@thefolk/ui";
import { ProductFilters } from "@thefolk/utils/supabase";
import ProductCard from "@/components/Product/ProductCard";

const ProductsPage: React.FC = () => {
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
      const result = await getProducts(currentFilters);
      if (result) {
        setProducts(result);
        // Determine hasMore based on whether we got a full page
        setHasMore(result.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const result = await loadMoreProducts(currentFilters);

      if (result) {
        setProducts(result); // loadMoreProducts returns the full concatenated array
        // Determine hasMore based on whether we got new products
        const newProductsCount = result.length - products.length;
        setHasMore(newProductsCount === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-wide">
              Collection
            </h1>
          </div>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* Top Bar - Original Layout */}
          <div className="flex items-center gap-4 mb-6">
            {/* Left: Filter Controls */}
            <div className="flex items-center gap-4 w-[33.33%]">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<SlidersHorizontal size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>

              {(currentFilters.searchTerm ||
                currentFilters.categorySlug ||
                currentFilters.sortBy !== "name") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchInput("");
                    updateParams({ search: null, category: null, sort: null });
                    setShowFilters(false);
                  }}
                  className="text-neutral-500 hover:text-neutral-700 font-light"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 flex justify-center w-[33.33%]">
              <div className="relative max-w-sm w-full">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  leftIcon={<Search size={16} />}
                  className="border-neutral-200 focus:border-neutral-400 text-sm font-light"
                />
              </div>
            </div>

            {/* Right: Product Count */}
            <div className="flex-shrink-0 w-[33.33%] text-right">
              {!loading && products.length > 0 && (
                <p className="text-sm text-neutral-500 font-light">
                  {products.length} {products.length === 1 ? "item" : "items"}
                </p>
              )}
            </div>
          </div>

          {/* Expandable Filter Controls */}
          {showFilters && (
            <div className="bg-neutral-50 p-6 mb-8 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-light text-neutral-900">Filter Products</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-neutral-700 mb-2">
                    Category
                  </label>
                  <Dropdown
                    options={[
                      { value: "", label: "All Categories" },
                      ...categories.map((cat) => ({
                        value: cat.slug,
                        label: cat.name,
                      })),
                    ]}
                    value={currentFilters.categorySlug || ""}
                    onChange={(category) =>
                      updateParams({ category: category || null })
                    }
                    placeholder="All Categories"
                    disabled={categoriesLoading}
                    size="md"
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-neutral-700 mb-2">
                    Sort By
                  </label>
                  <Dropdown
                    options={sortOptions}
                    value={currentFilters.sortBy || "name"}
                    onChange={(sort) =>
                      updateParams({ sort: sort === "name" ? null : sort })
                    }
                    size="md"
                    fullWidth
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Badges */}
          {(currentFilters.searchTerm ||
            currentFilters.categorySlug ||
            currentFilters.sortBy !== "name") && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentFilters.searchTerm && (
                <Badge
                  variant="outline"
                  size="sm"
                  removable
                  onRemove={() => {
                    setSearchInput("");
                    updateParams({ search: null });
                  }}
                  className="font-light"
                >
                  Search: {currentFilters.searchTerm}
                </Badge>
              )}
              {currentFilters.categorySlug && (
                <Badge
                  variant="outline"
                  size="sm"
                  removable
                  onRemove={() => updateParams({ category: null })}
                  className="font-light"
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
                  size="sm"
                  removable
                  onRemove={() => updateParams({ sort: null })}
                  className="font-light"
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
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : productsError ? (
          <div className="text-center py-16">
            <AlertCircle className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-light text-neutral-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-neutral-600 font-light mb-6">
              We couldn't load the products. Please try again.
            </p>
            <Button
              variant="primary"
              onClick={loadProducts}
              className="font-light"
            >
              Try Again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-light text-neutral-900 mb-2">
              No products found
            </h3>
            <p className="text-neutral-600 font-light mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchInput("");
                updateParams({ search: null, category: null });
              }}
              className="font-light"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-16">
                <Button
                  variant="ghost"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="border border-neutral-200 hover:border-neutral-400 px-8 py-3 text-sm font-light tracking-wide transition-colors"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <Spinner size="sm" />
                      <span>Loading...</span>
                    </div>
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
