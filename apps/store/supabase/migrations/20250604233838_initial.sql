--
-- This SQL script contains the schema for an e-commerce application, including tables, functions, and triggers.
--

--
-- Name: set_order_external_id(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text NOT NULL,
    product_id uuid,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval)
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: order_external_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE IF NOT EXISTS public.order_external_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999
    CACHE 1;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    product_id uuid,
    product_name text NOT NULL,
    product_price numeric(10,2) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price numeric(10,2) GENERATED ALWAYS AS (((quantity)::numeric * product_price)) STORED,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stripe_session_id text,
    stripe_payment_intent_id text,
    stripe_payment_intent_secret text,
    status text DEFAULT 'pending'::text,
    total_amount numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    shipping_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    currency text DEFAULT 'USD'::text,
    customer_email text,
    customer_name text,
    customer_phone text,
    shipping_address jsonb,
    billing_address jsonb,
    notes text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    external_id character varying(20),
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text, 'refunded'::text])))
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text,
    image_url text,
    stripe_price_id text,
    stock_quantity integer DEFAULT 0,
    category_id uuid,
    rating numeric(3,2) DEFAULT 0,
    reviews_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    images_gallery text[] DEFAULT '{}'::text[],
    CONSTRAINT check_images_gallery_limit CHECK ((array_length(images_gallery, 1) <= 10))
);


--
-- Name: COLUMN products.images_gallery; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.images_gallery IS 'Array of image URLs for product gallery. Images stored in Supabase Storage.';


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid,
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


--
-- Name: trigger_update_product_rating(); Type: FUNCTION; Schema: public; Owner: -
--

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

