import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  Heart,
  Share,
  MoreHorizontal,
  Star,
  ShoppingCart,
  Eye,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  type CardProps,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@thefolk/ui";

const meta: Meta<CardProps> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Card component provides a flexible foundation for displaying grouped content 
in The Folk design system. Built with a modular approach using composition patterns 
for maximum flexibility while maintaining consistent visual hierarchy.

## Card Composition
- **Card**: Main container with elevation and styling
- **CardHeader**: Header section with optional actions
- **CardTitle**: Primary heading with size variants
- **CardDescription**: Secondary text with muted styling
- **CardContent**: Main content area with spacing controls
- **CardFooter**: Action area with layout options

## Features
- **Multiple variants**: Default, Bordered, Elevated, Minimal, and Interactive
- **Flexible sizing**: From compact to spacious layouts
- **Hover effects**: Smooth transitions for interactive cards
- **Modular composition**: Mix and match components as needed
- **Responsive design**: Mobile-first approach with adaptive layouts
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "elevated", "minimal", "interactive"],
      description: "Visual style variant",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Internal padding",
    },
    onClick: {
      action: "clicked",
      description: "Click event handler for interactive cards",
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>
          A simple card with header and content sections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600">
          This is the main content area of the card. It can contain any type of
          content including text, images, forms, or other components.
        </p>
      </CardContent>
    </Card>
  ),
};

// All variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl">
      <Card variant="default" className="w-full">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Standard card with subtle styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Clean and minimal design perfect for most use cases.
          </p>
        </CardContent>
      </Card>

      <Card variant="outlined" className="w-full">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Card with defined outline</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Clear visual separation with outlined styling.
          </p>
        </CardContent>
      </Card>

      <Card variant="elevated" className="w-full">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Card with shadow elevation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Elevated appearance with subtle shadow effects.
          </p>
        </CardContent>
      </Card>

      <Card variant="minimal" className="w-full">
        <CardHeader>
          <CardTitle>Minimal</CardTitle>
          <CardDescription>Ultra-clean minimal design</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Absolutely minimal styling for maximum content focus.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All available card variants showcasing different levels of visual prominence.",
      },
    },
  },
};

// Interactive cards
export const InteractiveCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-4xl">
      <Card variant="interactive" className="w-full cursor-pointer">
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Hover to see the effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            This card responds to hover and click interactions with smooth
            animations.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="minimal" rightIcon={<ArrowRight size={16} />}>
            Learn More
          </Button>
        </CardFooter>
      </Card>

      <Card variant="interactive" className="w-full cursor-pointer">
        <CardHeader>
          <CardTitle>Clickable Content</CardTitle>
          <CardDescription>Full card is clickable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <Star size={20} className="text-neutral-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">Featured Item</p>
              <p className="text-sm text-neutral-600">
                Click anywhere to select
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive cards with hover effects and click handlers for enhanced user experience.",
      },
    },
  },
};

// With actions
export const WithActions: Story = {
  render: () => (
    <Card className="w-80" variant="outlined">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Card</CardTitle>
          <CardDescription>With header actions</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Heart size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Share size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-neutral-100 rounded-lg mb-4 flex items-center justify-center">
          <Eye size={24} className="text-neutral-400" />
        </div>
        <p className="text-neutral-600">
          A beautiful product with multiple action options in the header.
        </p>
      </CardContent>
      <CardFooter justify="between">
        <span className="text-lg font-semibold text-neutral-900">$299</span>
        <Button variant="primary" leftIcon={<ShoppingCart size={16} />}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Card with action buttons in the header and footer for e-commerce use cases.",
      },
    },
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card variant="outlined" className="w-full">
        <CardHeader>
          <CardTitle size="sm">Small Card</CardTitle>
          <CardDescription size="sm">Compact layout</CardDescription>
        </CardHeader>
        <CardContent padding="sm">
          <p className="text-sm text-neutral-600">
            Perfect for sidebars and tight layouts.
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle size="md">Medium Card</CardTitle>
          <CardDescription size="md">Standard layout</CardDescription>
        </CardHeader>
        <CardContent padding="md">
          <p className="text-neutral-600">
            The default size for most use cases.
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle size="lg">Large Card</CardTitle>
          <CardDescription size="lg">Spacious layout</CardDescription>
        </CardHeader>
        <CardContent padding="lg">
          <p className="text-neutral-600">
            Extra space for detailed content and complex layouts.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Card sizes from small to large with appropriate spacing and typography scaling.",
      },
    },
  },
};

