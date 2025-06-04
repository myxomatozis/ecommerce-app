-- Migration: Add human-readable external_id to orders
-- File: 003_add_order_external_id.sql

-- Create a sequence for order numbers starting from 1
CREATE SEQUENCE IF NOT EXISTS order_external_id_seq 
    START 1 
    INCREMENT 1 
    MINVALUE 1 
    MAXVALUE 999999
    CACHE 1;

-- Add external_id column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS external_id VARCHAR(20) UNIQUE;

-- Create function to generate human-readable external ID
CREATE OR REPLACE FUNCTION generate_order_external_id()
RETURNS VARCHAR(20) AS $$
DECLARE
    next_id INTEGER;
    external_id VARCHAR(20);
BEGIN
    next_id := nextval('order_external_id_seq');
    external_id := 'ORD-' || LPAD(next_id::TEXT, 6, '0');
    RETURN external_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate external_id on insert
CREATE OR REPLACE FUNCTION set_order_external_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.external_id IS NULL THEN
        NEW.external_id := generate_order_external_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_set_order_external_id ON orders;
CREATE TRIGGER trigger_set_order_external_id
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_external_id();

-- Update existing orders with external IDs (if any exist)
UPDATE orders 
SET external_id = generate_order_external_id()
WHERE external_id IS NULL;

-- Add index for better performance on external_id lookups
CREATE INDEX IF NOT EXISTS idx_orders_external_id ON orders(external_id);

-- Update the get_order function to include external_id
CREATE OR REPLACE FUNCTION get_order(order_uuid UUID)
RETURNS TABLE (
    id UUID,
    external_id VARCHAR(20),
    user_id UUID,
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    shipping_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    stripe_session_id VARCHAR(255),
    shipping_address JSONB,
    billing_address JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
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
$$ LANGUAGE plpgsql;

-- Create function to get order by external_id
CREATE OR REPLACE FUNCTION get_order_by_external_id(ext_id VARCHAR(20))
RETURNS TABLE (
    id UUID,
    external_id VARCHAR(20),
    user_id UUID,
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    shipping_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    stripe_session_id VARCHAR(255),
    shipping_address JSONB,
    billing_address JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
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
$$ LANGUAGE plpgsql;

-- Update get_user_orders function to include external_id
CREATE OR REPLACE FUNCTION get_user_orders(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    external_id VARCHAR(20),
    status VARCHAR(50),
    total_amount DECIMAL(10,2),
    created_at TIMESTAMPTZ,
    item_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.external_id,
        o.status,
        o.total_amount,
        o.created_at,
        COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = user_uuid
    GROUP BY o.id, o.external_id, o.status, o.total_amount, o.created_at
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Update create_order function to return external_id
CREATE OR REPLACE FUNCTION create_order(
    p_user_id UUID,
    p_total_amount DECIMAL(10,2),
    p_shipping_amount DECIMAL(10,2),
    p_tax_amount DECIMAL(10,2),
    p_shipping_address JSONB,
    p_billing_address JSONB DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    external_id VARCHAR(20),
    created_at TIMESTAMPTZ
) AS $$
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
$$ LANGUAGE plpgsql;

-- Function to get order by stripe session ID
DROP FUNCTION IF EXISTS get_order_by_stripe_session(TEXT);

CREATE FUNCTION get_order_by_stripe_session(stripe_session_id_param TEXT)
RETURNS TABLE(
  id UUID,
  external_id VARCHAR(20),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_payment_intent_secret TEXT,
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
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SEQUENCE order_external_id_seq TO authenticated;
GRANT SELECT ON orders TO authenticated;
GRANT EXECUTE ON FUNCTION get_order(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_order_by_external_id(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_orders(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_order(UUID, DECIMAL, DECIMAL, DECIMAL, JSONB, JSONB) TO authenticated;