--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_session_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_session_id_product_id_key UNIQUE (session_id, product_id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_external_id_key UNIQUE (external_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: orders orders_stripe_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_stripe_session_id_key UNIQUE (stripe_session_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: idx_cart_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_expires ON public.cart_items USING btree (expires_at);


--
-- Name: idx_cart_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cart_session ON public.cart_items USING btree (session_id);


--
-- Name: idx_categories_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_active ON public.categories USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_orders_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_email ON public.orders USING btree (customer_email);


--
-- Name: idx_orders_external_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_external_id ON public.orders USING btree (external_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_orders_stripe_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_stripe_session ON public.orders USING btree (stripe_session_id);


--
-- Name: idx_products_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_active ON public.products USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: idx_products_images_gallery; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_images_gallery ON public.products USING gin (images_gallery);


--
-- Name: idx_products_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_price ON public.products USING btree (price);


--
-- Name: idx_products_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_rating ON public.products USING btree (rating DESC);


--
-- Name: idx_reviews_approved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_approved ON public.reviews USING btree (is_approved) WHERE (is_approved = true);


--
-- Name: idx_reviews_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id);


--
-- Name: orders trigger_set_order_external_id; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_order_external_id BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_order_external_id();


--
-- Name: categories update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reviews update_product_rating_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_product_rating_trigger AFTER INSERT OR DELETE OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.trigger_update_product_rating();


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: order_items Public can create order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (true);


--
-- Name: orders Public can create orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);


--
-- Name: reviews Public can create reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);


--
-- Name: cart_items Public can manage cart items by session; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can manage cart items by session" ON public.cart_items USING (true);


--
-- Name: categories Public can read active categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read active categories" ON public.categories FOR SELECT USING ((is_active = true));


--
-- Name: products Public can read active products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read active products" ON public.products FOR SELECT USING ((is_active = true));


--
-- Name: reviews Public can read approved reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read approved reviews" ON public.reviews FOR SELECT USING ((is_approved = true));


--
-- Name: order_items Public can read order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read order items" ON public.order_items FOR SELECT USING (true);


--
-- Name: orders Public can read orders by stripe session; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can read orders by stripe session" ON public.orders FOR SELECT USING (true);


--
-- Name: cart_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: add_image_to_gallery(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_image_to_gallery(product_id uuid, image_url text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  current_gallery TEXT[];
BEGIN
  -- Get current gallery
  SELECT images_gallery INTO current_gallery
  FROM products 
  WHERE id = product_id;
  
  -- Check if gallery exists and doesn't exceed limit
  IF current_gallery IS NULL THEN
    current_gallery := ARRAY[]::TEXT[];
  END IF;
  
  IF array_length(current_gallery, 1) >= 10 THEN
    RAISE EXCEPTION 'Images gallery cannot exceed 10 images';
  END IF;
  
  -- Add new image to gallery
  current_gallery := array_append(current_gallery, image_url);
  
  -- Update the product
  UPDATE products 
  SET 
    images_gallery = current_gallery,
    updated_at = NOW()
  WHERE id = product_id;
  
  RETURN FOUND;
END;
$$;


--
-- Name: cleanup_expired_cart_items(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_cart_items() RETURNS integer
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


--
-- Name: cleanup_orphaned_product_images(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_orphaned_product_images() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  cleanup_count INT := 0;
  storage_obj RECORD;
  is_referenced BOOLEAN;
BEGIN
  -- Loop through all objects in product-images bucket
  FOR storage_obj IN 
    SELECT name FROM storage.objects 
    WHERE bucket_id = 'product-images'
  LOOP
    -- Check if this image is referenced in any product
    SELECT EXISTS(
      SELECT 1 FROM products 
      WHERE image_url LIKE '%' || storage_obj.name || '%'
      OR storage_obj.name = ANY(
        SELECT unnest(images_gallery) 
        FROM products 
        WHERE images_gallery IS NOT NULL
      )
    ) INTO is_referenced;
    
    -- If not referenced, delete it
    IF NOT is_referenced THEN
      DELETE FROM storage.objects 
      WHERE bucket_id = 'product-images' AND name = storage_obj.name;
      cleanup_count := cleanup_count + 1;
    END IF;
  END LOOP;
  
  RETURN cleanup_count;
END;
$$;


--
-- Name: clear_cart(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.clear_cart(session_id_param text) RETURNS integer
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


--
-- Name: create_order(uuid, numeric, numeric, numeric, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_order(p_user_id uuid, p_total_amount numeric, p_shipping_amount numeric, p_tax_amount numeric, p_shipping_address jsonb, p_billing_address jsonb DEFAULT NULL::jsonb) RETURNS TABLE(id uuid, external_id character varying, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_order orders%ROWTYPE;
BEGIN
    INSERT INTO orders (
        user_id,
        status,
        total_amount,
        shipping_amount,
        tax_amount,
        shipping_address,
        billing_address
    ) VALUES (
        p_user_id,
        'pending',
        p_total_amount,
        p_shipping_amount,
        p_tax_amount,
        p_shipping_address,
        COALESCE(p_billing_address, p_shipping_address)
    )
    RETURNING * INTO new_order;
    
    RETURN QUERY
    SELECT new_order.id, new_order.external_id, new_order.created_at;
END;
$$;


--
-- Name: create_order_from_cart(text, text, text, text, text, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_order_from_cart(session_id_param text, stripe_session_id_param text, customer_email_param text, customer_name_param text, customer_phone_param text DEFAULT NULL::text, shipping_address_param jsonb DEFAULT NULL::jsonb, billing_address_param jsonb DEFAULT NULL::jsonb) RETURNS uuid
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
    billing_address
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
    billing_address_param
  ) RETURNING id INTO order_id;

  -- Create order items from cart
  FOR cart_item IN SELECT * FROM get_cart_items(session_id_param) LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      product_price,
      quantity
    ) VALUES (
      order_id,
      cart_item.product_id,
      cart_item.product_name,
      cart_item.product_price,
      cart_item.quantity
    );
  END LOOP;

  -- Clear cart after order creation
  PERFORM clear_cart(session_id_param);

  RETURN order_id;
END;
$$;


--
-- Name: generate_order_external_id(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: get_cart_items(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_cart_items(session_id_param text) RETURNS TABLE(cart_item_id uuid, product_id uuid, product_name text, product_price numeric, product_currency text, quantity integer, total_price numeric, image_url text, stripe_price_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    p.id,
    p.name,
    p.price,
    p.currency,
    ci.quantity,
    (p.price * ci.quantity)::DECIMAL,
    p.image_url,
    p.stripe_price_id
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
  WHERE ci.session_id = session_id_param 
    AND ci.expires_at > NOW()
    AND p.is_active = true
  ORDER BY ci.created_at;
END;
$$;


--
-- Name: get_cart_summary(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_cart_summary(session_id_param text) RETURNS TABLE(total_amount numeric, item_count integer, shipping numeric, tax numeric, discount numeric)
    LANGUAGE plpgsql
    AS $_$
DECLARE
  subtotal DECIMAL;
  shipping_cost DECIMAL;
  tax_amount DECIMAL;
BEGIN
  -- Calculate subtotal
  SELECT COALESCE(SUM(p.price * ci.quantity), 0)
  INTO subtotal
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
  WHERE ci.session_id = session_id_param 
    AND ci.expires_at > NOW()
    AND p.is_active = true;

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
$_$;


--
-- Name: get_order(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_order(order_uuid uuid) RETURNS TABLE(id uuid, external_id character varying, user_id uuid, status character varying, total_amount numeric, shipping_amount numeric, tax_amount numeric, stripe_session_id character varying, shipping_address jsonb, billing_address jsonb, created_at timestamp with time zone, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.external_id,
        o.user_id,
        o.status,
        o.total_amount,
        o.shipping_amount,
        o.tax_amount,
        o.stripe_session_id,
        o.shipping_address,
        o.billing_address,
        o.created_at,
        o.updated_at
    FROM orders o
    WHERE o.id = order_uuid;
END;
$$;


--
-- Name: get_order_by_external_id(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_order_by_external_id(ext_id character varying) RETURNS TABLE(id uuid, external_id character varying, user_id uuid, status character varying, total_amount numeric, shipping_amount numeric, tax_amount numeric, stripe_session_id character varying, shipping_address jsonb, billing_address jsonb, created_at timestamp with time zone, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.external_id,
        o.user_id,
        o.status,
        o.total_amount,
        o.shipping_amount,
        o.tax_amount,
        o.stripe_session_id,
        o.shipping_address,
        o.billing_address,
        o.created_at,
        o.updated_at
    FROM orders o
    WHERE o.external_id = ext_id;
END;
$$;


--
-- Name: get_order_by_stripe_session(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_order_by_stripe_session(stripe_session_id_param text) RETURNS TABLE(id uuid, external_id character varying, stripe_session_id text, stripe_payment_intent_id text, stripe_payment_intent_secret text, status text, total_amount numeric, subtotal numeric, tax_amount numeric, shipping_amount numeric, customer_email text, customer_name text, customer_phone text, shipping_address jsonb, billing_address jsonb, created_at timestamp with time zone, updated_at timestamp with time zone)
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


--
-- Name: get_product_by_id(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_product_by_id(product_id_param uuid) RETURNS TABLE(id uuid, name text, description text, price numeric, currency text, image_url text, images_gallery text[], stripe_price_id text, stock_quantity integer, category text, rating numeric, reviews_count integer, is_active boolean, metadata jsonb, created_at timestamp with time zone, updated_at timestamp with time zone)
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
  WHERE p.id = product_id_param AND p.is_active = true;
END;
$$;


--
-- Name: get_product_images_count(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_product_images_count(product_id uuid) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  image_count INT := 0;
BEGIN
  SELECT COALESCE(array_length(images_gallery, 1), 0)
  INTO image_count
  FROM products 
  WHERE id = product_id;
  
  RETURN image_count;
END;
$$;


--
-- Name: get_products(text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_products(p_category text DEFAULT NULL::text, p_search text DEFAULT NULL::text, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS TABLE(id uuid, name text, description text, price numeric, currency text, image_url text, images_gallery text[], stripe_price_id text, stock_quantity integer, is_active boolean, metadata jsonb, created_at timestamp with time zone, updated_at timestamp with time zone, category text, rating numeric, reviews_count integer)
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
    p.is_active,
    p.metadata,
    p.created_at,
    p.updated_at,
    p.metadata->>'category' as category,
    COALESCE((p.metadata->>'rating')::DECIMAL, 0) as rating,
    COALESCE((p.metadata->>'reviews_count')::INT, 0) as reviews_count
  FROM products p
  WHERE 
    p.is_active = true
    AND (p_category IS NULL OR p.metadata->>'category' = p_category)
    AND (p_search IS NULL OR 
         p.name ILIKE '%' || p_search || '%' OR 
         p.description ILIKE '%' || p_search || '%')
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


--
-- Name: get_products(text, text, numeric, numeric, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_products(category_slug_param text DEFAULT NULL::text, search_term text DEFAULT NULL::text, min_price numeric DEFAULT NULL::numeric, max_price numeric DEFAULT NULL::numeric, sort_by text DEFAULT 'name'::text, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0) RETURNS TABLE(id uuid, name text, description text, price numeric, currency text, image_url text, images_gallery text[], stripe_price_id text, stock_quantity integer, category text, rating numeric, reviews_count integer, is_active boolean, metadata jsonb, created_at timestamp with time zone, updated_at timestamp with time zone)
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
    p.name ASC -- fallback
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

--
-- Name: remove_cart_item(text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.remove_cart_item(session_id_param text, product_id_param uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items 
  WHERE session_id = session_id_param AND product_id = product_id_param;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;


--
-- Name: remove_image_from_gallery(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.remove_image_from_gallery(product_id uuid, image_url text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  current_gallery TEXT[];
BEGIN
  -- Get current gallery
  SELECT images_gallery INTO current_gallery
  FROM products 
  WHERE id = product_id;
  
  -- Remove image from gallery
  current_gallery := array_remove(current_gallery, image_url);
  
  -- Update the product
  UPDATE products 
  SET 
    images_gallery = current_gallery,
    updated_at = NOW()
  WHERE id = product_id;
  
  RETURN FOUND;
END;
$$;


--
-- Name: reorder_product_images(uuid, integer[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.reorder_product_images(product_id uuid, new_order integer[], OUT success boolean, OUT message text) RETURNS record
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  current_gallery TEXT[];
  new_gallery TEXT[];
  i INT;
BEGIN
  -- Get current gallery
  SELECT images_gallery INTO current_gallery
  FROM products 
  WHERE id = product_id;
  
  -- Validate input
  IF current_gallery IS NULL THEN
    success := false;
    message := 'Product has no images gallery';
    RETURN;
  END IF;
  
  IF array_length(new_order, 1) != array_length(current_gallery, 1) THEN
    success := false;
    message := 'New order array length must match current gallery length';
    RETURN;
  END IF;
  
  -- Reorder the gallery
  new_gallery := '{}';
  FOR i IN 1..array_length(new_order, 1)
  LOOP
    IF new_order[i] < 1 OR new_order[i] > array_length(current_gallery, 1) THEN
      success := false;
      message := 'Invalid index in new_order array';
      RETURN;
    END IF;
    
    new_gallery := array_append(new_gallery, current_gallery[new_order[i]]);
  END LOOP;
  
  -- Update the product
  UPDATE products 
  SET 
    images_gallery = new_gallery,
    updated_at = NOW()
  WHERE id = product_id;
  
  success := true;
  message := 'Images reordered successfully';
END;
$$;


--
-- Name: update_product_images_gallery(uuid, text[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_product_images_gallery(product_id uuid, new_images_gallery text[]) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Validate that array doesn't exceed limit
  IF array_length(new_images_gallery, 1) > 10 THEN
    RAISE EXCEPTION 'Images gallery cannot exceed 10 images';
  END IF;

  -- Update the product
  UPDATE products 
  SET 
    images_gallery = new_images_gallery,
    updated_at = NOW()
  WHERE id = product_id;
  
  -- Return true if update was successful
  RETURN FOUND;
END;
$$;


--
-- Name: update_product_rating(uuid); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: upsert_cart_item(text, uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_cart_item(session_id_param text, product_id_param uuid, quantity_param integer) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
  cart_item_id UUID;
BEGIN
  -- Remove item if quantity is 0 or negative
  IF quantity_param <= 0 THEN
    DELETE FROM cart_items 
    WHERE session_id = session_id_param AND product_id = product_id_param;
    RETURN NULL;
  END IF;

  INSERT INTO cart_items (session_id, product_id, quantity)
  VALUES (session_id_param, product_id_param, quantity_param)
  ON CONFLICT (session_id, product_id)
  DO UPDATE SET 
    quantity = EXCLUDED.quantity,
    expires_at = NOW() + INTERVAL '7 days'
  RETURNING id INTO cart_item_id;
  
  RETURN cart_item_id;
END;
$$;


--
-- Name: validate_product_image_urls(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_product_image_urls(product_id uuid) RETURNS TABLE(valid_urls text[], invalid_urls text[])
    LANGUAGE plpgsql
    AS $_$
DECLARE
  product_gallery TEXT[];
  url_item TEXT;
  valid_list TEXT[] := '{}';
  invalid_list TEXT[] := '{}';
BEGIN
  -- Get the product's images gallery
  SELECT images_gallery INTO product_gallery
  FROM products 
  WHERE id = product_id;
  
  -- Check each URL
  IF product_gallery IS NOT NULL THEN
    FOREACH url_item IN ARRAY product_gallery
    LOOP
      -- Basic URL validation (you can enhance this)
      IF url_item ~ '^https?://[^\s/$.?#].[^\s]*$' THEN
        valid_list := array_append(valid_list, url_item);
      ELSE
        invalid_list := array_append(invalid_list, url_item);
      END IF;
    END LOOP;
  END IF;
  
  RETURN QUERY SELECT valid_list, invalid_list;
END;
$_$;

--
-- End of initial migration script
--