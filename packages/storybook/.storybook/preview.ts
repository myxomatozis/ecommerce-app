import type { Preview } from "@storybook/react";
import { create } from "@storybook/theming/create";
import "./styles.css";

// Custom theme following The Folk's minimalist aesthetic
const folkTheme = create({
  base: "light",
  brandTitle: "The Folk Design System",
  brandUrl: "https://thefolkproject.com",
  brandTarget: "_self",

  // Typography
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  fontCode: '"JetBrains Mono", "SF Mono", Consolas, monospace',

  // Colors - following the neutral palette
  colorPrimary: "#171717", // neutral-900
  colorSecondary: "#525252", // neutral-600

  // UI colors
  appBg: "#fafafa", // neutral-50
  appContentBg: "#ffffff",
  appBorderColor: "#e5e5e5", // neutral-200
  appBorderRadius: 8,

  // Text colors
  textColor: "#171717", // neutral-900
  textInverseColor: "#ffffff",

  // Toolbar colors
  barTextColor: "#525252", // neutral-600
  barSelectedColor: "#171717", // neutral-900
  barBg: "#ffffff",

  // Form colors
  inputBg: "#ffffff",
  inputBorder: "#d4d4d4", // neutral-300
  inputTextColor: "#171717",
  inputBorderRadius: 6,
});

const preview: Preview = {
  parameters: {
    docs: {
      theme: folkTheme,
      toc: {
        contentsSelector: ".sbdocs-content",
        headingSelector: "h1, h2, h3",
        ignoreSelector: "#primary",
        title: "Table of Contents",
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: "requiredFirst",
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "neutral-50",
          value: "#fafafa",
        },
        {
          name: "neutral-100",
          value: "#f5f5f5",
        },
        {
          name: "dark",
          value: "#171717",
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1440px",
            height: "900px",
          },
        },
      },
    },
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Introduction",
          "Design System",
          ["Overview", "Colors", "Typography", "Spacing"],
          "Components",
          [
            "Button",
            "Input",
            "Badge",
            "Card",
            "Modal",
            "Dropdown",
            "Tabs",
            "Pagination",
            "Toast",
            "Spinner",
            "Checkbox",
          ],
          "Examples",
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
