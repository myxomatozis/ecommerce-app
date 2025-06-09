import type { Preview } from "@storybook/react";
import "./styles.css"; // Import the Tailwind styles

const preview: Preview = {
  parameters: {
    docs: {
      description: {
        component:
          "The Folk Design System - Modern minimalist components for 2025",
      },
    },
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
