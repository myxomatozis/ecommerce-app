import { createClient } from "@supabase/supabase-js";
import { Database } from "types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type Product = Database["public"]["Tables"]["products"]["Row"];

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

export type Order = Database["public"]["Tables"]["orders"]["Row"];

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  reviewer_name: string | null;
  reviewer_email: string | null;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface ProductFilters {
  categorySlug?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price_asc" | "price_desc" | "rating" | "newest";
  limit?: number;
  offset?: number;
}

// Session management for cart
class SessionManager {
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  clearSession(): void {
    localStorage.removeItem("cart_session_id");
    this.sessionId = this.getOrCreateSessionId();
  }
}

const sessionManager = new SessionManager();

// API Client
export class SupabaseAPI {
  // Categories
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
    return (data as Category[]) || [];
  }

  // Products
  static async getProducts(params: ProductFilters = {}) {
    const {
      categorySlug,
      searchTerm,
      minPrice,
      maxPrice,
      sortBy = "name",
      limit = 50,
      offset = 0,
    } = params;

    const { data, error } = await supabase.rpc("get_products", {
      category_slug_param: categorySlug,
      search_term: searchTerm,
      min_price: minPrice,
      max_price: maxPrice,
      sort_by: sortBy,
      limit_count: limit,
      offset_count: offset,
    });

    if (error) throw new Error(`Failed to fetch products: ${error.message}`);
    return data || [];
  }

  static async getProductById(productId: string) {
    const { data, error } = await supabase.rpc("get_product_by_id", {
      product_id_param: productId,
    });

    if (error) throw new Error(`Failed to fetch product: ${error.message}`);
    return data?.[0] || null;
  }

  static async getProductsByCategory(categorySlug: string) {
    return this.getProducts({ categorySlug });
  }

  static async searchProducts(searchTerm: string) {
    return this.getProducts({ searchTerm });
  }

  // Cart Management
  static async addToCart(
    productId: string,
    quantity: number = 1
  ): Promise<string | null> {
    const sessionId = sessionManager.getSessionId();

    const { data, error } = await supabase.rpc("upsert_cart_item", {
      session_id_param: sessionId,
      product_id_param: productId,
      quantity_param: quantity,
    });

    if (error) throw new Error(`Failed to add to cart: ${error.message}`);
    return data;
  }

  static async updateCartItemQuantity(
    productId: string,
    quantity: number
  ): Promise<string | null> {
    const sessionId = sessionManager.getSessionId();

    const { data, error } = await supabase.rpc("upsert_cart_item", {
      session_id_param: sessionId,
      product_id_param: productId,
      quantity_param: quantity,
    });

    if (error) throw new Error(`Failed to update cart item: ${error.message}`);
    return data;
  }

  static async removeFromCart(productId: string): Promise<boolean> {
    const sessionId = sessionManager.getSessionId();

    const { data, error } = await supabase.rpc("remove_cart_item", {
      session_id_param: sessionId,
      product_id_param: productId,
    });

    if (error) throw new Error(`Failed to remove from cart: ${error.message}`);
    return data || false;
  }

  static async getCartItems(): Promise<CartItem[]> {
    const sessionId = sessionManager.getSessionId();

    const { data, error } = await supabase.rpc("get_cart_items", {
      session_id_param: sessionId,
    });

    if (error) throw new Error(`Failed to fetch cart items: ${error.message}`);
    return data || [];
  }

  static async getCartSummary(): Promise<CartSummary> {
    const sessionId = sessionManager.getSessionId();

    const { data, error } = await supabase.rpc("get_cart_summary", {
      session_id_param: sessionId,
    });

    if (error)
      throw new Error(`Failed to fetch cart summary: ${error.message}`);
    return (
      data?.[0] || {
        total_amount: 0,
        item_count: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
      }
    );
  }

  static async clearCart(): Promise<number> {
    const sessionId = sessionManager.getSessionId();

    const { data, error } = await supabase.rpc("clear_cart", {
      session_id_param: sessionId,
    });

    if (error) throw new Error(`Failed to clear cart: ${error.message}`);
    return data || 0;
  }

  // Get cart item quantity for a specific product
  static async getCartItemQuantity(productId: string): Promise<number> {
    const cartItems = await this.getCartItems();
    const item = cartItems.find((item) => item.product_id === productId);
    return item?.quantity || 0;
  }

  // Orders
  static async createOrderFromCart(orderData: {
    stripeSessionId: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    shippingAddress?: Record<string, any>;
    billingAddress?: Record<string, any>;
  }): Promise<string> {
    const sessionId = sessionManager.getSessionId();

    const { data, error } = await supabase.rpc("create_order_from_cart", {
      session_id_param: sessionId,
      stripe_session_id_param: orderData.stripeSessionId,
      customer_email_param: orderData.customerEmail,
      customer_name_param: orderData.customerName,
      customer_phone_param: orderData.customerPhone,
      shipping_address_param: orderData.shippingAddress || null,
      billing_address_param: orderData.billingAddress || null,
    });

    if (error) throw new Error(`Failed to create order: ${error.message}`);
    if (!data) throw new Error("Order creation failed");

    // Clear session after successful order
    sessionManager.clearSession();

    return data;
  }

  static async getOrderByStripeSession(
    stripeSessionId: string
  ): Promise<Order | null> {
    const { data, error } = await supabase.rpc("get_order_by_stripe_session", {
      stripe_session_id_param: stripeSessionId,
    });

    if (error) throw new Error(`Failed to fetch order: ${error.message}`);
    return (data?.[0] as Order) || null;
  }

  // Reviews
  static async getProductReviews(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch reviews: ${error.message}`);
    return (data as Review[]) || [];
  }

  static async addReview(reviewData: {
    productId: string;
    rating: number;
    title?: string;
    comment?: string;
    reviewerName?: string;
    reviewerEmail?: string;
  }): Promise<string> {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: reviewData.productId,
        rating: reviewData.rating,
        title: reviewData.title || null,
        comment: reviewData.comment || null,
        reviewer_name: reviewData.reviewerName || null,
        reviewer_email: reviewData.reviewerEmail || null,
      })
      .select("id")
      .single();

    if (error) throw new Error(`Failed to add review: ${error.message}`);
    return data.id;
  }

  static async createCheckoutSession({
    customerInfo,
  }: {
    customerInfo: {
      email: string;
      name?: string;
      phone?: string;
      shippingAddress?: Record<string, any>;
      billingAddress?: Record<string, any>;
    };
  }): Promise<{ url: string }> {
    const sessionId = sessionManager.getSessionId();
    const response = await fetch(
      `${supabaseUrl}/functions/v1/create-stripe-checkout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          customerInfo,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create checkout session: ${errorData.message}`
      );
    }
    const sessionData = response.json();
    return sessionData;
  }

  // Utility functions
  static async cleanupExpiredCartItems(): Promise<number> {
    const { data, error } = await supabase.rpc("cleanup_expired_cart_items");

    if (error) throw new Error(`Failed to cleanup cart: ${error.message}`);
    return data || 0;
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}

// Export convenience functions for direct use
export const {
  getCategories,
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartItems,
  getCartSummary,
  getCartItemQuantity,
  clearCart,
  createOrderFromCart,
  getOrderByStripeSession,
  getProductReviews,
  addReview,
  cleanupExpiredCartItems,
  healthCheck,
} = SupabaseAPI;

// Default export
export default SupabaseAPI;
