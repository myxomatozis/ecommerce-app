-- Migration: Add admin functionality and storage setup (Fixed)

-- Create admin_users table to track admin privileges
CREATE TABLE public.admin_users (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_users but with simpler policies to avoid recursion
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Simple policies for admin_users that don't reference the same table
CREATE POLICY "Users can view their own admin record" ON public.admin_users
    FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to check if they are admin (we'll handle authorization in functions)
CREATE POLICY "Authenticated users can check admin status" ON public.admin_users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create security definer functions that bypass RLS to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
DECLARE
    is_admin_user boolean := false;
BEGIN
    -- Use security definer to bypass RLS and avoid recursion
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = user_id AND is_active = true
    ) INTO is_admin_user;
    
    RETURN is_admin_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
DECLARE
    is_super_admin_user boolean := false;
BEGIN
    -- Use security definer to bypass RLS and avoid recursion
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = user_id AND role = 'super_admin' AND is_active = true
    ) INTO is_super_admin_user;
    
    RETURN is_super_admin_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin user info (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.get_admin_user_info(user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
    id uuid,
    email text,
    role text,
    is_active boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) AS $$
BEGIN
    -- Only return data if the requesting user is the same user or a super admin
    IF user_id = auth.uid() OR is_super_admin() THEN
        RETURN QUERY
        SELECT 
            au.id,
            au.email,
            au.role,
            au.is_active,
            au.created_at,
            au.updated_at
        FROM public.admin_users au
        WHERE au.id = user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to list all admin users (only for super admins)
CREATE OR REPLACE FUNCTION public.get_all_admin_users()
RETURNS TABLE(
    id uuid,
    email text,
    role text,
    is_active boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) AS $$
BEGIN
    -- Only super admins can view all admin users
    IF NOT is_super_admin() THEN
        RAISE EXCEPTION 'Access denied. Super admin privileges required.';
    END IF;

    RETURN QUERY
    SELECT 
        au.id,
        au.email,
        au.role,
        au.is_active,
        au.created_at,
        au.updated_at
    FROM public.admin_users au
    ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update products table policies for admin access
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products" ON public.products
    FOR SELECT USING (is_active = true OR is_admin());

-- Admin can manage all products
CREATE POLICY "Admin can manage products" ON public.products
    FOR ALL USING (is_admin());

-- Update categories table policies for admin access
DROP POLICY IF EXISTS "Public can read active categories" ON public.categories;
CREATE POLICY "Public can read active categories" ON public.categories
    FOR SELECT USING (is_active = true OR is_admin());

-- Admin can manage all categories
CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (is_admin());

-- Admin can view all orders
CREATE POLICY "Admin can view all orders" ON public.orders
    FOR SELECT USING (is_admin());

CREATE POLICY "Admin can update orders" ON public.orders
    FOR UPDATE USING (is_admin());

-- Admin can view all reviews (including unapproved)
CREATE POLICY "Admin can view all reviews" ON public.reviews
    FOR SELECT USING (is_admin());

CREATE POLICY "Admin can manage reviews" ON public.reviews
    FOR ALL USING (is_admin());

-- Setup storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admin can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' AND 
        is_admin()
    );

CREATE POLICY "Admin can update product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' AND 
        is_admin()
    );

CREATE POLICY "Admin can delete product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' AND 
        is_admin()
    );

