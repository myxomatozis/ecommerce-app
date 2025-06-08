import { baseTailwindConfig } from "@thefolk/shared-config/tailwind/base";
import { folkComponentsPlugin } from "@thefolk/shared-config/tailwind/components";

/** @type {import('tailwindcss').Config} */
export default {
  ...baseTailwindConfig,
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [...baseTailwindConfig.plugins, folkComponentsPlugin],
};
