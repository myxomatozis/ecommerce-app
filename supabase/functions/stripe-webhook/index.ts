// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { Database } from "../../../types/database.types.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2025-05-28.basil",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const sendOrderConfirmationEmail = async (orderId: string) => {
  try {
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Failed to fetch order for email:", orderError);
      return;
    }

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Failed to fetch order items for email:", itemsError);
      return;
    }

    const orderShippingAddress = order.shipping_address as {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postal_code: string;
      country: string;
    } | null;

    // Format shipping address properly for template
    const shippingAddress = orderShippingAddress
      ? {
          line1: orderShippingAddress.line1 || "",
          line2: orderShippingAddress?.line2 || "",
          city: orderShippingAddress.city || "",
          state: orderShippingAddress?.state || "",
          postalCode: orderShippingAddress.postal_code || "",
          country: orderShippingAddress.country || "",
        }
      : null;

    // Calculate estimated delivery (5 business days from now)
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7); // Add 7 days for weekend buffer
    const estimatedDelivery = estimatedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    // Prepare email data with proper formatting
    const emailData = {
      templateId: "order-confirmation",
      to: order.customer_email || "",
      variables: {
        currency: order.currency || "USD",
        orderNumber: order.external_id || "",
        customerName: order.customer_name || "Valued Customer",
        customerEmail: order.customer_email || "",
        items:
          orderItems?.map((item) => ({
            name: item.product_name,
            price: Number(item.product_price),
            quantity: item.quantity,
          })) || [],
        subtotal: Number(order.subtotal).toFixed(2),
        shipping: Number(order.shipping_amount || 0).toFixed(2),
        tax: Number(order.tax_amount || 0).toFixed(2),
        total: Number(order.total_amount).toFixed(2),
        estimatedDelivery,
        shippingAddress,
        storeUrl: "https://thefolkproject.com", // Replace with your actual domain
        // trackingUrl will be added when order ships
      },
      from: "The Folk <info@thefolkproject.com>",
    };

    console.log("Sending email with data:", {
      ...emailData,
      variables: {
        ...emailData.variables,
        items: `${emailData.variables.items.length} items`,
        shippingAddress: emailData.variables.shippingAddress
          ? "Present"
          : "Missing",
      },
    });

    // Send email via resend function
    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/resend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Failed to send order confirmation email:", errorData);
    } else {
      const result = await emailResponse.json();
      console.log(
        "Order confirmation email sent successfully:",
        result.messageId
      );
    }
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log(`Received webhook: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Processing completed checkout session:", session.id);

        // Get session details with line items
        // const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        //   session.id,
        //   { expand: ["line_items"] }
        // );

        const cartSessionId = session.metadata?.cart_session_id;
        if (!cartSessionId) {
          console.error("No cart session ID in metadata");
          return new Response("No cart session ID", { status: 400 });
        }

        // Prepare shipping address
        const shippingAddress = session.collected_information?.shipping_details
          ? {
              line1:
                session.collected_information?.shipping_details.address.line1,
              line2:
                session.collected_information?.shipping_details.address.line2,
              city: session.collected_information?.shipping_details.address
                .city,
              state:
                session.collected_information?.shipping_details.address.state,
              postal_code:
                session.collected_information?.shipping_details.address
                  .postal_code,
              country:
                session.collected_information?.shipping_details.address.country,
            }
          : null;

        // Prepare billing address
        const billingAddress = session.customer_details?.address
          ? {
              line1: session.customer_details.address.line1,
              line2: session.customer_details.address.line2,
              city: session.customer_details.address.city,
              state: session.customer_details.address.state,
              postal_code: session.customer_details.address.postal_code,
              country: session.customer_details.address.country,
            }
          : null;

        // Create order from cart
        const { data: orderId, error } = await supabase.rpc(
          "create_order_from_cart",
          {
            session_id_param: cartSessionId,
            stripe_session_id_param: session.id,
            customer_email_param:
              session.customer_details?.email || session.customer_email || "",
            customer_name_param:
              session.customer_details?.name ||
              session.metadata?.customer_name ||
              "",
            customer_phone_param:
              session.customer_details?.phone ||
              session.metadata?.customer_phone,
            shipping_address_param: shippingAddress,
            billing_address_param: billingAddress,
            currency_param: session.currency?.toUpperCase() || "USD",
          }
        );

        if (error) {
          console.error("Error creating order:", error);
          return new Response(`Error creating order: ${error.message}`, {
            status: 500,
          });
        }

        // Update order with payment intent ID
        if (session.payment_intent) {
          await supabase
            .from("orders")
            .update({
              stripe_payment_intent_id: session.payment_intent as string,
              status: "processing",
            })
            .eq("id", orderId);
        }
        // Send order confirmation email
        await sendOrderConfirmationEmail(orderId);
        console.log(`Order created successfully: ${orderId}`);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update order status
        console.log(paymentIntent);
        const { error } = await supabase
          .from("orders")
          .update({
            status: "processing",
            stripe_payment_intent_secret: paymentIntent.client_secret,
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (error) {
          console.error("Error updating order status:", error);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Update order status to failed
        const { error } = await supabase
          .from("orders")
          .update({
            status: "cancelled",
            stripe_payment_intent_secret: paymentIntent.client_secret,
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (error) {
          console.error("Error updating order status:", error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      `Webhook error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { status: 400 }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
