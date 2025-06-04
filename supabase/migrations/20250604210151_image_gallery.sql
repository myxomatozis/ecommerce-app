-- Migration: Add images_gallery column to products table
-- Description: Adds an array of image URLs to support product image galleries

-- Add images_gallery column as an array of text (URLs)
ALTER TABLE products 
ADD COLUMN images_gallery TEXT[] DEFAULT '{}';

-- Add comment to describe the column
COMMENT ON COLUMN products.images_gallery IS 'Array of image URLs for product gallery. Images stored in Supabase Storage.';

-- Update existing products to include the main image in the gallery if it exists
UPDATE products 
SET images_gallery = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Create index for better performance when querying products with images
CREATE INDEX idx_products_images_gallery ON products USING GIN (images_gallery);

-- Add constraint to ensure gallery doesn't exceed reasonable limit (e.g., 10 images)
ALTER TABLE products 
ADD CONSTRAINT check_images_gallery_limit 
CHECK (array_length(images_gallery, 1) <= 10);

-- Migration: Create storage bucket for product images
-- File: supabase/migrations/002_create_product_images_bucket.sql

-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit per file
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/avif'
  ]::text[]
);

-- Create RLS policies for the bucket
-- Allow public read access to all images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to insert images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update images
CREATE POLICY "Users can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Database functions for products with images gallery support
-- File: supabase/migrations/003_product_functions.sql

-- Function to get all active products with images gallery
CREATE OR REPLACE FUNCTION get_products(
  p_category TEXT DEFAULT NULL,
  p_search TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  currency TEXT,
  image_url TEXT,
  images_gallery TEXT[],
  stripe_price_id TEXT,
  stock_quantity INT,
  is_active BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category TEXT,
  rating DECIMAL,
  reviews_count INT
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

-- Function to get a single product by ID with images gallery
DROP FUNCTION IF EXISTS get_product_by_id(UUID);
CREATE OR REPLACE FUNCTION get_product_by_id(product_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  currency TEXT,
  image_url TEXT,
  images_gallery TEXT[],
  stripe_price_id TEXT,
  stock_quantity INT,
  is_active BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category TEXT,
  rating DECIMAL,
  reviews_count INT
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
    p.is_active,
    p.metadata,
    p.created_at,
    p.updated_at,
    p.metadata->>'category' as category,
    COALESCE((p.metadata->>'rating')::DECIMAL, 0) as rating,
    COALESCE((p.metadata->>'reviews_count')::INT, 0) as reviews_count
  FROM products p
  WHERE p.id = product_id AND p.is_active = true;
END;
$$;

-- Function to get products by category with images gallery
CREATE OR REPLACE FUNCTION get_products_by_category(
  p_category TEXT,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  currency TEXT,
  image_url TEXT,
  images_gallery TEXT[],
  stripe_price_id TEXT,
  stock_quantity INT,
  is_active BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category TEXT,
  rating DECIMAL,
  reviews_count INT
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
    AND p.metadata->>'category' = p_category
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function to update product images gallery
CREATE OR REPLACE FUNCTION update_product_images_gallery(
  product_id UUID,
  new_images_gallery TEXT[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to add image to product gallery
CREATE OR REPLACE FUNCTION add_image_to_gallery(
  product_id UUID,
  image_url TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to remove image from product gallery
CREATE OR REPLACE FUNCTION remove_image_from_gallery(
  product_id UUID,
  image_url TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Storage helper functions for product images
-- File: supabase/migrations/005_storage_helper_functions.sql

-- Function to get public URL for storage object
CREATE OR REPLACE FUNCTION get_storage_public_url(
  bucket_name TEXT,
  object_path TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_url TEXT;
BEGIN
  -- Get the Supabase project URL (you'll need to replace this with your actual URL)
  -- In production, this should be dynamic or configured via environment
  SELECT current_setting('app.settings.supabase_url', true) INTO base_url;
  
  -- Fallback if setting not found
  IF base_url IS NULL THEN
    base_url := 'https://your-project.supabase.co';
  END IF;
  
  RETURN base_url || '/storage/v1/object/public/' || bucket_name || '/' || object_path;
END;
$$;

-- Function to clean up orphaned images from storage
CREATE OR REPLACE FUNCTION cleanup_orphaned_product_images()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to validate image URLs in product gallery
CREATE OR REPLACE FUNCTION validate_product_image_urls(product_id UUID)
RETURNS TABLE (
  valid_urls TEXT[],
  invalid_urls TEXT[]
)
LANGUAGE plpgsql
AS $$
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
$$;

-- Function to get product images count
CREATE OR REPLACE FUNCTION get_product_images_count(product_id UUID)
RETURNS INT
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

-- Function to reorder images in product gallery
CREATE OR REPLACE FUNCTION reorder_product_images(
  product_id UUID,
  new_order INT[],
  OUT success BOOLEAN,
  OUT message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
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