-- ===============================================
-- Combined E-commerce Database Migration (Revised)
-- Date: 2025-06-27
-- Description: Complete e-commerce schema with auto-managed stock and integrated variants
-- ===============================================

-- ===============================================
-- UTILITY FUNCTIONS
-- ===============================================

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.set_order_external_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.external_id IS NULL THEN
        NEW.external_id := generate_order_external_id();
    END IF;
    RETURN NEW;
END;
$$;

-- ===============================================
-- SEQUENCES
-- ===============================================

CREATE SEQUENCE IF NOT EXISTS public.order_external_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999
    CACHE 1;

-- ===============================================
-- CORE TABLES
-- ===============================================

-- Categories table
CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Products table (stock_quantity will be auto-managed)
CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text,
    image_url text,
    images_gallery text[] DEFAULT '{}',
    stripe_price_id text,
    stock_quantity integer DEFAULT 0, -- Auto-calculated from variants
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    rating numeric(3,2) DEFAULT 0,
    reviews_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT check_images_gallery_limit CHECK ((array_length(images_gallery, 1) <= 10))
);

-- Product options table (defines available option types like Color, Size)
CREATE TABLE public.product_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name text NOT NULL, -- e.g., "Color", "Size", "Material"
    display_name text NOT NULL, -- e.g., "Colour", "Size", "Material"
    type text NOT NULL DEFAULT 'select', -- select, swatch, button
    position integer DEFAULT 0,
    is_required boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT product_options_type_check CHECK (type = ANY (ARRAY['select'::text, 'swatch'::text, 'button'::text]))
);

-- Product option values table (defines specific values like "Red", "Large")
CREATE TABLE public.product_option_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    option_id uuid NOT NULL REFERENCES public.product_options(id) ON DELETE CASCADE,
    value text NOT NULL, -- e.g., "Red", "Large", "Cotton"
    display_name text NOT NULL, -- e.g., "Red", "Large", "100% Cotton"
    hex_color text, -- For color swatches
    image_url text, -- For pattern/texture swatches
    position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Product variants table (specific combinations like "Red + Large")
CREATE TABLE public.product_variants (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku text UNIQUE,
    barcode text,
    price_adjustment numeric(10,2) DEFAULT 0, -- +/- from base product price
    stock_quantity integer DEFAULT 0,
    low_stock_threshold integer DEFAULT 5,
    is_active boolean DEFAULT true,
    is_available boolean DEFAULT true,
    image_url text, -- Primary variant image
    images_gallery text[] DEFAULT '{}', -- Additional variant images
    weight_grams integer,
    dimensions_cm jsonb, -- {width: 10, height: 20, depth: 5}
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT check_variant_images_gallery_limit CHECK ((array_length(images_gallery, 1) <= 10))
);

-- Variant option values junction table (links variants to their option combinations)
CREATE TABLE public.variant_option_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    variant_id uuid NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    option_value_id uuid NOT NULL REFERENCES public.product_option_values(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    
    UNIQUE(variant_id, option_value_id)
);

-- Cart items table (with variant support)
CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    session_id text NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    
    CONSTRAINT cart_items_session_product_variant_key UNIQUE (session_id, product_id, variant_id)
);

-- Orders table
CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    external_id character varying(20) UNIQUE,
    stripe_session_id text UNIQUE,
    stripe_payment_intent_id text,
    stripe_payment_intent_secret text,
    status text DEFAULT 'pending',
    total_amount numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    shipping_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    currency text DEFAULT 'USD',
    customer_email text,
    customer_name text,
    customer_phone text,
    shipping_address jsonb,
    billing_address jsonb,
    notes text,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text, 'refunded'::text])))
);

-- Order items table (with variant support)
CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name text NOT NULL,
    product_price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price numeric(10,2) GENERATED ALWAYS AS (((quantity)::numeric * product_price)) STORED,
    variant_sku text,
    variant_options jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Reviews table
CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    rating integer NOT NULL,
    title text,
    comment text,
    reviewer_name text,
    reviewer_email text,
    is_verified boolean DEFAULT false,
    is_approved boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);

