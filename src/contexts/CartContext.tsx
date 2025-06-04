// src/contexts/CartContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  SupabaseAPI,
  Product,
  CartItem,
  CartSummary,
  ProductFilters,
} from "@/lib/supabase";

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  getCartItemQuantity: (productId: string) => number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    total_amount: 0,
    item_count: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart data from Supabase
  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [items, summary] = await Promise.all([
        SupabaseAPI.getCartItems(),
        SupabaseAPI.getCartSummary(),
      ]);

      setCartItems(items);
      setCartSummary(summary);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    loadCartData();
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      await SupabaseAPI.addToCart(productId, quantity);
      await loadCartData(); // Refresh cart data
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      await SupabaseAPI.updateCartItemQuantity(productId, quantity);
      await loadCartData(); // Refresh cart data
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update quantity"
      );
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      await SupabaseAPI.removeFromCart(productId);
      await loadCartData(); // Refresh cart data
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      setError(
        err instanceof Error ? err.message : "Failed to remove from cart"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      await SupabaseAPI.clearCart();
      setCartItems([]);
      setCartSummary({
        total_amount: 0,
        item_count: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
      });
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError(err instanceof Error ? err.message : "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = cartItems.find((item) => item.product_id === productId);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        getCartItemQuantity,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Products hook that uses Supabase
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (params?: ProductFilters) => {
    try {
      setLoading(true);
      setError(null);

      const data = await SupabaseAPI.getProducts(params);
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (productId: string): Promise<Product | null> => {
    try {
      setError(null);
      return await SupabaseAPI.getProductById(productId);
    } catch (err) {
      console.error("Failed to load product:", err);
      setError(err instanceof Error ? err.message : "Failed to load product");
      return null;
    }
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    getProductById,
  };
};

// Categories hook
export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await SupabaseAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    loadCategories,
  };
};

// Export the Product type for use in components
export type { Product, CartItem, CartSummary };
