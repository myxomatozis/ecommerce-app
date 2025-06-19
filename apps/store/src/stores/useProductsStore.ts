// src/stores/useProductsStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  SupabaseAPI,
  ProductFilters,
  Product as DBProduct,
} from "@thefolk/utils/supabase";

// Create a cache key for product lists based on filters, hash it to ensure uniqueness
const createCacheKey = (filters: ProductFilters = {}) => {
  const key = {
    categorySlug: filters.categorySlug || "",
    searchTerm: filters.searchTerm || "",
    minPrice: filters.minPrice || 0,
    maxPrice: filters.maxPrice || 0,
    sortBy: filters.sortBy || "name",
    limit: filters.limit || 50,
    offset: filters.offset || 0,
  };
  const str = JSON.stringify(key);
  // Simple hash function (djb2)
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash.toString();
};

export type Product = Omit<DBProduct, "category_id"> & {
  category?: string;
  sku: string;
};

interface ProductsList {
  products: Product[];
  hasMore: boolean;
  total: number;
  lastFetched: number;
  loading: boolean;
}

interface ProductsState {
  // Individual products cache (by ID)
  products: Record<string, Product>;
  productLoadingStates: Record<string, boolean>;

  // Product lists cache (by filter criteria)
  productLists: Record<string, ProductsList>;

  // Global loading and error states
  loading: boolean;
  error: string | null;

  // Actions
  getProduct: (id: string, forceRefresh?: boolean) => Promise<Product | null>;
  getProducts: (
    filters?: ProductFilters,
    forceRefresh?: boolean
  ) => Promise<Product[]>;
  searchProducts: (
    searchTerm: string,
    forceRefresh?: boolean
  ) => Promise<Product[]>;
  getProductsByCategory: (
    categorySlug: string,
    forceRefresh?: boolean
  ) => Promise<Product[]>;
  loadMoreProducts: (filters?: ProductFilters) => Promise<Product[]>;

  // Cache management
  clearCache: () => void;
  clearProductListCache: (filters?: ProductFilters) => void;
  refreshProduct: (id: string) => Promise<Product | null>;

