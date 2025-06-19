// src/hooks/useAppData.ts
import { useProductsStore, useCategoriesStore } from "@/stores";

/**
 * Convenient hook that provides easy access to all app data stores
 * This hook eliminates the need to import multiple stores in components
 */
export const useAppData = () => {
  const products = useProductsStore();
  const categories = useCategoriesStore();

  return {
    // Products
    products: products.products,
    getProduct: products.getProduct,
    getProductSKU: products.getProductSKU,
    getProducts: products.getProducts,
    searchProducts: products.searchProducts,
    getProductsByCategory: products.getProductsByCategory,
    loadMoreProducts: products.loadMoreProducts,
    isProductCached: products.isProductCached,
    getProductFromCache: products.getProductFromCache,
    clearProductsCache: products.clearCache,
    productsLoading: products.loading,
    productsError: products.error,

    // Categories
    categories: categories.categories,
    getCategories: categories.getCategories,
    getCategoryBySlug: categories.getCategoryBySlug,
    isCategoriesCached: categories.isCached,
    clearCategoriesCache: categories.clearCache,
    categoriesLoading: categories.loading,
    categoriesError: categories.error,
  };
};

/**
 * Hook specifically for product data - lighter alternative when you only need products
 */
export const useProducts = () => {
  return useProductsStore();
};

/**
 * Hook specifically for categories data
 */
export const useCategories = () => {
  return useCategoriesStore();
};
