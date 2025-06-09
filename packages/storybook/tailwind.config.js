/** @type {import('tailwindcss').Config} */
export default {
  // Extend the shared config
  ...require("@thefolk/config/tailwind"),

  content: [
    // Storybook files
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",

    // UI package source files - this is crucial for Tailwind to see the classes
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",

    // Also scan built files just in case
    "./node_modules/@thefolk/ui/**/*.{js,mjs}",
  ],
};
