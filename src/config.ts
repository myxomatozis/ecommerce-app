export const config = {
  appName: import.meta.env.VITE_APP_NAME || "The Folk",
  appUrl: import.meta.env.VITE_APP_URL || "http://localhost:3000",
  storeCurrency: import.meta.env.VITE_STORE_CURRENCY || "USD",
  freeShippingThreshold: parseFloat(
    import.meta.env.VITE_STORE_FREE_SHIPPING_THRESHOLD || "50"
  ),
};
