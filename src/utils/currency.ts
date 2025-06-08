import { config } from "@/config";

// Currency symbols mapping
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
};

// Currency display names
const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  JPY: "Japanese Yen",
  CHF: "Swiss Franc",
  SEK: "Swedish Krona",
  NOK: "Norwegian Krone",
  DKK: "Danish Krone",
};

// Currencies that don't use decimal places
const NO_DECIMAL_CURRENCIES = ["JPY", "KRW", "VND"];

/**
 * Format price with proper currency symbol and formatting
 */
export const formatPrice = (
  amount: number,
  currency: string = config.storeCurrency,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const {
    showSymbol = true,
    showCode = false,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;

  const currencyCode = currency.toUpperCase();
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;

  // Determine decimal places
  const useDecimals = !NO_DECIMAL_CURRENCIES.includes(currencyCode);
  const minDecimals = minimumFractionDigits ?? (useDecimals ? 2 : 0);
  const maxDecimals = maximumFractionDigits ?? (useDecimals ? 2 : 0);

  // Format the number
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });

  // Build the final string
  if (showCode) {
    return `${formattedAmount} ${currencyCode}`;
  }

  if (showSymbol) {
    // For currencies with symbol prefixes (USD, GBP, EUR)
    if (["$", "£", "€"].includes(symbol)) {
      return `${symbol}${formattedAmount}`;
    }
    // For currencies with symbol suffixes or special formatting
    return `${formattedAmount} ${symbol}`;
  }

  return formattedAmount;
};

/**
 * Get currency symbol for a given currency code
 */
export const getCurrencySymbol = (currency: string = "USD"): string => {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency.toUpperCase();
};

/**
 * Get currency display name
 */
export const getCurrencyName = (currency: string = "USD"): string => {
  return CURRENCY_NAMES[currency.toUpperCase()] || currency.toUpperCase();
};

/**
 * Format currency for forms/inputs (with proper symbol placement)
 */
export const formatCurrencyInput = (
  amount: number | string,
  currency: string = "USD"
): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "";

  return formatPrice(numAmount, currency);
};

/**
 * Parse currency string to number (removes symbols and formatting)
 */
export const parseCurrencyString = (currencyString: string): number => {
  // Remove all non-numeric characters except decimal points and minus signs
  const cleaned = currencyString.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Check if two currencies are compatible (same currency)
 */
export const areCurrenciesCompatible = (
  currency1: string,
  currency2: string
): boolean => {
  return currency1.toUpperCase() === currency2.toUpperCase();
};

/**
 * Format price range
 */
export const formatPriceRange = (
  minPrice: number,
  maxPrice: number,
  currency: string = "USD"
): string => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency);
  }
  return `${formatPrice(minPrice, currency)} - ${formatPrice(
    maxPrice,
    currency
  )}`;
};

/**
 * Format shipping cost with free shipping logic
 */
export const formatShippingCost = (
  cost: number,
  currency: string = "USD",
  freeShippingThreshold?: number
): string => {
  if (cost === 0) {
    return "Free";
  }

  if (freeShippingThreshold && cost >= freeShippingThreshold) {
    return "Free";
  }

  return formatPrice(cost, currency);
};

/**
 * Calculate and format savings
 */
export const formatSavings = (
  originalPrice: number,
  salePrice: number,
  currency: string = "USD"
): { amount: string; percentage: string } => {
  const savings = originalPrice - salePrice;
  const percentage = Math.round((savings / originalPrice) * 100);

  return {
    amount: formatPrice(savings, currency),
    percentage: `${percentage}%`,
  };
};

/**
 * Get currency-specific formatting options for Intl.NumberFormat
 */
export const getCurrencyFormatOptions = (
  currency: string = "USD"
): Intl.NumberFormatOptions => {
  const currencyCode = currency.toUpperCase();

  return {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: NO_DECIMAL_CURRENCIES.includes(currencyCode) ? 0 : 2,
    maximumFractionDigits: NO_DECIMAL_CURRENCIES.includes(currencyCode) ? 0 : 2,
  };
};

/**
 * Advanced price formatting with Intl.NumberFormat for proper localization
 */
export const formatPriceIntl = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  try {
    const options = getCurrencyFormatOptions(currency);
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (error) {
    // Fallback to manual formatting if Intl fails
    console.warn(`Failed to format currency with Intl: ${error}`);
    return formatPrice(amount, currency);
  }
};

export default {
  formatPrice,
  getCurrencySymbol,
  getCurrencyName,
  formatCurrencyInput,
  parseCurrencyString,
  areCurrenciesCompatible,
  formatPriceRange,
  formatShippingCost,
  formatSavings,
  formatPriceIntl,
  getCurrencyFormatOptions,
};
