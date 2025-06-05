// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables.");
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type RequestBody = {
  templateId: "order_confirmation" | "contact_form";
  variables: Record<string, string>;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { templateId, variables }: RequestBody = await req.json();

  if (templateId === "contact_form") {
    try {
      await resend.emails.send({
        from: "The Folk Website <info@thefolkproject.com>",
        to: ["info@thefolkproject.com"],
        subject: "Contact Form Submission",
        html: `<div>${Object.entries(variables)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join("<br>")}<div>`,
      });
    } catch (error) {
      console.error("Error sending contact form email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send contact form email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  }

  return new Response(JSON.stringify({ sent: true }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resend' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