-- ===============================================
-- INDEXES
-- ===============================================

-- Products indexes
CREATE INDEX idx_products_active ON public.products USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_products_category ON public.products USING btree (category_id);
CREATE INDEX idx_products_price ON public.products USING btree (price);
CREATE INDEX idx_products_rating ON public.products USING btree (rating DESC);
CREATE INDEX idx_products_images_gallery ON public.products USING gin (images_gallery);

-- Categories indexes
CREATE INDEX idx_categories_active ON public.categories USING btree (is_active) WHERE (is_active = true);

-- Product options indexes
CREATE INDEX idx_product_options_product ON public.product_options USING btree (product_id);
CREATE INDEX idx_product_options_active ON public.product_options USING btree (is_active) WHERE (is_active = true);

-- Product option values indexes  
CREATE INDEX idx_product_option_values_option ON public.product_option_values USING btree (option_id);
CREATE INDEX idx_product_option_values_active ON public.product_option_values USING btree (is_active) WHERE (is_active = true);

-- Product variants indexes
CREATE INDEX idx_product_variants_product ON public.product_variants USING btree (product_id);
CREATE INDEX idx_product_variants_active ON public.product_variants USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_product_variants_available ON public.product_variants USING btree (is_available) WHERE (is_available = true);
CREATE INDEX idx_product_variants_sku ON public.product_variants USING btree (sku);
CREATE INDEX idx_product_variants_stock ON public.product_variants USING btree (stock_quantity);

-- Variant option values indexes
CREATE INDEX idx_variant_option_values_variant ON public.variant_option_values USING btree (variant_id);
CREATE INDEX idx_variant_option_values_option_value ON public.variant_option_values USING btree (option_value_id);

-- Cart items indexes
CREATE INDEX idx_cart_session ON public.cart_items USING btree (session_id);
CREATE INDEX idx_cart_expires ON public.cart_items USING btree (expires_at);
CREATE INDEX idx_cart_items_variant ON public.cart_items USING btree (variant_id);

-- Orders indexes
CREATE INDEX idx_orders_status ON public.orders USING btree (status);
CREATE INDEX idx_orders_email ON public.orders USING btree (customer_email);
CREATE INDEX idx_orders_external_id ON public.orders USING btree (external_id);
CREATE INDEX idx_orders_stripe_session ON public.orders USING btree (stripe_session_id);

-- Order items indexes
CREATE INDEX idx_order_items_variant ON public.order_items USING btree (variant_id);

-- Reviews indexes
CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id);
CREATE INDEX idx_reviews_approved ON public.reviews USING btree (is_approved) WHERE (is_approved = true);

-- ===============================================
-- STOCK MANAGEMENT FUNCTIONS
-- ===============================================

