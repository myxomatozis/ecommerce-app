import { loadStripe } from "@stripe/stripe-js";

const stripePubKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePubKey) {
  throw new Error(
    "Stripe publishable key is not defined in environment variables."
  );
}

export const stripe = async () =>
  await loadStripe(stripePubKey, {
    // Optional: You can specify additional options here if needed
    // For example, you can set the locale or other configurations
    // locale: 'en',
  });