  // Helpers
  isProductCached: (id: string) => boolean;
  isProductListCached: (filters?: ProductFilters) => boolean;
  getProductFromCache: (id: string) => Product | null;
  getProductListFromCache: (filters?: ProductFilters) => Product[] | null;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const isCacheValid = (timestamp: number) =>
  Date.now() - timestamp < CACHE_EXPIRY;

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set, get) => ({
      products: {},
      productLoadingStates: {},
      productLists: {},
      loading: false,
      error: null,

      getProduct: async (id: string, forceRefresh = false) => {
        const state = get();

        // Return cached product if available and not forcing refresh
        if (!forceRefresh && state.products[id]) {
          return state.products[id];
        }

        // Check if already loading this product
        if (state.productLoadingStates[id]) {
          // Wait for existing request to complete
          return new Promise((resolve) => {
            const checkLoading = () => {
              const currentState = get();
              if (!currentState.productLoadingStates[id]) {
                resolve(currentState.products[id] || null);
              } else {
                setTimeout(checkLoading, 100);
              }
            };
            checkLoading();
          });
        }

        // Set loading state for this specific product
        set((state) => ({
          productLoadingStates: {
            ...state.productLoadingStates,
            [id]: true,
          },
          error: null,
        }));

        try {
          const product = await SupabaseAPI.getProductById(id);
          const sku = product.id.slice(-8).toUpperCase();

          set((state) => ({
            products: product
              ? { ...state.products, [id]: { ...product, sku } }
              : state.products,
            productLoadingStates: {
              ...state.productLoadingStates,
              [id]: false,
            },
          }));

          return product;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch product";

          set((state) => ({
            productLoadingStates: {
              ...state.productLoadingStates,
              [id]: false,
            },
            error: errorMessage,
          }));

          return null;
        }
      },

      getProducts: async (
        filters: ProductFilters = {},
        forceRefresh = false
      ) => {
        const state = get();
        const cacheKey = createCacheKey(filters);
        const cachedList = state.productLists[cacheKey];

        // Return cached list if available and valid
        if (
          !forceRefresh &&
          cachedList &&
          isCacheValid(cachedList.lastFetched) &&
          !cachedList.loading
        ) {
          // Also update individual products cache
          cachedList.products.forEach((product) => {
            set((state) => ({
              products: { ...state.products, [product.id]: product },
            }));
          });
          return cachedList.products;
        }

        // Check if already loading this list
        if (cachedList?.loading) {
          return new Promise((resolve) => {
            const checkLoading = () => {
              const currentState = get();
              const currentList = currentState.productLists[cacheKey];
              if (!currentList?.loading) {
                resolve(currentList?.products || []);
              } else {
                setTimeout(checkLoading, 100);
              }
            };
            checkLoading();
          });
        }

        // Set loading state for this list
        set((state) => ({
          productLists: {
            ...state.productLists,
            [cacheKey]: {
              ...state.productLists[cacheKey],
              loading: true,
              products: state.productLists[cacheKey]?.products || [],
              hasMore: state.productLists[cacheKey]?.hasMore ?? true,
              total: state.productLists[cacheKey]?.total || 0,
              lastFetched: state.productLists[cacheKey]?.lastFetched || 0,
            },
          },
          error: null,
        }));

        try {
          const products = (await SupabaseAPI.getProducts(filters)).map(
            (product) => {
              const sku = product.id.slice(-8).toUpperCase();
              return { ...product, sku };
            }
          );
          const hasMore = products.length === (filters.limit || 50);

          set((state) => ({
            // Update individual products cache
            products: {
              ...state.products,
              ...products.reduce(
                (acc, product) => ({ ...acc, [product.id]: product }),
                {}
              ),
            },
            // Update product list cache
            productLists: {
              ...state.productLists,
              [cacheKey]: {
                products,
                hasMore,
                total: products.length,
                lastFetched: Date.now(),
                loading: false,
              },
            },
          }));

          return products;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to fetch products";

          set((state) => ({
            productLists: {
              ...state.productLists,
              [cacheKey]: {
                ...state.productLists[cacheKey],
                loading: false,
              },
            },
            error: errorMessage,
          }));

          return [];
        }
      },

      searchProducts: async (searchTerm: string, forceRefresh = false) => {
        return get().getProducts({ searchTerm }, forceRefresh);
      },

      getProductsByCategory: async (
        categorySlug: string,
        forceRefresh = false
      ) => {
        return get().getProducts({ categorySlug }, forceRefresh);
      },

      loadMoreProducts: async (filters: ProductFilters = {}) => {
        const state = get();
        const cacheKey = createCacheKey(filters);
        const cachedList = state.productLists[cacheKey];

        if (!cachedList || !cachedList.hasMore || cachedList.loading) {
          return cachedList?.products || [];
        }

        const newFilters = {
          ...filters,
          offset: cachedList.products.length,
        };

        try {
          const newProducts = (await SupabaseAPI.getProducts(newFilters)).map(
            (product) => {
              const sku = product.id.slice(-8).toUpperCase();
              return { ...product, sku };
            }
          );
          const hasMore = newProducts.length === (filters.limit || 50);

          set((state) => ({
            // Update individual products cache
            products: {
              ...state.products,
              ...newProducts.reduce(
                (acc, product) => ({ ...acc, [product.id]: product }),
                {}
              ),
            },
            // Update product list cache with appended products
            productLists: {
              ...state.productLists,
              [cacheKey]: {
                ...state.productLists[cacheKey],
                products: [
                  ...state.productLists[cacheKey].products,
                  ...newProducts,
                ],
                hasMore,
                total: state.productLists[cacheKey].total + newProducts.length,
                lastFetched: Date.now(),
              },
            },
          }));

          return [...cachedList.products, ...newProducts];
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load more products";
          set({ error: errorMessage });
          return cachedList.products;
        }
      },

      clearCache: () => {
        set({
          products: {},
          productLists: {},
          productLoadingStates: {},
          error: null,
        });
      },

      clearProductListCache: (filters?: ProductFilters) => {
        if (filters) {
          const cacheKey = createCacheKey(filters);
          set((state) => {
            const newProductLists = { ...state.productLists };
            delete newProductLists[cacheKey];
            return { productLists: newProductLists };
          });
        } else {
          set(() => ({ productLists: {} }));
        }
      },

      refreshProduct: async (id: string) => {
        return get().getProduct(id, true);
      },

      // Helper methods
      isProductCached: (id: string) => {
        return !!get().products[id];
      },

      isProductListCached: (filters: ProductFilters = {}) => {
        const cacheKey = createCacheKey(filters);
        const cachedList = get().productLists[cacheKey];
        return !!cachedList && isCacheValid(cachedList.lastFetched);
      },

      getProductFromCache: (id: string) => {
        return get().products[id] || null;
      },

      getProductListFromCache: (filters: ProductFilters = {}) => {
        const cacheKey = createCacheKey(filters);
        const cachedList = get().productLists[cacheKey];
        return cachedList && isCacheValid(cachedList.lastFetched)
          ? cachedList.products
          : null;
      },
    }),
    {
      name: "products-store",
    }
  )
);
