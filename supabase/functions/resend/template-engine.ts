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
    const ifRegex =
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g;

    return template.replace(
      ifRegex,
      (_match, condition, ifContent, elseContent = "") => {
        const value = this.getValue(condition, data);
        const isTrue = this.isTruthy(value);

        return isTrue ? ifContent : elseContent;
      }
    );
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
      if (value && typeof value === "object") {
        value = value[key];
      } else {
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

// Template loader utility
export async function loadTemplate(templateName: string): Promise<string> {
  try {
    // In Deno, we can read files directly from the filesystem
    const templatePath = `./functions/resend/${templateName}.html`;
    const template = await Deno.readTextFile(templatePath);
    return template;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`Template ${templateName} not found`);
    }
    // Handle other errors (e.g., permission issues)
    if (error instanceof Error) {
      throw new Error(
        `Failed to load template ${templateName}: ${error.message}`
      );
    }
    return Promise.reject(`Failed to load template ${templateName}`);
  }
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

  // Ensure URLs
  data.storeUrl = data.storeUrl || "https://stylehub.com";

  return data;
}

export function prepareContactFormData(variables: any): TemplateData {
  return { ...variables };
}
