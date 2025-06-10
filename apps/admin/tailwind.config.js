/** @type {import('tailwindcss').Config} */
export default {
  ...require("@thefolk/config/tailwind"),
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};
