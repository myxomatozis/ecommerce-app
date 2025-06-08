// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { Database } from "../../../types/database.types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2025-05-28.basil",
    });

    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    const {
      sessionId,
      customerInfo,
      successUrl,
      cancelUrl,
    }: {
      customerInfo: {
        email: string;
        name: string;
        phone?: string;
        shippingAddress?: Record<string, string | number | null | undefined>;
        billingAddress?: Record<string, string | number | null | undefined>;
      };
      sessionId: string;
      successUrl: string;
      cancelUrl: string;
    } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Get cart items from Supabase
    const { data: cartItems, error: cartError } = await supabase.rpc(
      "get_cart_items",
      { session_id_param: sessionId }
    );

    if (cartError) {
      throw new Error(`Failed to get cart items: ${cartError.message}`);
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Get cart summary
    const { data: cartSummary, error: summaryError } = await supabase.rpc(
      "get_cart_summary",
      { session_id_param: sessionId }
    );

    if (summaryError) {
      throw new Error(`Failed to get cart summary: ${summaryError.message}`);
    }

    const summary = cartSummary[0];

    const currency = cartItems[0].product_currency.toLowerCase();

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.product_name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.product_price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (summary.shipping > 0) {
      const currency = cartItems[0].product_currency.toLowerCase();
      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: "Shipping",
            images: [], // You can add a shipping image if needed
          },
          unit_amount: Math.round(summary.shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (summary.tax > 0) {
      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: "Tax",
            images: [], // You can add a tax image if needed
          },
          unit_amount: Math.round(summary.tax * 100),
        },
        quantity: 1,
      });
    }

    const existingCustomers = await stripe.customers.list({
      email: customerInfo.email,
      limit: 1,
    });

    let stripeCustomerId;
    if (existingCustomers.data.length > 0) {
      console.log(
        `Found existing customer with email ${customerInfo.email}, using ID: ${existingCustomers.data[0].id}`
      );
      stripeCustomerId = existingCustomers.data[0].id;
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        cart_session_id: sessionId,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB"],
      },
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      ...(stripeCustomerId
        ? { customer: stripeCustomerId }
        : { customer_creation: "always", customer_email: customerInfo.email }),
    });

    return new Response(
      JSON.stringify({
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-stripe-checkout' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
