export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          product_id: string | null
          quantity: number
          session_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          product_name: string
          product_price: number
          quantity: number
          total_price: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name: string
          product_price: number
          quantity?: number
          total_price?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          external_id: string | null
          id: string
          metadata: Json | null
          notes: string | null
          shipping_address: Json | null
          shipping_amount: number | null
          status: string | null
          stripe_payment_intent_id: string | null
          stripe_payment_intent_secret: string | null
          stripe_session_id: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_intent_secret?: string | null
          stripe_session_id?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_intent_secret?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          images_gallery: string[] | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          price: number
          rating: number | null
          reviews_count: number | null
          stock_quantity: number | null
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          images_gallery?: string[] | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          price: number
          rating?: number | null
          reviews_count?: number | null
          stock_quantity?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          images_gallery?: string[] | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          price?: number
          rating?: number | null
          reviews_count?: number | null
          stock_quantity?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_verified: boolean | null
          product_id: string | null
          rating: number
          reviewer_email: string | null
          reviewer_name: string | null
          title: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          product_id?: string | null
          rating: number
          reviewer_email?: string | null
          reviewer_name?: string | null
          title?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified?: boolean | null
          product_id?: string | null
          rating?: number
          reviewer_email?: string | null
          reviewer_name?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_users_with_email: {
        Row: {
          created_at: string | null
          email: string | null
          email_confirmed_at: string | null
          id: string | null
          is_active: boolean | null
          last_sign_in_at: string | null
          role: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_image_to_gallery: {
        Args: { product_id: string; image_url: string }
        Returns: boolean
      }
      admin_delete_product: {
        Args: { product_id: string }
        Returns: boolean
      }
      admin_get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_products: number
          active_products: number
          inactive_products: number
          low_stock_products: number
          total_orders: number
          pending_orders: number
          total_revenue: number
          total_categories: number
          active_categories: number
        }[]
      }
      admin_get_products: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_category_id?: string
          p_is_active?: boolean
        }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          currency: string
          image_url: string
          images_gallery: string[]
          stripe_price_id: string
          stock_quantity: number
          category_id: string
          category_name: string
          rating: number
          reviews_count: number
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }[]
      }
      admin_get_recent_orders: {
        Args: { p_limit?: number }
        Returns: {
          id: string
          external_id: string
          customer_email: string
          customer_name: string
          total_amount: number
          status: string
          created_at: string
        }[]
      }
      admin_upsert_product: {
        Args: {
          product_id?: string
          product_name?: string
          product_description?: string
          product_price?: number
          product_currency?: string
          product_image_url?: string
          product_images_gallery?: string[]
          product_stripe_price_id?: string
          product_stock_quantity?: number
          product_category_id?: string
          product_is_active?: boolean
          product_metadata?: Json
        }
        Returns: string
      }
      cleanup_expired_cart_items: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_orphaned_product_images: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      clear_cart: {
        Args: { session_id_param: string }
        Returns: number
      }
      create_order: {
        Args: {
          p_user_id: string
          p_total_amount: number
          p_shipping_amount: number
          p_tax_amount: number
          p_shipping_address: Json
          p_billing_address?: Json
        }
        Returns: {
          id: string
          external_id: string
          created_at: string
        }[]
      }
      create_order_from_cart: {
        Args: {
          session_id_param: string
          stripe_session_id_param: string
          customer_email_param: string
          customer_name_param: string
          customer_phone_param?: string
          shipping_address_param?: Json
          billing_address_param?: Json
          currency_param?: string
        }
        Returns: string
      }
      generate_order_external_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_user_by_email: {
        Args: { user_email: string }
        Returns: {
          id: string
          email: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_cart_items: {
        Args: { session_id_param: string }
        Returns: {
          cart_item_id: string
          product_id: string
          product_name: string
          product_price: number
          product_currency: string
          quantity: number
          total_price: number
          image_url: string
          stripe_price_id: string
        }[]
      }
      get_cart_summary: {
        Args: { session_id_param: string }
        Returns: {
          total_amount: number
          item_count: number
          shipping: number
          tax: number
          discount: number
        }[]
      }
      get_order: {
        Args: { order_uuid: string }
        Returns: {
          id: string
          external_id: string
          user_id: string
          status: string
          total_amount: number
          shipping_amount: number
          tax_amount: number
          stripe_session_id: string
          shipping_address: Json
          billing_address: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_order_by_external_id: {
        Args: { ext_id: string }
        Returns: {
          id: string
          external_id: string
          user_id: string
          status: string
          total_amount: number
          shipping_amount: number
          tax_amount: number
          stripe_session_id: string
          shipping_address: Json
          billing_address: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_order_by_stripe_session: {
        Args: { stripe_session_id_param: string }
        Returns: {
          id: string
          external_id: string
          stripe_session_id: string
          stripe_payment_intent_id: string
          stripe_payment_intent_secret: string
          status: string
          total_amount: number
          subtotal: number
          tax_amount: number
          shipping_amount: number
          customer_email: string
          customer_name: string
          customer_phone: string
          shipping_address: Json
          billing_address: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_product_by_id: {
        Args: { product_id_param: string }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          currency: string
          image_url: string
          images_gallery: string[]
          stripe_price_id: string
          stock_quantity: number
          category: string
          rating: number
          reviews_count: number
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_product_images_count: {
        Args: { product_id: string }
        Returns: number
      }
      get_products: {
        Args:
          | {
              category_slug_param?: string
              search_term?: string
              min_price?: number
              max_price?: number
              sort_by?: string
              limit_count?: number
              offset_count?: number
            }
          | {
              p_category?: string
              p_search?: string
              p_limit?: number
              p_offset?: number
            }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          currency: string
          image_url: string
          images_gallery: string[]
          stripe_price_id: string
          stock_quantity: number
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
          category: string
          rating: number
          reviews_count: number
        }[]
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { user_email: string; admin_role?: string }
        Returns: string
      }
      remove_cart_item: {
        Args: { session_id_param: string; product_id_param: string }
        Returns: boolean
      }
      remove_image_from_gallery: {
        Args: { product_id: string; image_url: string }
        Returns: boolean
      }
      reorder_product_images: {
        Args: { product_id: string; new_order: number[] }
        Returns: Record<string, unknown>
      }
      update_product_images_gallery: {
        Args: { product_id: string; new_images_gallery: string[] }
        Returns: boolean
      }
      update_product_rating: {
        Args: { product_id_param: string }
        Returns: undefined
      }
      upsert_cart_item: {
        Args: {
          session_id_param: string
          product_id_param: string
          quantity_param: number
        }
        Returns: string
      }
      validate_product_image_urls: {
        Args: { product_id: string }
        Returns: {
          valid_urls: string[]
          invalid_urls: string[]
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