// Complex content
export const ComplexContent: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl">
      {/* Product showcase card */}
      <Card variant="elevated" className="w-full">
        <CardContent padding="none">
          <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
            <Eye size={32} className="text-neutral-400" />
          </div>
        </CardContent>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Minimalist Ceramic Vase</CardTitle>
              <CardDescription>Handcrafted by local artisans</CardDescription>
            </div>
            <Badge variant="primary" size="sm">
              New
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-sm text-neutral-600">(4.9)</span>
          </div>
          <p className="text-neutral-600 text-sm">
            A beautiful handcrafted ceramic vase that embodies The Folk's
            minimalist aesthetic.
          </p>
        </CardContent>
        <CardFooter justify="between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-neutral-900">$89</span>
            <span className="text-sm text-neutral-500 line-through">$120</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Heart size={16} />
            </Button>
            <Button variant="primary" size="sm">
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Article card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
            <div>
              <p className="font-medium text-neutral-900">Sarah Chen</p>
              <p className="text-sm text-neutral-600">Design Director</p>
            </div>
          </div>
          <CardTitle>The Future of Minimalist Design</CardTitle>
          <CardDescription>
            Exploring the intersection of simplicity and functionality in modern
            design.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-neutral-100 rounded-lg mb-4 flex items-center justify-center">
            <Eye size={24} className="text-neutral-400" />
          </div>
          <p className="text-neutral-600 text-sm mb-4">
            In today's fast-paced digital world, minimalist design has emerged
            as more than just an aesthetic choice...
          </p>
          <div className="flex gap-2">
            <Badge variant="minimal" size="xs">
              Design
            </Badge>
            <Badge variant="minimal" size="xs">
              Minimalism
            </Badge>
            <Badge variant="minimal" size="xs">
              UX
            </Badge>
          </div>
        </CardContent>
        <CardFooter justify="between">
          <span className="text-sm text-neutral-500">5 min read</span>
          <Button variant="minimal" rightIcon={<ArrowRight size={16} />}>
            Read More
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complex card layouts showcasing product and content presentation patterns.",
      },
    },
  },
};

// Footer variants
export const FooterVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Default Footer</CardTitle>
          <CardDescription>Standard footer styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Content with default footer separation.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="primary">Action</Button>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Minimal Footer</CardTitle>
          <CardDescription>Clean minimal separation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Content with minimal footer styling.
          </p>
        </CardContent>
        <CardFooter variant="minimal">
          <Button variant="outline">Action</Button>
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bordered Footer</CardTitle>
          <CardDescription>Clear visual separation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600">
            Content with bordered footer styling.
          </p>
        </CardContent>
        <CardFooter variant="bordered">
          <Button variant="secondary">Action</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different footer variants showing various levels of visual separation.",
      },
    },
  },
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-4xl">
      <h3 className="text-xl font-semibold text-neutral-900 mb-6">
        The Folk E-commerce Cards
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product grid card */}
        <Card variant="interactive" className="w-full cursor-pointer">
          <CardContent padding="none">
            <div className="aspect-square bg-neutral-100 flex items-center justify-center">
              <Eye size={24} className="text-neutral-400" />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle size="sm">Organic Cotton Tee</CardTitle>
            <CardDescription size="sm">Sustainable basics</CardDescription>
          </CardHeader>
          <CardFooter justify="between" variant="minimal">
            <span className="font-semibold text-neutral-900">$45</span>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-xs text-neutral-600">4.8</span>
            </div>
          </CardFooter>
        </Card>

        {/* Collection card */}
        <Card className="w-full">
          <CardContent padding="none">
            <div className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-200 flex items-center justify-center">
              <Eye size={24} className="text-neutral-400" />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle size="sm">Spring Collection</CardTitle>
            <CardDescription size="sm">Fresh minimalist pieces</CardDescription>
          </CardHeader>
          <CardFooter variant="minimal">
            <Button
              variant="minimal"
              fullWidth
              rightIcon={<ArrowRight size={16} />}
            >
              Explore Collection
            </Button>
          </CardFooter>
        </Card>

        {/* Feature card */}
        <Card variant="elevated" className="w-full">
          <CardHeader>
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-3">
              <Heart size={20} className="text-neutral-600" />
            </div>
            <CardTitle size="sm">Sustainability Promise</CardTitle>
            <CardDescription size="sm">
              Every purchase plants a tree and supports local artisans.
            </CardDescription>
          </CardHeader>
          <CardFooter variant="minimal">
            <Button variant="text" size="sm">
              Learn More →
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Real-world card examples from The Folk e-commerce platform showing product, collection, and feature presentations.",
      },
    },
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    variant: "default",
    size: "md",
    padding: "md",
  },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>
          Use the controls panel to experiment with different card
          configurations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600">
          This card will update as you change the controls. Try different
          variants, sizes, and padding options to see how they affect the
          appearance.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Sample Action</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive card with all controls available for experimentation.",
      },
    },
  },
};