-- Function to update product stock from variants
CREATE FUNCTION public.update_product_stock(product_id_param uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  total_stock INTEGER;
BEGIN
  -- Calculate total stock from all active variants
  SELECT COALESCE(SUM(stock_quantity), 0)
  INTO total_stock
  FROM product_variants
  WHERE product_id = product_id_param 
    AND is_active = true 
    AND is_available = true;

  -- Update the product's stock_quantity
  UPDATE products
  SET 
    stock_quantity = total_stock,
    updated_at = NOW()
  WHERE id = product_id_param;
END;
$$;

-- Trigger function to update product stock when variants change
CREATE FUNCTION public.trigger_update_product_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_product_stock(NEW.product_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_product_stock(OLD.product_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- ===============================================
-- TRIGGERS
-- ===============================================

-- Updated at triggers
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_options_updated_at 
    BEFORE UPDATE ON public.product_options 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_option_values_updated_at 
    BEFORE UPDATE ON public.product_option_values 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at 
    BEFORE UPDATE ON public.product_variants 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Order external ID trigger
CREATE TRIGGER trigger_set_order_external_id 
    BEFORE INSERT ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION public.set_order_external_id();

-- Stock management triggers
CREATE TRIGGER trigger_update_product_stock_on_variant_change
    AFTER INSERT OR UPDATE OR DELETE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_product_stock();

-- ===============================================
-- CORE FUNCTIONS
-- ===============================================

CREATE FUNCTION public.generate_order_external_id() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    next_id INTEGER;
    external_id VARCHAR(20);
BEGIN
    next_id := nextval('order_external_id_seq');
    external_id := 'ORD-' || LPAD(next_id::TEXT, 6, '0');
    RETURN external_id;
END;
$$;

-- Rating update function and trigger
CREATE FUNCTION public.update_product_rating(product_id_param uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  avg_rating DECIMAL;
  review_count INTEGER;
BEGIN
  SELECT AVG(rating), COUNT(*)
  INTO avg_rating, review_count
  FROM reviews
  WHERE product_id = product_id_param AND is_approved = true;

  UPDATE products
  SET 
    rating = COALESCE(avg_rating, 0),
    reviews_count = review_count
  WHERE id = product_id_param;
END;
$$;

CREATE FUNCTION public.trigger_update_product_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_product_rating(NEW.product_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_product_rating(OLD.product_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_product_rating_trigger 
    AFTER INSERT OR DELETE OR UPDATE ON public.reviews 
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_product_rating();

-- ===============================================
-- CART FUNCTIONS (Enhanced with Variant Support)
-- ===============================================

-- Enhanced cart item upsert with variant support (backward compatible)
CREATE OR REPLACE FUNCTION public.upsert_cart_item(
    session_id_param text, 
    product_id_param uuid, 
    quantity_param integer,
    variant_id_param uuid DEFAULT NULL
) 
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    cart_item_id UUID;
BEGIN
    -- Remove item if quantity is 0 or negative
    IF quantity_param <= 0 THEN
        DELETE FROM cart_items 
        WHERE session_id = session_id_param 
            AND product_id = product_id_param 
            AND (variant_id = variant_id_param OR (variant_id IS NULL AND variant_id_param IS NULL));
        RETURN NULL;
    END IF;

    INSERT INTO cart_items (session_id, product_id, variant_id, quantity)
    VALUES (session_id_param, product_id_param, variant_id_param, quantity_param)
    ON CONFLICT (session_id, product_id, variant_id)
    DO UPDATE SET 
        quantity = EXCLUDED.quantity,
        expires_at = NOW() + INTERVAL '7 days'
    RETURNING id INTO cart_item_id;
    
    RETURN cart_item_id;
END;
$$;

-- Enhanced get cart items function (backward compatible return structure)
CREATE OR REPLACE FUNCTION public.get_cart_items(session_id_param text)
RETURNS TABLE(
    cart_item_id uuid,
    product_id uuid,
    product_name text,
    product_price numeric,
    product_currency text,
    quantity integer,
    total_price numeric,
    image_url text,
    stripe_price_id text,
    -- New fields for variant support (extended)
    variant_id uuid,
    variant_sku text,
    variant_options jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH variant_options AS (
        SELECT 
            pv.id as variant_id,
            jsonb_agg(
                jsonb_build_object(
                    'option_name', po.display_name,
                    'value', pov.display_name,
                    'hex_color', pov.hex_color
                ) ORDER BY po.position, pov.position
            ) as options
        FROM product_variants pv
        JOIN variant_option_values vov ON pv.id = vov.variant_id
        JOIN product_option_values pov ON vov.option_value_id = pov.id
        JOIN product_options po ON pov.option_id = po.id
        GROUP BY pv.id
    )
    SELECT 
        ci.id,
        p.id,
        p.name,
        (p.price + COALESCE(pv.price_adjustment, 0)),
        p.currency,
        ci.quantity,
        ((p.price + COALESCE(pv.price_adjustment, 0)) * ci.quantity)::DECIMAL,
        COALESCE(pv.image_url, p.image_url),
        p.stripe_price_id,
        pv.id,
        pv.sku,
        COALESCE(vo.options, '[]'::jsonb)
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN product_variants pv ON ci.variant_id = pv.id
    LEFT JOIN variant_options vo ON pv.id = vo.variant_id
    WHERE ci.session_id = session_id_param 
        AND ci.expires_at > NOW()
        AND p.is_active = true
        AND (pv.id IS NULL OR pv.is_active = true)
    ORDER BY ci.created_at;
END;
$$;

-- Enhanced cart summary (backward compatible)
CREATE FUNCTION public.get_cart_summary(session_id_param text) 
RETURNS TABLE(
    total_amount numeric, 
    item_count integer, 
    shipping numeric, 
    tax numeric, 
    discount numeric
)
LANGUAGE plpgsql
AS $$
DECLARE
  subtotal DECIMAL;
  shipping_cost DECIMAL;
  tax_amount DECIMAL;
BEGIN
  -- Calculate subtotal with variant pricing
  SELECT COALESCE(SUM((p.price + COALESCE(pv.price_adjustment, 0)) * ci.quantity), 0)
  INTO subtotal
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
  LEFT JOIN product_variants pv ON ci.variant_id = pv.id
  WHERE ci.session_id = session_id_param 
    AND ci.expires_at > NOW()
    AND p.is_active = true
    AND (pv.id IS NULL OR pv.is_active = true);

  -- Calculate shipping (free over $100)
  shipping_cost := CASE 
    WHEN subtotal >= 100 THEN 0 
    WHEN subtotal > 0 THEN 9.99 
    ELSE 0 
  END;

  -- Calculate tax (8.5%)
  tax_amount := subtotal * 0.085;

  RETURN QUERY
  SELECT 
    (subtotal + shipping_cost + tax_amount)::DECIMAL as total_amount,
    COALESCE((SELECT SUM(ci.quantity) FROM cart_items ci WHERE ci.session_id = session_id_param AND ci.expires_at > NOW()), 0)::INTEGER as item_count,
    shipping_cost as shipping,
    tax_amount as tax,
    0::DECIMAL as discount;
END;
$$;

-- Other cart utility functions (simplified)
CREATE FUNCTION public.remove_cart_item(session_id_param text, product_id_param uuid, variant_id_param uuid DEFAULT NULL) 
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items 
  WHERE session_id = session_id_param 
    AND product_id = product_id_param
    AND (variant_id = variant_id_param OR (variant_id IS NULL AND variant_id_param IS NULL));
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;

CREATE FUNCTION public.clear_cart(session_id_param text) 
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items WHERE session_id = session_id_param;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

CREATE FUNCTION public.cleanup_expired_cart_items() 
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ===============================================
-- PRODUCT FUNCTIONS (Enhanced with Integrated Variants)
-- ===============================================

-- Enhanced product retrieval (backward compatible)
CREATE FUNCTION public.get_products(
    category_slug_param text DEFAULT NULL,
    search_term text DEFAULT NULL,
    min_price numeric DEFAULT NULL,
    max_price numeric DEFAULT NULL,
    sort_by text DEFAULT 'name',
    limit_count integer DEFAULT 50,
    offset_count integer DEFAULT 0
) 
RETURNS TABLE(
    id uuid,
    name text,
    description text,
    price numeric,
    currency text,
    image_url text,
    images_gallery text[],
    stripe_price_id text,
    stock_quantity integer,
    category text,
    rating numeric,
    reviews_count integer,
    is_active boolean,
    metadata jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.currency,
    p.image_url,
    p.images_gallery,
    p.stripe_price_id,
    p.stock_quantity,
    c.name as category,
    p.rating,
    p.reviews_count,
    p.is_active,
    p.metadata,
    p.created_at,
    p.updated_at
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE 
    p.is_active = true
    AND (category_slug_param IS NULL OR c.slug = category_slug_param)
    AND (search_term IS NULL OR (
      p.name ILIKE '%' || search_term || '%' OR 
      p.description ILIKE '%' || search_term || '%'
    ))
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
  ORDER BY
    CASE WHEN sort_by = 'name' THEN p.name END ASC,
    CASE WHEN sort_by = 'price_asc' THEN p.price END ASC,
    CASE WHEN sort_by = 'price_desc' THEN p.price END DESC,
    CASE WHEN sort_by = 'rating' THEN p.rating END DESC,
    CASE WHEN sort_by = 'newest' THEN p.created_at END DESC,
    p.name ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Enhanced product by ID with integrated variants (replaces get_product_with_variants)
CREATE FUNCTION public.get_product_by_id(product_id_param uuid) 
RETURNS TABLE(
    -- Product info
    id uuid,
    name text,
    description text,
    price numeric,
    currency text,
    image_url text,
    images_gallery text[],
    stripe_price_id text,
    stock_quantity integer,
    category text,
    rating numeric,
    reviews_count integer,
    is_active boolean,
    metadata jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    -- Variant info (integrated)
    has_variants boolean,
    variants jsonb,
    options jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH product_variants AS (
    SELECT 
      p.id as product_id,
      jsonb_agg(
        jsonb_build_object(
          'variant_id', pv.id,
          'sku', pv.sku,
          'price', (p.price + COALESCE(pv.price_adjustment, 0)),
          'stock_quantity', pv.stock_quantity,
          'is_available', pv.is_available,
          'image_url', pv.image_url,
          'images_gallery', pv.images_gallery,
          'options', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'option_name', po.name,
                'option_display_name', po.display_name,
                'option_type', po.type,
                'value', pov.value,
                'display_name', pov.display_name,
                'hex_color', pov.hex_color,
                'image_url', pov.image_url
              ) ORDER BY po.position, pov.position
            )
            FROM variant_option_values vov
            JOIN product_option_values pov ON vov.option_value_id = pov.id
            JOIN product_options po ON pov.option_id = po.id
            WHERE vov.variant_id = pv.id
          )
        ) ORDER BY pv.created_at
      ) FILTER (WHERE pv.id IS NOT NULL) as variants
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
    WHERE p.id = product_id_param
    GROUP BY p.id
  ),
  product_options AS (
    SELECT 
      p.id as product_id,
      jsonb_agg(
        jsonb_build_object(
          'option_id', po.id,
          'option_name', po.name,
          'option_display_name', po.display_name,
          'option_type', po.type,
          'option_position', po.position,
          'is_required', po.is_required,
          'option_values', (
            SELECT jsonb_agg(
              jsonb_build_object(
                'id', pov.id,
                'value', pov.value,
                'display_name', pov.display_name,
                'hex_color', pov.hex_color,
                'image_url', pov.image_url,
                'position', pov.position
              ) ORDER BY pov.position
            )
            FROM product_option_values pov 
            WHERE pov.option_id = po.id AND pov.is_active = true
          )
        ) ORDER BY po.position
      ) FILTER (WHERE po.id IS NOT NULL) as options
    FROM products p
    LEFT JOIN product_options po ON p.id = po.product_id AND po.is_active = true
    WHERE p.id = product_id_param
    GROUP BY p.id
  )
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.currency,
    p.image_url,
    p.images_gallery,
    p.stripe_price_id,
    p.stock_quantity,
    c.name as category,
    p.rating,
    p.reviews_count,
    p.is_active,
    p.metadata,
    p.created_at,
    p.updated_at,
    (pv.variants IS NOT NULL AND jsonb_array_length(pv.variants) > 0) as has_variants,
    COALESCE(pv.variants, '[]'::jsonb) as variants,
    COALESCE(po.options, '[]'::jsonb) as options
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN product_variants pv ON p.id = pv.product_id
  LEFT JOIN product_options po ON p.id = po.product_id
  WHERE p.id = product_id_param AND p.is_active = true;
END;
$$;

-- ===============================================
-- VARIANT-SPECIFIC FUNCTIONS (Simplified)
-- ===============================================

-- Get available options for a product
CREATE FUNCTION public.get_product_options(product_id_param uuid)
RETURNS TABLE(
    option_id uuid,
    option_name text,
    option_display_name text,
    option_type text,
    option_position integer,
    is_required boolean,
    option_values jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        po.id,
        po.name,
        po.display_name,
        po.type,
        po.position,
        po.is_required,
        jsonb_agg(
            jsonb_build_object(
                'id', pov.id,
                'value', pov.value,
                'display_name', pov.display_name,
                'hex_color', pov.hex_color,
                'image_url', pov.image_url,
                'position', pov.position
            ) ORDER BY pov.position
        ) as option_values
    FROM product_options po
    JOIN product_option_values pov ON po.id = pov.option_id AND pov.is_active = true
    WHERE po.product_id = product_id_param AND po.is_active = true
    GROUP BY po.id, po.name, po.display_name, po.type, po.position, po.is_required
    ORDER BY po.position;
END;
$$;

-- Find variant by option combination
CREATE FUNCTION public.find_variant_by_options(
    product_id_param uuid,
    option_value_ids uuid[]
)
RETURNS TABLE(
    variant_id uuid,
    sku text,
    price numeric,
    stock_quantity integer,
    is_available boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pv.id,
        pv.sku,
        (p.price + COALESCE(pv.price_adjustment, 0)),
        pv.stock_quantity,
        pv.is_available
    FROM product_variants pv
    JOIN products p ON pv.product_id = p.id
    WHERE pv.product_id = product_id_param 
        AND pv.is_active = true
        AND (
            SELECT array_agg(vov.option_value_id ORDER BY vov.option_value_id)
            FROM variant_option_values vov 
            WHERE vov.variant_id = pv.id
        ) = (
            SELECT array_agg(unnest ORDER BY unnest) 
            FROM unnest(option_value_ids)
        );
END;
$$;

-- ===============================================
-- ORDER FUNCTIONS (Enhanced with Variant Support)
-- ===============================================

-- Enhanced order creation from cart with variant support
CREATE FUNCTION public.create_order_from_cart(
  session_id_param text, 
  stripe_session_id_param text, 
  customer_email_param text, 
  customer_name_param text, 
  customer_phone_param text DEFAULT NULL, 
  shipping_address_param jsonb DEFAULT NULL, 
  billing_address_param jsonb DEFAULT NULL,
  currency_param text DEFAULT 'USD'
) 
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  order_id UUID;
  cart_summary RECORD;
  cart_item RECORD;
BEGIN
  -- Get cart summary
  SELECT * INTO cart_summary FROM get_cart_summary(session_id_param);
  
  -- Create order
  INSERT INTO orders (
    stripe_session_id,
    total_amount,
    subtotal,
    tax_amount,
    shipping_amount,
    customer_email,
    customer_name,
    customer_phone,
    shipping_address,
    billing_address,
    currency
  ) VALUES (
    stripe_session_id_param,
    cart_summary.total_amount,
    cart_summary.total_amount - cart_summary.tax - cart_summary.shipping,
    cart_summary.tax,
    cart_summary.shipping,
    customer_email_param,
    customer_name_param,
    customer_phone_param,
    shipping_address_param,
    billing_address_param,
    currency_param
  ) RETURNING id INTO order_id;

  -- Create order items from cart with variant support
  FOR cart_item IN SELECT * FROM get_cart_items(session_id_param) LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      product_price,
      quantity,
      variant_sku,
      variant_options
    ) VALUES (
      order_id,
      cart_item.product_id,
      cart_item.variant_id,
      cart_item.product_name,
      cart_item.product_price,
      cart_item.quantity,
      cart_item.variant_sku,
      cart_item.variant_options
    );
  END LOOP;

  -- Clear cart after order creation
  PERFORM clear_cart(session_id_param);

  RETURN order_id;
END;
$$;

-- Get order by various identifiers (backward compatible)
CREATE FUNCTION public.get_order_by_stripe_session(stripe_session_id_param text) 
RETURNS TABLE(
    id uuid, 
    external_id character varying, 
    stripe_session_id text, 
    stripe_payment_intent_id text, 
    stripe_payment_intent_secret text, 
    status text, 
    total_amount numeric, 
    subtotal numeric, 
    tax_amount numeric, 
    shipping_amount numeric, 
    customer_email text, 
    customer_name text, 
    customer_phone text, 
    shipping_address jsonb, 
    billing_address jsonb, 
    created_at timestamp with time zone, 
    updated_at timestamp with time zone
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.external_id,
    o.stripe_session_id,
    o.stripe_payment_intent_id,
    o.stripe_payment_intent_secret,
    o.status,
    o.total_amount,
    o.subtotal,
    o.tax_amount,
    o.shipping_amount,
    o.customer_email,
    o.customer_name,
    o.customer_phone,
    o.shipping_address,
    o.billing_address,
    o.created_at,
    o.updated_at
  FROM orders o
  WHERE o.stripe_session_id = stripe_session_id_param;
END;
$$;

-- ===============================================
-- IMAGE MANAGEMENT FUNCTIONS
-- ===============================================

-- Product image gallery management functions
CREATE FUNCTION public.add_image_to_gallery(product_id uuid, image_url text) 
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  current_gallery TEXT[];
BEGIN
  SELECT images_gallery INTO current_gallery FROM products WHERE id = product_id;
  
  IF current_gallery IS NULL THEN
    current_gallery := ARRAY[]::TEXT[];
  END IF;
  
  IF array_length(current_gallery, 1) >= 10 THEN
    RAISE EXCEPTION 'Images gallery cannot exceed 10 images';
  END IF;
  
  current_gallery := array_append(current_gallery, image_url);
  
  UPDATE products 
  SET images_gallery = current_gallery, updated_at = NOW()
  WHERE id = product_id;
  
  RETURN FOUND;
END;
$$;

CREATE FUNCTION public.remove_image_from_gallery(product_id uuid, image_url text) 
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  current_gallery TEXT[];
BEGIN
  SELECT images_gallery INTO current_gallery FROM products WHERE id = product_id;
  current_gallery := array_remove(current_gallery, image_url);
  
  UPDATE products 
  SET images_gallery = current_gallery, updated_at = NOW()
  WHERE id = product_id;
  
  RETURN FOUND;
END;
$$;

-- ===============================================
-- ROW LEVEL SECURITY
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Public can read active categories" ON public.categories 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active products" ON public.products 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read product options" ON public.product_options 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read product option values" ON public.product_option_values 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read product variants" ON public.product_variants 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read variant option values" ON public.variant_option_values 
    FOR SELECT USING (true);

CREATE POLICY "Public can manage cart items by session" ON public.cart_items 
    USING (true);

CREATE POLICY "Public can read orders by stripe session" ON public.orders 
    FOR SELECT USING (true);

CREATE POLICY "Public can create orders" ON public.orders 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read order items" ON public.order_items 
    FOR SELECT USING (true);

CREATE POLICY "Public can create order items" ON public.order_items 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read approved reviews" ON public.reviews 
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Public can create reviews" ON public.reviews 
    FOR INSERT WITH CHECK (true);

-- ===============================================
-- COMMENTS
-- ===============================================

COMMENT ON TABLE public.products IS 'Core products table with auto-managed stock from variants';
COMMENT ON TABLE public.product_options IS 'Defines available option types for products (Color, Size, etc.)';
COMMENT ON TABLE public.product_option_values IS 'Defines specific values for each option type (Red, Large, etc.)';
COMMENT ON TABLE public.product_variants IS 'Specific product variants with unique combinations of options';
COMMENT ON TABLE public.variant_option_values IS 'Junction table linking variants to their option combinations';

COMMENT ON COLUMN public.products.stock_quantity IS 'Auto-calculated total stock from all active variants';
COMMENT ON COLUMN public.products.images_gallery IS 'Array of image URLs for product gallery. Images stored in Supabase Storage.';
COMMENT ON COLUMN public.product_options.type IS 'UI display type: select dropdown, color swatch, or button selection';
COMMENT ON COLUMN public.product_option_values.hex_color IS 'Hex color code for color swatches (#FF0000)';
COMMENT ON COLUMN public.product_option_values.image_url IS 'Image URL for pattern/texture swatches';
COMMENT ON COLUMN public.product_variants.price_adjustment IS 'Price difference from base product price (can be negative)';
COMMENT ON COLUMN public.product_variants.dimensions_cm IS 'Product dimensions in JSON format for shipping calculations';

-- End of revised migration