-- Create admin functions
-- Function to create/update products
CREATE OR REPLACE FUNCTION admin_upsert_product(
    product_id uuid DEFAULT NULL,
    product_name text DEFAULT NULL,
    product_description text DEFAULT NULL,
    product_price numeric DEFAULT NULL,
    product_currency text DEFAULT 'USD',
    product_image_url text DEFAULT NULL,
    product_images_gallery text[] DEFAULT NULL,
    product_stripe_price_id text DEFAULT NULL,
    product_stock_quantity integer DEFAULT NULL,
    product_category_id uuid DEFAULT NULL,
    product_is_active boolean DEFAULT true,
    product_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
    result_id uuid;
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    -- Insert or update product
    IF product_id IS NULL THEN
        -- Create new product
        INSERT INTO products (
            name, description, price, currency, image_url, images_gallery,
            stripe_price_id, stock_quantity, category_id, is_active, metadata
        ) VALUES (
            product_name, product_description, product_price, product_currency,
            product_image_url, product_images_gallery, product_stripe_price_id,
            product_stock_quantity, product_category_id, product_is_active, product_metadata
        ) RETURNING id INTO result_id;
    ELSE
        -- Update existing product
        UPDATE products SET
            name = COALESCE(product_name, name),
            description = COALESCE(product_description, description),
            price = COALESCE(product_price, price),
            currency = COALESCE(product_currency, currency),
            image_url = COALESCE(product_image_url, image_url),
            images_gallery = COALESCE(product_images_gallery, images_gallery),
            stripe_price_id = COALESCE(product_stripe_price_id, stripe_price_id),
            stock_quantity = COALESCE(product_stock_quantity, stock_quantity),
            category_id = COALESCE(product_category_id, category_id),
            is_active = COALESCE(product_is_active, is_active),
            metadata = COALESCE(product_metadata, metadata),
            updated_at = now()
        WHERE id = product_id
        RETURNING id INTO result_id;
    END IF;

    RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create/update categories
CREATE OR REPLACE FUNCTION admin_upsert_category(
    category_id uuid DEFAULT NULL,
    category_name text DEFAULT NULL,
    category_slug text DEFAULT NULL,
    category_description text DEFAULT NULL,
    category_is_active boolean DEFAULT true
)
RETURNS uuid AS $$
DECLARE
    result_id uuid;
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    -- Insert or update category
    IF category_id IS NULL THEN
        -- Create new category
        INSERT INTO categories (name, slug, description, is_active)
        VALUES (category_name, category_slug, category_description, category_is_active)
        RETURNING id INTO result_id;
    ELSE
        -- Update existing category
        UPDATE categories SET
            name = COALESCE(category_name, name),
            slug = COALESCE(category_slug, slug),
            description = COALESCE(category_description, description),
            is_active = COALESCE(category_is_active, is_active),
            updated_at = now()
        WHERE id = category_id
        RETURNING id INTO result_id;
    END IF;

    RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all products for admin (including inactive)
CREATE OR REPLACE FUNCTION admin_get_products(
    p_limit integer DEFAULT 50,
    p_offset integer DEFAULT 0,
    p_search text DEFAULT NULL,
    p_category_id uuid DEFAULT NULL,
    p_is_active boolean DEFAULT NULL
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
    category_id uuid,
    category_name text,
    rating numeric,
    reviews_count integer,
    is_active boolean,
    metadata jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

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
        p.category_id,
        c.name as category_name,
        p.rating,
        p.reviews_count,
        p.is_active,
        p.metadata,
        p.created_at,
        p.updated_at
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 
        (p_search IS NULL OR p.name ILIKE '%' || p_search || '%' OR p.description ILIKE '%' || p_search || '%')
        AND (p_category_id IS NULL OR p.category_id = p_category_id)
        AND (p_is_active IS NULL OR p.is_active = p_is_active)
    ORDER BY p.updated_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all categories for admin (including inactive)
CREATE OR REPLACE FUNCTION admin_get_categories()
RETURNS TABLE(
    id uuid,
    name text,
    slug text,
    description text,
    is_active boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.is_active,
        c.created_at,
        c.updated_at
    FROM categories c
    ORDER BY c.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete product
CREATE OR REPLACE FUNCTION admin_delete_product(product_id uuid)
RETURNS boolean AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    DELETE FROM products WHERE id = product_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete category
CREATE OR REPLACE FUNCTION admin_delete_category(category_id uuid)
RETURNS boolean AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    DELETE FROM categories WHERE id = category_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to promote user to admin (super admin only)
CREATE OR REPLACE FUNCTION admin_promote_user(
    user_email text,
    user_role text DEFAULT 'admin'
)
RETURNS uuid AS $$
DECLARE
    user_id uuid;
    result_id uuid;
BEGIN
    -- Check if current user is super admin
    IF NOT is_super_admin() THEN
        RAISE EXCEPTION 'Access denied. Super admin privileges required.';
    END IF;

    -- Get user ID from email
    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;

    -- Insert or update admin record
    INSERT INTO admin_users (id, email, role, is_active)
    VALUES (user_id, user_email, user_role, true)
    ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role,
        is_active = true,
        updated_at = now()
    RETURNING id INTO result_id;

    RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke admin access (super admin only)
CREATE OR REPLACE FUNCTION admin_revoke_user(user_email text)
RETURNS boolean AS $$
DECLARE
    user_id uuid;
BEGIN
    -- Check if current user is super admin
    IF NOT is_super_admin() THEN
        RAISE EXCEPTION 'Access denied. Super admin privileges required.';
    END IF;

    -- Get user ID from email
    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;

    -- Deactivate admin access
    UPDATE admin_users 
    SET is_active = false, updated_at = now()
    WHERE id = user_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update updated_at trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);

-- Comments for documentation
COMMENT ON TABLE public.admin_users IS 'Stores admin user information and roles';
COMMENT ON FUNCTION public.is_admin IS 'Returns true if the user has admin privileges';
COMMENT ON FUNCTION public.is_super_admin IS 'Returns true if the user has super admin privileges';
COMMENT ON FUNCTION admin_upsert_product IS 'Admin function to create or update products';
COMMENT ON FUNCTION admin_upsert_category IS 'Admin function to create or update categories';
COMMENT ON FUNCTION admin_get_products IS 'Admin function to get all products with filters';
COMMENT ON FUNCTION admin_get_categories IS 'Admin function to get all categories';
COMMENT ON FUNCTION admin_delete_product IS 'Admin function to delete products';
COMMENT ON FUNCTION admin_delete_category IS 'Admin function to delete categories';
COMMENT ON FUNCTION admin_promote_user IS 'Super admin function to promote users to admin';
COMMENT ON FUNCTION admin_revoke_user IS 'Super admin function to revoke admin access';

-- Instructions for setting up initial super admin:
-- 1. First, sign up a user with your desired admin email through the normal auth flow
-- 2. Then run this query (replace with your actual email):
--
-- INSERT INTO public.admin_users (id, email, role)
-- SELECT id, 'your-admin-email@thefolkproject.com', 'super_admin'
-- FROM auth.users 
-- WHERE email = 'your-admin-email@thefolkproject.com';