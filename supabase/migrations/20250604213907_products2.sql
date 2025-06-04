DROP FUNCTION IF EXISTS get_products(
  TEXT, TEXT, DECIMAL, DECIMAL, TEXT, INTEGER, INTEGER
);
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
  images_gallery TEXT[],
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
$$ LANGUAGE plpgsql;

-- Function to get single product by ID
DROP FUNCTION IF EXISTS get_product_by_id(UUID);
CREATE OR REPLACE FUNCTION get_product_by_id(product_id_param UUID)
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  currency TEXT,
  image_url TEXT,
  images_gallery TEXT[],
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
$$ LANGUAGE plpgsql;