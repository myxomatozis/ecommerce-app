// supabase/functions/resend/template-engine.ts
// deno-lint-ignore-file no-explicit-any
export interface TemplateData {
  [key: string]: string | number | boolean;
}

export class TemplateEngine {
  private template: string;

  constructor(template: string) {
    this.template = template;
  }

  render(data: TemplateData): string {
    let result = this.template;

    // Process each blocks first
    result = this.processEachBlocks(result, data);

    // Process if blocks
    result = this.processIfBlocks(result, data);

    // Process simple variables
    result = this.processVariables(result, data);

    return result;
  }

  private processEachBlocks(template: string, data: TemplateData): string {
    const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return template.replace(eachRegex, (_match, arrayName, content) => {
      const array = data[arrayName];

      if (!Array.isArray(array)) {
        return "";
      }

      return array
        .map((item, index) => {
          let itemContent = content;

          // Replace item properties
          Object.keys(item).forEach((key) => {
            const value = item[key];
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
            itemContent = itemContent.replace(regex, String(value));
          });

          // Add computed properties for common use cases
          if (item.price && item.quantity) {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            itemContent = itemContent.replace(/\{\{itemTotal\}\}/g, itemTotal);
          }

          // Replace @index if needed
          itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index));

          return itemContent;
        })
        .join("");
    });
  }

  private processIfBlocks(template: string, data: TemplateData): string {
    // Process nested if blocks from innermost to outermost
    let result = template;
    let hasBlocks = true;
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (hasBlocks && iterations < maxIterations) {
      iterations++;

      // Match if blocks that don't contain other if blocks (innermost first)
      const ifRegex =
        /\{\{#if\s+([\w.]+)\}\}((?:(?!\{\{#if|\{\{\/if\}\}).)*?)(?:\{\{else\}\}((?:(?!\{\{#if|\{\{\/if\}\}).)*?))?\{\{\/if\}\}/g;

      const originalResult = result;
      result = result.replace(
        ifRegex,
        (_match, condition, ifContent, elseContent = "") => {
          const value = this.getValue(condition.trim(), data);
          const isTrue = this.isTruthy(value);

          return isTrue ? ifContent : elseContent;
        }
      );

      // Check if we made any replacements
      hasBlocks = result !== originalResult;
    }

    // If there are still unprocessed blocks after max iterations, remove them
    if (iterations >= maxIterations) {
      console.warn(
        "Max iterations reached for if block processing. Some blocks may be unprocessed."
      );
      // Remove any remaining unprocessed blocks
      result = result.replace(/\{\{#if\s+[\w.]+\}\}[\s\S]*?\{\{\/if\}\}/g, "");
    }

    return result;
  }

  private processVariables(template: string, data: TemplateData): string {
    const variableRegex = /\{\{([^#\/][^}]*)\}\}/g;

    return template.replace(variableRegex, (_match, path) => {
      const value = this.getValue(path.trim(), data);
      return String(value ?? "");
    });
  }

  private getValue(path: string, data: TemplateData) {
    const keys = path.split(".");
    let value: any = data;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        console.log(
          `Path ${path} not found at key ${key}. Available keys:`,
          Object.keys(value || {})
        );
        return undefined;
      }
    }

    return value;
  }

  private isTruthy(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return Boolean(value);
  }
}

// Enhanced template loader with multiple path resolution strategies
export async function loadTemplate(templateName: string): Promise<string> {
  const possiblePaths = [
    // Current working directory (development)
    `./${templateName}.html`,
    `${templateName}.html`,

    // Original paths
    `./functions/resend/${templateName}.html`,
    `/functions/resend/${templateName}.html`,

    // Edge Functions runtime paths
    `./resend/${templateName}.html`,
    `/resend/${templateName}.html`,

    // Absolute from bundle root
    `/${templateName}.html`,

    // Current directory relative
    `resend/${templateName}.html`,
  ];

  let lastError: Error | null = null;

  // Try each possible path
  for (const templatePath of possiblePaths) {
    try {
      console.log(`Attempting to load template from: ${templatePath}`);
      const template = await Deno.readTextFile(templatePath);
      console.log(`Successfully loaded template from: ${templatePath}`);
      return template;
    } catch (error) {
      lastError = error as Error;
      console.log(
        `Failed to load from ${templatePath}:`,
        error instanceof Error ? error.message : error
      );
      continue;
    }
  }

  // If all paths failed, provide debugging information
  console.error("All template paths failed. Debugging info:");
  console.error("Current working directory:", Deno.cwd());

  try {
    // List files in current directory
    const currentDirFiles = [];
    for await (const dirEntry of Deno.readDir(".")) {
      currentDirFiles.push(dirEntry.name);
    }
    console.error("Files in current directory:", currentDirFiles);
  } catch (dirError) {
    console.error("Cannot read current directory:", dirError);
  }

  throw new Error(
    `Template ${templateName} not found in any of the expected locations. ` +
      `Tried paths: ${possiblePaths.join(", ")}. ` +
      `Last error: ${lastError?.message || "Unknown error"}`
  );
}

// Template data processors for different types
export function prepareOrderConfirmationData(variables: any): TemplateData {
  const data = { ...variables };

  // Add computed properties
  data.hasShipping = parseFloat(data.shipping || "0") > 0;

  // Process items to add computed totals
  if (data.items && Array.isArray(data.items)) {
    data.items = data.items.map((item: any) => ({
      ...item,
      itemTotal: (item.price * item.quantity).toFixed(2),
      price: item.price.toFixed(2),
    }));
  }

  // Process shipping address to ensure proper structure
  if (data.shippingAddress && typeof data.shippingAddress === "object") {
    data.shippingAddress = {
      line1: data.shippingAddress.line1 || "",
      line2: data.shippingAddress.line2 || "",
      city: data.shippingAddress.city || "",
      state: data.shippingAddress.state || "",
      postalCode:
        data.shippingAddress.postalCode ||
        data.shippingAddress.postal_code ||
        "",
      country: data.shippingAddress.country || "",
    };
  }

  // Ensure numeric values are properly formatted
  if (data.subtotal && typeof data.subtotal === "string") {
    data.subtotal = parseFloat(data.subtotal).toFixed(2);
  }
  if (data.shipping && typeof data.shipping === "string") {
    data.shipping = parseFloat(data.shipping).toFixed(2);
  }
  if (data.tax && typeof data.tax === "string") {
    data.tax = parseFloat(data.tax).toFixed(2);
  }
  if (data.total && typeof data.total === "string") {
    data.total = parseFloat(data.total).toFixed(2);
  }

  // Ensure URLs
  data.storeUrl = data.storeUrl || "https://thefolkproject.com";

  console.log("Processed template data:", {
    hasShipping: data.hasShipping,
    shippingAddress: data.shippingAddress,
    itemsCount: data.items?.length || 0,
    totals: {
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      total: data.total,
    },
  });

  return data;
}

export function prepareContactFormData(variables: any): TemplateData {
  return { ...variables };
}
