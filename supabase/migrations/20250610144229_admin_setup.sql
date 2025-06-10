-- Migration: Add admin functionality to The Folk

-- ============================================================================
-- ADMIN USERS TABLE (No email duplication - joins with auth.users)
-- ============================================================================

-- Create admin_users table
CREATE TABLE public.admin_users (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- ADMIN HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = user_id AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = user_id AND role = 'super_admin' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ADMIN USER MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to get admin user by email
CREATE OR REPLACE FUNCTION public.get_admin_user_by_email(user_email text)
RETURNS TABLE(
    id uuid,
    email text,
    role text,
    is_active boolean,
    created_at timestamptz,
    updated_at timestamptz
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        u.email,
        au.role,
        au.is_active,
        au.created_at,
        au.updated_at
    FROM admin_users au
    JOIN auth.users u ON au.id = u.id
    WHERE u.email = user_email AND au.is_active = true;
END;
$$;

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(
    user_email text,
    admin_role text DEFAULT 'admin'
)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    user_id uuid;
BEGIN
    -- Check if role is valid
    IF admin_role NOT IN ('admin', 'super_admin') THEN
        RAISE EXCEPTION 'Invalid role. Must be admin or super_admin';
    END IF;
    
    -- Get user ID from email
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Insert or update admin user
    INSERT INTO admin_users (id, role, is_active)
    VALUES (user_id, admin_role, true)
    ON CONFLICT (id) 
    DO UPDATE SET 
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        updated_at = now();
    
    RETURN user_id;
END;
$$;

-- ============================================================================
-- ADMIN PRODUCT MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to create/update products (admin only)
CREATE OR REPLACE FUNCTION public.admin_upsert_product(
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

-- Function to get all products for admin (including inactive)
CREATE OR REPLACE FUNCTION public.admin_get_products(
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

-- Function to delete product (admin only)
CREATE OR REPLACE FUNCTION public.admin_delete_product(product_id uuid)
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

-- ============================================================================
-- ADMIN VIEWS
-- ============================================================================

-- Create view for easy querying admin users with email
CREATE VIEW public.admin_users_with_email AS
SELECT 
    au.id,
    u.email,
    u.email_confirmed_at,
    u.last_sign_in_at,
    au.role,
    au.is_active,
    au.created_at,
    au.updated_at
FROM admin_users au
JOIN auth.users u ON au.id = u.id;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Admin users policies
CREATE POLICY "Admin users can view their own data" ON public.admin_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all admin users" ON public.admin_users
    FOR SELECT USING (is_super_admin());

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
    FOR ALL USING (is_super_admin());

-- Update existing product policies for admin access
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products" ON public.products
    FOR SELECT USING (is_active = true OR is_admin());

-- Admin can manage all products
CREATE POLICY "Admin can manage products" ON public.products
    FOR ALL USING (is_admin());

-- Update existing category policies for admin access
DROP POLICY IF EXISTS "Public can read active categories" ON public.categories;
CREATE POLICY "Public can read active categories" ON public.categories
    FOR SELECT USING (is_active = true OR is_admin());

-- Admin can manage all categories
CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (is_admin());

-- Admin can view and manage all orders
CREATE POLICY "Admin can view all orders" ON public.orders
    FOR SELECT USING (is_admin());

CREATE POLICY "Admin can update orders" ON public.orders
    FOR UPDATE USING (is_admin());

-- Admin can view all order items
CREATE POLICY "Admin can view all order items" ON public.order_items
    FOR SELECT USING (is_admin());

-- Admin can view all reviews (including unapproved)
CREATE POLICY "Admin can view all reviews" ON public.reviews
    FOR SELECT USING (is_admin());

CREATE POLICY "Admin can manage reviews" ON public.reviews
    FOR ALL USING (is_admin());

-- ============================================================================
-- STORAGE SETUP FOR ADMIN
-- ============================================================================

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
CREATE POLICY "Admin can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' AND 
        is_admin()
    );

DROP POLICY IF EXISTS "Admin can update product images" ON storage.objects;
CREATE POLICY "Admin can update product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' AND 
        is_admin()
    );

DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;
CREATE POLICY "Admin can delete product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' AND 
        is_admin()
    );

-- ============================================================================
-- ADMIN DASHBOARD FUNCTIONS
-- ============================================================================

-- Function to get dashboard statistics (admin only)
CREATE OR REPLACE FUNCTION public.admin_get_dashboard_stats()
RETURNS TABLE(
    total_products bigint,
    active_products bigint,
    inactive_products bigint,
    low_stock_products bigint,
    total_orders bigint,
    pending_orders bigint,
    total_revenue numeric,
    total_categories bigint,
    active_categories bigint
) AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM products WHERE is_active = true) as active_products,
        (SELECT COUNT(*) FROM products WHERE is_active = false) as inactive_products,
        (SELECT COUNT(*) FROM products WHERE stock_quantity IS NOT NULL AND stock_quantity < 5) as low_stock_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('delivered', 'shipped')) as total_revenue,
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COUNT(*) FROM categories WHERE is_active = true) as active_categories;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent orders for admin dashboard
CREATE OR REPLACE FUNCTION public.admin_get_recent_orders(p_limit integer DEFAULT 5)
RETURNS TABLE(
    id uuid,
    external_id text,
    customer_email text,
    customer_name text,
    total_amount numeric,
    status text,
    created_at timestamp with time zone
) AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    RETURN QUERY
    SELECT 
        o.id,
        o.external_id,
        o.customer_email,
        o.customer_name,
        o.total_amount,
        o.status,
        o.created_at
    FROM orders o
    ORDER BY o.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_created_at ON public.admin_users(created_at);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.admin_users IS 'Stores admin user roles and permissions. Email is retrieved from auth.users via JOIN.';
COMMENT ON FUNCTION public.is_admin IS 'Returns true if the current user has admin privileges';
COMMENT ON FUNCTION public.is_super_admin IS 'Returns true if the current user has super admin privileges';
COMMENT ON FUNCTION public.promote_user_to_admin IS 'Promotes a user to admin by email address';
COMMENT ON FUNCTION public.admin_upsert_product IS 'Admin function to create or update products';
COMMENT ON FUNCTION public.admin_get_products IS 'Admin function to get all products with filters';
COMMENT ON FUNCTION public.admin_delete_product IS 'Admin function to delete products';
COMMENT ON FUNCTION public.admin_get_dashboard_stats IS 'Admin function to get dashboard statistics';
COMMENT ON FUNCTION public.admin_get_recent_orders IS 'Admin function to get recent orders for dashboard';
COMMENT ON VIEW public.admin_users_with_email IS 'View that joins admin_users with auth.users to include email information';

-- ============================================================================
-- SETUP INSTRUCTIONS
-- ============================================================================

-- After running this migration, create your first admin user:
-- 
-- 1. First, create a user account via your app's signup or Supabase Auth UI
-- 2. Then promote them to super admin:
--    SELECT promote_user_to_admin('your-email@thefolkproject.com', 'super_admin');
--
-- Usage examples:
-- 
-- Get current admin user:
-- SELECT * FROM admin_users_with_email WHERE id = auth.uid();
--
-- Get all admin users (super admin only):
-- SELECT * FROM admin_users_with_email ORDER BY created_at DESC;
--
-- Get dashboard stats:
-- SELECT * FROM admin_get_dashboard_stats();
--
-- Get recent orders:
-- SELECT * FROM admin_get_recent_orders(10);