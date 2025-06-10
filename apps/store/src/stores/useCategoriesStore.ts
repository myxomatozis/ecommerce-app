// src/stores/useCategoriesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SupabaseAPI, Category } from "@thefolk/utils/supabase";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number;

  // Actions
  getCategories: (forceRefresh?: boolean) => Promise<Category[]>;
  getCategoryBySlug: (slug: string) => Category | null;
  clearCache: () => void;

  // Helpers
  isCached: () => boolean;
}

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes (categories change less frequently)
const isCacheValid = (timestamp: number) =>
  Date.now() - timestamp < CACHE_EXPIRY;

export const useCategoriesStore = create<CategoriesState>()(
  devtools(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,
      lastFetched: 0,

      getCategories: async (forceRefresh = false) => {
        const state = get();

        // Return cached categories if available and valid
        if (
          !forceRefresh &&
          state.categories.length > 0 &&
          isCacheValid(state.lastFetched)
        ) {
          return state.categories;
        }

        // Check if already loading
        if (state.loading) {
          return new Promise((resolve) => {
            const checkLoading = () => {
              const currentState = get();
              if (!currentState.loading) {
                resolve(currentState.categories);
              } else {
                setTimeout(checkLoading, 100);
              }
            };
            checkLoading();
          });
        }

        set({ loading: true, error: null });

        try {
          const categories = await SupabaseAPI.getCategories();

          set({
            categories,
            loading: false,
            lastFetched: Date.now(),
          });

          return categories;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch categories";

          set({
            loading: false,
            error: errorMessage,
          });

          return state.categories; // Return cached categories if available
        }
      },

      getCategoryBySlug: (slug: string) => {
        const state = get();
        return (
          state.categories.find((category) => category.slug === slug) || null
        );
      },

      clearCache: () => {
        set({
          categories: [],
          lastFetched: 0,
          error: null,
        });
      },

      isCached: () => {
        const state = get();
        return state.categories.length > 0 && isCacheValid(state.lastFetched);
      },
    }),
    {
      name: "categories-store",
    }
  )
);
