import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Heart, Download, ArrowRight, Plus, Search } from "lucide-react";
import { Button, type ButtonProps } from "@thefolk/ui";

const meta: Meta<ButtonProps> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Button component is the foundation of user interactions in The Folk design system. 
Built with modern aesthetics in mind, it supports multiple variants, sizes, and states 
while maintaining accessibility and performance.

## Features
- **6 variants**: Primary, Secondary, Outline, Ghost, Minimal, and Text
- **4 sizes**: Extra small (xs), Small (sm), Medium (md), and Large (lg)
- **Loading states**: Built-in spinner with smooth transitions
- **Icon support**: Left and right icon positions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Polymorphic**: Can render as different HTML elements or React Router Links
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "minimal", "text"],
      description: "Visual style variant of the button",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Size of the button",
    },
    isLoading: {
      control: "boolean",
      description: "Show loading spinner and disable interaction",
    },
    fullWidth: {
      control: "boolean",
      description: "Make button take full width of container",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
    },
    leftIcon: {
      control: false,
      description: "Icon to display on the left side",
    },
    rightIcon: {
      control: false,
      description: "Icon to display on the right side",
    },
    children: {
      control: "text",
      description: "Button content",
    },
    onClick: {
      action: "clicked",
      description: "Click event handler",
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Button",
  },
};

// Variant showcase
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="minimal">Minimal</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All available button variants showcasing The Folk's minimalist design philosophy.",
      },
    },
  },
};

// Size showcase
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4 p-6">
      <Button size="xs" variant="primary">
        Extra Small
      </Button>
      <Button size="sm" variant="primary">
        Small
      </Button>
      <Button size="md" variant="primary">
        Medium
      </Button>
      <Button size="lg" variant="primary">
        Large
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Button sizes from extra small to large, maintaining consistent visual hierarchy.",
      },
    },
  },
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6">
      <Button leftIcon={<Plus size={16} />}>Add Item</Button>
      <Button rightIcon={<ArrowRight size={16} />}>Continue</Button>
      <Button leftIcon={<Download size={16} />} variant="secondary">
        Download
      </Button>
      <Button rightIcon={<Search size={16} />} variant="outline">
        Search
      </Button>
      <Button leftIcon={<Heart size={16} />} variant="ghost">
        Like
      </Button>
      <Button rightIcon={<ArrowRight size={16} />} variant="minimal">
        Learn More
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Buttons with icons on the left or right side, perfect for enhanced user experience.",
      },
    },
  },
};

// Loading states
export const LoadingStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      <Button isLoading variant="primary">
        Saving...
      </Button>
      <Button isLoading variant="secondary">
        Loading...
      </Button>
      <Button isLoading variant="outline">
        Processing...
      </Button>
      <Button isLoading variant="ghost">
        Uploading...
      </Button>
      <Button isLoading variant="minimal" leftIcon={<Download size={16} />}>
        Downloading...
      </Button>
      <Button isLoading size="lg">
        Please wait...
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Loading states with smooth spinner animations that replace content gracefully.",
      },
    },
  },
};

// Disabled states
export const DisabledStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
      <Button disabled variant="minimal">
        Minimal
      </Button>
      <Button disabled variant="text">
        Text
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled button states with reduced opacity and cursor changes.",
      },
    },
  },
};

// Full width
export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-3 p-6">
      <Button fullWidth variant="primary">
        Primary Full Width
      </Button>
      <Button fullWidth variant="secondary" leftIcon={<Plus size={16} />}>
        Add to Cart
      </Button>
      <Button fullWidth variant="outline" rightIcon={<ArrowRight size={16} />}>
        Continue Shopping
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full-width buttons ideal for forms, modals, and mobile interfaces.",
      },
    },
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Click me",
    leftIcon: <Heart size={16} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive button with all controls available. Use the controls panel to experiment with different props.",
      },
    },
  },
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-2xl">
      {/* E-commerce actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900">
          E-commerce Actions
        </h3>
        <div className="flex gap-3">
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            Add to Cart
          </Button>
          <Button variant="secondary">Save for Later</Button>
          <Button variant="ghost" leftIcon={<Heart size={16} />}>
            Wishlist
          </Button>
        </div>
      </div>

      {/* Form actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900">Form Actions</h3>
        <div className="flex gap-3">
          <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
            Continue
          </Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900">Navigation</h3>
        <div className="flex gap-3">
          <Button variant="minimal" rightIcon={<ArrowRight size={16} />}>
            Learn More
          </Button>
          <Button variant="text">Skip for now</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Real-world button usage examples showing common patterns in The Folk applications.",
      },
    },
  },
};
