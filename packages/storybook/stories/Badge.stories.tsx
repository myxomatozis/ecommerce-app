import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Star, Tag, CheckCircle, AlertCircle, Clock, X } from "lucide-react";
import {
  Badge,
  StatusBadge,
  CountBadge,
  CategoryBadge,
  IconCounter,
} from "@thefolk/ui";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Badge component system provides versatile labeling and status indicators 
following The Folk's minimalist design principles. Built for modern applications 
with clean typography and subtle visual hierarchy.

## Badge Types
- **Base Badge**: Core component with customizable variants
- **Status Badge**: Pre-configured for common status states
- **Count Badge**: Numerical indicators with smart formatting
- **Category Badge**: Content categorization labels
- **Icon Counter**: Overlay counters for icons and avatars

## Features
- **7 variants**: Default, Primary, Secondary, Outline, Minimal, Counter, and Neutral
- **4 sizes**: From extra small to large
- **Icon support**: Left-side icons with proper spacing
- **Dot variant**: Minimal status indicators
- **Removable**: Built-in close functionality
- **Accessibility**: Proper ARIA labels and keyboard support
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "outline",
        "minimal",
        "counter",
        "neutral",
      ],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Size of the badge",
    },
    dot: {
      control: "boolean",
      description: "Render as a simple dot indicator",
    },
    icon: {
      control: false,
      description: "Icon to display on the left side",
    },
    removable: {
      control: "boolean",
      description: "Show remove button",
    },
    onRemove: {
      action: "removed",
      description: "Remove event handler",
    },
    children: {
      control: "text",
      description: "Badge content",
    },
  },
  args: {
    onRemove: fn(),
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    variant: "default",
    size: "md",
    children: "Default Badge",
  },
};

// All variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="minimal">Minimal</Badge>
      <Badge variant="counter">99</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All available badge variants showcasing the neutral color palette.",
      },
    },
  },
};

// Size variations
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-6">
      <Badge size="xs" variant="primary">
        XS
      </Badge>
      <Badge size="sm" variant="primary">
        Small
      </Badge>
      <Badge size="md" variant="primary">
        Medium
      </Badge>
      <Badge size="lg" variant="primary">
        Large
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badge sizes from extra small to large, maintaining readability at all scales.",
      },
    },
  },
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      <Badge icon={<Star size={12} />} variant="primary">
        Featured
      </Badge>
      <Badge icon={<Tag size={12} />} variant="secondary">
        Tagged
      </Badge>
      <Badge icon={<CheckCircle size={12} />} variant="outline">
        Verified
      </Badge>
      <Badge icon={<AlertCircle size={12} />} variant="minimal">
        Alert
      </Badge>
      <Badge icon={<Clock size={12} />} variant="neutral">
        Pending
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badges with icons for enhanced visual communication and context.",
      },
    },
  },
};

// Dot indicators
export const DotIndicators: Story = {
  render: () => (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">Status indicators:</span>
        <Badge dot variant="primary" size="sm" />
        <Badge dot variant="secondary" size="sm" />
        <Badge dot variant="outline" size="sm" />
        <Badge dot variant="minimal" size="sm" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">Different sizes:</span>
        <Badge dot variant="primary" size="xs" />
        <Badge dot variant="primary" size="sm" />
        <Badge dot variant="primary" size="md" />
        <Badge dot variant="primary" size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Minimal dot indicators for subtle status communication.",
      },
    },
  },
};

// Removable badges
export const RemovableBadges: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6">
      <Badge
        removable
        onRemove={() => console.log("Removed!")}
        variant="primary"
      >
        Technology
      </Badge>
      <Badge
        removable
        onRemove={() => console.log("Removed!")}
        variant="secondary"
      >
        Design
      </Badge>
      <Badge
        removable
        onRemove={() => console.log("Removed!")}
        variant="outline"
      >
        Fashion
      </Badge>
      <Badge
        removable
        onRemove={() => console.log("Removed!")}
        variant="neutral"
        icon={<Tag size={12} />}
      >
        Lifestyle
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Removable badges with close buttons for dynamic filtering and tagging.",
      },
    },
  },
};

// Status badges
export const StatusBadges: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6">
      <StatusBadge status="active" />
      <StatusBadge status="inactive" />
      <StatusBadge status="pending" />
      <StatusBadge status="completed" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pre-configured status badges for common application states.",
      },
    },
  },
};

// Count badges
export const CountBadges: Story = {
  render: () => (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-600">Standard counts:</span>
        <CountBadge count={1} />
        <CountBadge count={12} />
        <CountBadge count={99} />
        <CountBadge count={100} max={99} />
        <CountBadge count={1000} max={99} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-600">With showZero:</span>
        <CountBadge count={0} showZero />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Count badges with smart number formatting and max value handling.",
      },
    },
  },
};

// Category badges
export const CategoryBadges: Story = {
  render: () => (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-neutral-600 w-full mb-2">
          Minimal style:
        </span>
        <CategoryBadge category="Fashion" style="minimal" />
        <CategoryBadge category="Technology" style="minimal" />
        <CategoryBadge category="Art" style="minimal" />
        <CategoryBadge category="Design" style="minimal" />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-neutral-600 w-full mb-2">
          Neutral style:
        </span>
        <CategoryBadge category="Fashion" style="neutral" />
        <CategoryBadge category="Technology" style="neutral" />
        <CategoryBadge category="Art" style="neutral" />
        <CategoryBadge category="Design" style="neutral" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Category badges for content organization and filtering.",
      },
    },
  },
};

// Icon counters
export const IconCounters: Story = {
  render: () => (
    <div className="flex items-center gap-8 p-6">
      <div className="relative">
        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
          <Star size={16} className="text-neutral-600" />
        </div>
        <IconCounter count={3} size="sm" />
      </div>

      <div className="relative">
        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
          <Tag size={18} className="text-neutral-600" />
        </div>
        <IconCounter count={25} size="md" />
      </div>

      <div className="relative">
        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
          <CheckCircle size={20} className="text-neutral-600" />
        </div>
        <IconCounter count={127} max={99} size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icon overlay counters perfect for notification badges and activity indicators.",
      },
    },
  },
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-8 p-6 max-w-2xl">
      {/* Product categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900">
          Product Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="minimal" size="sm">
            Clothing
          </Badge>
          <Badge variant="minimal" size="sm">
            Accessories
          </Badge>
          <Badge variant="minimal" size="sm">
            Home & Living
          </Badge>
          <Badge variant="minimal" size="sm">
            Art & Collectibles
          </Badge>
        </div>
      </div>

      {/* Order status */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900">Order Status</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">Order #1234:</span>
            <StatusBadge status="completed" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">Order #1235:</span>
            <StatusBadge status="pending" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">Order #1236:</span>
            <StatusBadge status="active" />
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-neutral-900">
          Product Features
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" size="sm" icon={<Star size={12} />}>
            Featured
          </Badge>
          <Badge variant="secondary" size="sm">
            New Arrival
          </Badge>
          <Badge variant="outline" size="sm">
            Limited Edition
          </Badge>
          <Badge variant="neutral" size="sm">
            Sustainable
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Real-world badge usage examples from The Folk e-commerce platform.",
      },
    },
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    variant: "default",
    size: "md",
    children: "Interactive Badge",
    icon: <Tag size={12} />,
    removable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive badge with all controls available. Use the controls panel to experiment with different props.",
      },
    },
  },
};
