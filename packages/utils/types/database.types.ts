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
      cart_items: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          product_id: string | null
          quantity: number
          session_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
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
          variant_id: string | null
          variant_options: Json | null
          variant_sku: string | null
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
          variant_id?: string | null
          variant_options?: Json | null
          variant_sku?: string | null
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
          variant_id?: string | null
          variant_options?: Json | null
          variant_sku?: string | null
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
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
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
      product_option_values: {
        Row: {
          created_at: string | null
          display_name: string
          hex_color: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          option_id: string
          position: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_name: string
          hex_color?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          option_id: string
          position?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_name?: string
          hex_color?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          option_id?: string
          position?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          name: string
          position: number | null
          product_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          name: string
          position?: number | null
          product_id: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          name?: string
          position?: number | null
          product_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          barcode: string | null
          created_at: string | null
          dimensions_cm: Json | null
          id: string
          image_url: string | null
          images_gallery: string[] | null
          is_active: boolean | null
          is_available: boolean | null
          low_stock_threshold: number | null
          metadata: Json | null
          price_adjustment: number | null
          product_id: string
          sku: string | null
          stock_quantity: number | null
          updated_at: string | null
          weight_grams: number | null
        }
        Insert: {
          barcode?: string | null
          created_at?: string | null
          dimensions_cm?: Json | null
          id?: string
          image_url?: string | null
          images_gallery?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          low_stock_threshold?: number | null
          metadata?: Json | null
          price_adjustment?: number | null
          product_id: string
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          weight_grams?: number | null
        }
        Update: {
          barcode?: string | null
          created_at?: string | null
          dimensions_cm?: Json | null
          id?: string
          image_url?: string | null
          images_gallery?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          low_stock_threshold?: number | null
          metadata?: Json | null
          price_adjustment?: number | null
          product_id?: string
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      variant_option_values: {
        Row: {
          created_at: string | null
          id: string
          option_value_id: string
          variant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_value_id: string
          variant_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_value_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_option_values_option_value_id_fkey"
            columns: ["option_value_id"]
            isOneToOne: false
            referencedRelation: "product_option_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_option_values_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_image_to_gallery: {
        Args: { product_id: string; image_url: string }
        Returns: boolean
      }
      cleanup_expired_cart_items: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      clear_cart: {
        Args: { session_id_param: string }
        Returns: number
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
      find_variant_by_options: {
        Args: { product_id_param: string; option_value_ids: string[] }
        Returns: {
          variant_id: string
          sku: string
          price: number
          stock_quantity: number
          is_available: boolean
        }[]
      }
      generate_order_external_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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
          variant_id: string
          variant_sku: string
          variant_options: Json
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
          has_variants: boolean
          variants: Json
          options: Json
        }[]
      }
      get_product_options: {
        Args: { product_id_param: string }
        Returns: {
          option_id: string
          option_name: string
          option_display_name: string
          option_type: string
          option_position: number
          is_required: boolean
          option_values: Json
        }[]
      }
      get_products: {
        Args: {
          category_slug_param?: string
          search_term?: string
          min_price?: number
          max_price?: number
          sort_by?: string
          limit_count?: number
          offset_count?: number
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
          category: string
          rating: number
          reviews_count: number
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }[]
      }
      remove_cart_item: {
        Args: {
          session_id_param: string
          product_id_param: string
          variant_id_param?: string
        }
        Returns: boolean
      }
      remove_image_from_gallery: {
        Args: { product_id: string; image_url: string }
        Returns: boolean
      }
      update_product_rating: {
        Args: { product_id_param: string }
        Returns: undefined
      }
      update_product_stock: {
        Args: { product_id_param: string }
        Returns: undefined
      }
      upsert_cart_item: {
        Args: {
          session_id_param: string
          product_id_param: string
          quantity_param: number
          variant_id_param?: string
        }
        Returns: string
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
