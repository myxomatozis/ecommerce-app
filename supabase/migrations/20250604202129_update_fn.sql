-- Function to get order by stripe session ID
DROP FUNCTION IF EXISTS get_order_by_stripe_session(TEXT);

CREATE FUNCTION get_order_by_stripe_session(stripe_session_id_param TEXT)
RETURNS TABLE(
  id UUID,
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