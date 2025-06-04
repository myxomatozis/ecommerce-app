import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  stripe_price_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  category?: string;
  rating?: number;
  reviews_count?: number;
}

export interface CartItem {
  cart_item_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_price: number;
  image_url: string | null;
  stripe_price_id: string | null;
}

export interface CartSummary {
  total_amount: number;
  item_count: number;
  shipping: number;
  tax: number;
  discount: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  getCartItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Mock products data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.",
    price: 299.99,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    stripe_price_id: "price_headphones",
    stock_quantity: 45,
    is_active: true,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category: "Electronics",
    rating: 4.8,
    reviews_count: 324,
  },
  {
    id: "2",
    name: "Minimalist Coffee Mug",
    description:
      "Handcrafted ceramic mug with a sleek design. Perfect for your morning coffee or evening tea.",
    price: 24.99,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop",
    stripe_price_id: "price_mug",
    stock_quantity: 120,
    is_active: true,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category: "Home",
    rating: 4.6,
    reviews_count: 89,
  },
  {
    id: "3",
    name: "Premium Cotton T-Shirt",
    description:
      "Soft, breathable 100% organic cotton t-shirt. Available in multiple colors and sizes.",
    price: 39.99,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    stripe_price_id: "price_tshirt",
    stock_quantity: 200,
    is_active: true,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category: "Clothing",
    rating: 4.7,
    reviews_count: 156,
  },
  {
    id: "4",
    name: "Leather Laptop Bag",
    description:
      "Genuine leather laptop bag with multiple compartments. Fits laptops up to 15 inches.",
    price: 129.99,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    stripe_price_id: "price_bag",
    stock_quantity: 67,
    is_active: true,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category: "Accessories",
    rating: 4.9,
    reviews_count: 234,
  },
  {
    id: "5",
    name: "Smart Water Bottle",
    description:
      "Temperature-maintaining smart water bottle with hydration tracking and mobile app integration.",
    price: 79.99,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
    stripe_price_id: "price_bottle",
    stock_quantity: 89,
    is_active: true,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category: "Electronics",
    rating: 4.5,
    reviews_count: 112,
  },
  {
    id: "6",
    name: "Yoga Mat Pro",
    description:
      "Non-slip premium yoga mat with alignment guides. Perfect for all yoga practices.",
    price: 89.99,
    currency: "USD",
    image_url:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
    stripe_price_id: "price_yoga",
    stock_quantity: 156,
    is_active: true,
    metadata: {},
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    category: "Fitness",
    rating: 4.8,
    reviews_count: 78,
  },
];

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
  const [mockCart, setMockCart] = useState(new Map<string, number>());

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setMockCart(new Map(cartData));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(Array.from(mockCart.entries()))
    );
  }, [mockCart]);

  const updateCartSummary = () => {
    let subtotal = 0;
    let count = 0;
    const items: CartItem[] = [];

    mockCart.forEach((quantity, productId) => {
      const product = mockProducts.find((p) => p.id === productId);
      if (product && quantity > 0) {
        const itemTotal = product.price * quantity;
        subtotal += itemTotal;
        count += quantity;
        items.push({
          cart_item_id: productId,
          product_id: productId,
          product_name: product.name,
          product_price: product.price,
          quantity,
          total_price: itemTotal,
          image_url: product.image_url,
          stripe_price_id: product.stripe_price_id,
        });
      }
    });

    // Calculate shipping (free over $100)
    const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 9.99 : 0;

    // Calculate tax (8.5%)
    const tax = subtotal * 0.085;

    const total = subtotal + shipping + tax;

    setCartSummary({
      total_amount: total,
      item_count: count,
      shipping,
      tax,
      discount: 0,
    });
    setCartItems(items);
  };

  useEffect(() => {
    updateCartSummary();
  }, [mockCart]);

  const addToCart = (productId: string, quantity: number = 1) => {
    const newCart = new Map(mockCart);
    const currentQuantity = newCart.get(productId) || 0;
    newCart.set(productId, currentQuantity + quantity);
    setMockCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const newCart = new Map(mockCart);
    if (quantity <= 0) {
      newCart.delete(productId);
    } else {
      newCart.set(productId, quantity);
    }
    setMockCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = new Map(mockCart);
    newCart.delete(productId);
    setMockCart(newCart);
  };

  const clearCart = () => {
    setMockCart(new Map());
    localStorage.removeItem("cart");
  };

  const getCartItemQuantity = (productId: string): number => {
    return mockCart.get(productId) || 0;
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export mock products for use in components
export { mockProducts };
