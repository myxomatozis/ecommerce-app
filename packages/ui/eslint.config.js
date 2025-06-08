import { baseESLintConfig } from "@thefolk/shared-config/eslint/base";

export default [
  ...baseESLintConfig,
  {
    // UI package specific rules
    rules: {
      // Stricter rules for UI library
      "no-console": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-const": "error",

      // Component specific
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    // Ignore storybook files
    ignores: ["**/*.stories.*", "**/storybook-static/**"],
  },
];
