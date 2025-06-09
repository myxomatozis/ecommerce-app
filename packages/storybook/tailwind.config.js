/** @type {import('tailwindcss').Config} */
export default {
  ...require("@thefolk/config/tailwind"),
  content: [
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};
