import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(config, { configType }) {
    // Try to load Tailwind v4 plugin with error handling
    let plugins: any[] = [];

    try {
      // Use dynamic import to avoid CJS/ESM issues
      const tailwindModule = await import("@tailwindcss/vite");
      const tailwindcss = tailwindModule.default || tailwindModule;
      plugins.push(tailwindcss());
      console.log("✅ Tailwind CSS v4 plugin loaded successfully");
    } catch (error) {
      console.warn(
        "⚠️ Could not load @tailwindcss/vite plugin:",
        error.message
      );
      console.log("📝 Falling back to CSS-only mode");
    }

    return mergeConfig(config, {
      plugins,
      esbuild: {
        // Automatically inject React import for JSX
        jsxInject: `import React from 'react'`,
      },
    });
  },
  docs: {
    defaultName: "Documentation",
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
