// supabase/functions/resend/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "resend";
import {
  TemplateEngine,
  loadTemplate,
  prepareOrderConfirmationData,
  prepareContactFormData,
  TemplateData,
} from "./template-engine.ts";

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

type TemplateId = "order-confirmation" | "contact-form";

type RequestBody = {
  templateId: TemplateId;
  to?: string | string[];
  variables: TemplateData;
  from?: string;
  subject?: string;
};

// Template configuration
const templateConfig = {
  "order-confirmation": {
    fileName: "order-confirmation",
    dataProcessor: prepareOrderConfirmationData,
    getSubject: (vars: TemplateData) =>
      `Order Confirmation #${vars.orderNumber}`,
    getDefaultTo: (vars: TemplateData) => vars.customerEmail,
  },
  "contact-form": {
    fileName: "contact-form",
    dataProcessor: prepareContactFormData,
    getSubject: (vars: TemplateData) =>
      `Contact Form: ${vars.subject || "New Message"}`,
    getDefaultTo: () => "info@thefolkproject.com",
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { templateId, to, variables, from, subject }: RequestBody =
      await req.json();

    // Validate required fields
    if (!templateId || !variables) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: templateId, variables",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get template configuration
    const config = templateConfig[templateId];
    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unknown template: ${templateId}` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Load HTML template
    const htmlTemplate = await loadTemplate(config.fileName);

    // Prepare template data
    const templateData = config.dataProcessor(variables);

    // Render template
    const engine = new TemplateEngine(htmlTemplate);
    const renderedHtml = engine.render(templateData);

    // Prepare email data
    const emailTo = to || config.getDefaultTo(variables);
    const emailSubject = subject || config.getSubject(variables);
    const emailFrom = from || "The Folk <info@thefolkproject.com>";

    // Send email
    const result = await resend.emails.send({
      from: emailFrom,
      to: Array.isArray(emailTo) ? emailTo : [emailTo as string],
      subject: emailSubject,
      html: renderedHtml,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          details: result.error,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Email sent successfully: ${templateId} to ${emailTo}`);

    return new Response(
      JSON.stringify({
        sent: true,
        messageId: result.data?.id,
        templateId,
        to: emailTo,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing email request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
