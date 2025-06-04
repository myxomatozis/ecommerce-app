-- Enhanced Supabase Ecommerce Schema
-- Supports categories, ratings, reviews, and all frontend features

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  stripe_price_id TEXT, -- Stripe Price ID for checkout
  stock_quantity INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  rating DECIMAL(3,2) DEFAULT 0, -- Average rating 0-5
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  reviewer_name TEXT,
  reviewer_email TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_payment_intent_secret TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL, -- Snapshot of product name at time of order
  product_price DECIMAL(10,2) NOT NULL, -- Snapshot of product price
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * product_price) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart (session-based, temporary storage)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL, -- Browser-generated session ID
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  UNIQUE(session_id, product_id)
);

-- Indexes for performance
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_cart_expires ON cart_items(expires_at);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;

-- RLS Policies (public read access, no auth required)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active categories
CREATE POLICY "Public can read active categories" ON categories
  FOR SELECT USING (is_active = true);

-- Allow public read access to active products
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

-- Allow public read access to approved reviews
CREATE POLICY "Public can read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Allow public insert on reviews
CREATE POLICY "Public can create reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Allow public insert/update on cart items (by session_id)
CREATE POLICY "Public can manage cart items by session" ON cart_items
  FOR ALL USING (true);

-- Allow public read access to orders (by stripe session ID for order confirmation)
CREATE POLICY "Public can read orders by stripe session" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Public can read order items" ON order_items
  FOR SELECT USING (true);

-- Allow public insert for orders (for webhook processing)
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Database Functions

-- Function to get all active products with category info
CREATE OR REPLACE FUNCTION get_products(
  category_slug_param TEXT DEFAULT NULL,
  search_term TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  sort_by TEXT DEFAULT 'name',
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  currency TEXT,
  image_url TEXT,
  stripe_price_id TEXT,
  stock_quantity INTEGER,
  category TEXT,
  rating DECIMAL,
  reviews_count INTEGER,
  is_active BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.currency,
    p.image_url,
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
$$ LANGUAGE plpgsql;

-- Function to get single product by ID
CREATE OR REPLACE FUNCTION get_product_by_id(product_id_param UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  currency TEXT,
  image_url TEXT,
  stripe_price_id TEXT,
  stock_quantity INTEGER,
  category TEXT,
  rating DECIMAL,
  reviews_count INTEGER,
  is_active BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.currency,
    p.image_url,
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
$$ LANGUAGE plpgsql;

-- Function to get cart total with tax and shipping
CREATE OR REPLACE FUNCTION get_cart_summary(session_id_param TEXT)
RETURNS TABLE(
  total_amount DECIMAL, 
  item_count INTEGER, 
  shipping DECIMAL, 
  tax DECIMAL, 
  discount DECIMAL
) AS $$
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
$$ LANGUAGE plpgsql;

-- Function to get cart items with product details
CREATE OR REPLACE FUNCTION get_cart_items(session_id_param TEXT)
RETURNS TABLE(
  cart_item_id UUID,
  product_id UUID,
  product_name TEXT,
  product_price DECIMAL,
  quantity INTEGER,
  total_price DECIMAL,
  image_url TEXT,
  stripe_price_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    p.id,
    p.name,
    p.price,
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
$$ LANGUAGE plpgsql;

-- Function to add/update cart item
CREATE OR REPLACE FUNCTION upsert_cart_item(
  session_id_param TEXT,
  product_id_param UUID,
  quantity_param INTEGER
)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql;

-- Function to remove cart item
CREATE OR REPLACE FUNCTION remove_cart_item(
  session_id_param TEXT,
  product_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items 
  WHERE session_id = session_id_param AND product_id = product_id_param;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to clear cart
CREATE OR REPLACE FUNCTION clear_cart(session_id_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items WHERE session_id = session_id_param;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to create order from cart
CREATE OR REPLACE FUNCTION create_order_from_cart(
  session_id_param TEXT,
  stripe_session_id_param TEXT,
  customer_email_param TEXT,
  customer_name_param TEXT,
  customer_phone_param TEXT DEFAULT NULL,
  shipping_address_param JSONB DEFAULT NULL,
  billing_address_param JSONB DEFAULT NULL
)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql;

-- Function to get order by stripe session ID
CREATE OR REPLACE FUNCTION get_order_by_stripe_session(stripe_session_id_param TEXT)
RETURNS TABLE(
  id UUID,
  stripe_session_id TEXT,
  status TEXT,
  total_amount DECIMAL,
  subtotal DECIMAL,
  tax_amount DECIMAL,
  shipping_amount DECIMAL,
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.stripe_session_id,
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
$$ LANGUAGE plpgsql;

-- Function to update product rating after review
CREATE OR REPLACE FUNCTION update_product_rating(product_id_param UUID)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql;

-- Function to cleanup expired cart items
CREATE OR REPLACE FUNCTION cleanup_expired_cart_items()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update product rating when review is added/updated
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_update_product_rating();

-- Sample data
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Tech gadgets and electronic devices'),
('Clothing', 'clothing', 'Fashion and apparel'),
('Home', 'home', 'Home and garden products'),
('Fitness', 'fitness', 'Fitness and sports equipment'),
('Accessories', 'accessories', 'Various accessories and add-ons');

-- Sample products (matching your mock data structure)
INSERT INTO products (name, description, price, image_url, stripe_price_id, stock_quantity, category_id, rating, reviews_count) 
SELECT 
  'Wireless Noise-Canceling Headphones',
  'Premium wireless headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.',
  299.99,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  'price_headphones',
  45,
  c.id,
  4.8,
  324
FROM categories c WHERE c.slug = 'electronics'

UNION ALL

SELECT 
  'Minimalist Coffee Mug',
  'Handcrafted ceramic mug with a sleek design. Perfect for your morning coffee or evening tea.',
  24.99,
  'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop',
  'price_mug',
  120,
  c.id,
  4.6,
  89
FROM categories c WHERE c.slug = 'home'

UNION ALL

SELECT 
  'Premium Cotton T-Shirt',
  'Soft, breathable 100% organic cotton t-shirt. Available in multiple colors and sizes.',
  39.99,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
  'price_tshirt',
  200,
  c.id,
  4.7,
  156
FROM categories c WHERE c.slug = 'clothing'

UNION ALL

SELECT 
  'Leather Laptop Bag',
  'Genuine leather laptop bag with multiple compartments. Fits laptops up to 15 inches.',
  129.99,
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
  'price_bag',
  67,
  c.id,
  4.9,
  234
FROM categories c WHERE c.slug = 'accessories'

UNION ALL

SELECT 
  'Smart Water Bottle',
  'Temperature-maintaining smart water bottle with hydration tracking and mobile app integration.',
  79.99,
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
  'price_bottle',
  89,
  c.id,
  4.5,
  112
FROM categories c WHERE c.slug = 'electronics'

UNION ALL

SELECT 
  'Yoga Mat Pro',
  'Non-slip premium yoga mat with alignment guides. Perfect for all yoga practices.',
  89.99,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
  'price_yoga',
  156,
  c.id,
  4.8,
  78
FROM categories c WHERE c.slug = 'fitness';