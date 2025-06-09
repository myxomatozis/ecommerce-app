// src/store/useCartStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { SupabaseAPI, CartItem, CartSummary } from "@/lib/supabase";
import { successAddToCartMessage } from "@/components/Cart/CartButton";

interface CartStore {
  // State
  cartItems: CartItem[];
  cartSummary: CartSummary;
  isCartOpen: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemQuantity: (productId: string) => number;
  setIsCartOpen: (open: boolean) => void;
  loadCartData: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

const initialCartSummary: CartSummary = {
  total_amount: 0,
  item_count: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        cartItems: [],
        cartSummary: initialCartSummary,
        isCartOpen: false,
        loading: false,
        error: null,

        // Load cart data from Supabase
        loadCartData: async () => {
          try {
            set({ loading: true, error: null });

            const [items, summary] = await Promise.all([
              SupabaseAPI.getCartItems(),
              SupabaseAPI.getCartSummary(),
            ]);

            set({
              cartItems: items,
              cartSummary: summary,
              loading: false,
            });
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Failed to load cart";
            console.error("Failed to load cart:", err);
            set({
              error: errorMessage,
              loading: false,
            });
          }
        },

        // Add item to cart
        addToCart: async (productId: string, quantity: number = 1) => {
          try {
            set({ loading: true, error: null });
            // Check if item already exists in cart, if so, update quantity with increment

            const existingItem = get().cartItems.find(
              (item) => item.product_id === productId
            );
            if (existingItem) {
              quantity += existingItem.quantity; // Increment existing quantity
            }

            await SupabaseAPI.addToCart(productId, quantity);
            await get().loadCartData(); // Refresh cart data

            successAddToCartMessage({ productName: "Item" });
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Failed to add to cart";
            console.error("Failed to add to cart:", err);
            set({ error: errorMessage, loading: false });
          }
        },

        // Update item quantity
        updateQuantity: async (productId: string, quantity: number) => {
          try {
            set({ loading: true, error: null });

            await SupabaseAPI.updateCartItemQuantity(productId, quantity);
            await get().loadCartData(); // Refresh cart data
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Failed to update quantity";
            console.error("Failed to update quantity:", err);
            set({ error: errorMessage, loading: false });
          }
        },

        // Remove item from cart
        removeFromCart: async (productId: string) => {
          try {
            set({ loading: true, error: null });

            await SupabaseAPI.removeFromCart(productId);
            await get().loadCartData(); // Refresh cart data
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Failed to remove from cart";
            console.error("Failed to remove from cart:", err);
            set({ error: errorMessage, loading: false });
          }
        },

        // Clear entire cart
        clearCart: async () => {
          try {
            set({ loading: true, error: null });

            await SupabaseAPI.clearCart();
            set({
              cartItems: [],
              cartSummary: initialCartSummary,
              loading: false,
            });
          } catch (err) {
            const errorMessage =
              err instanceof Error ? err.message : "Failed to clear cart";
            console.error("Failed to clear cart:", err);
            set({ error: errorMessage, loading: false });
          }
        },

        // Get quantity of specific item in cart
        getCartItemQuantity: (productId: string): number => {
          const { cartItems } = get();
          const item = cartItems.find((item) => item.product_id === productId);
          return item?.quantity || 0;
        },

        // Toggle cart sidebar
        setIsCartOpen: (open: boolean) => {
          set({ isCartOpen: open });
        },

        // Clear error state
        clearError: () => {
          set({ error: null });
        },

        // Set loading state
        setLoading: (loading: boolean) => {
          set({ loading });
        },
      }),
      {
        name: "cart-storage", // unique name for localStorage key
        partialize: (state) => ({
          // Only persist cart items and summary, not UI state
          cartItems: state.cartItems,
          cartSummary: state.cartSummary,
        }),
      }
    ),
    {
      name: "cart-store", // name for devtools
    }
  )
);

export type { CartItem, CartSummary };
