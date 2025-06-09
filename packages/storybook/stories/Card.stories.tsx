import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@thefolk/ui";
import type { CardProps } from "@thefolk/ui";
import {
  Heart,
  Star,
  ShoppingCart,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  ExternalLink,
} from "lucide-react";

const meta: Meta<CardProps> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `
# Card Component

The Card component is a flexible container for organizing related content. Built with modern design principles, it provides multiple variants to suit different contexts while maintaining The Folk's minimalist aesthetic.

## Design Philosophy

**Clean Containers**: Cards create organized spaces for content without visual clutter  
**Purposeful Variants**: Each variant serves specific use cases, from subtle displays to interactive elements  
**Modern Interactions**: Hover effects and transitions feel responsive and alive  
**Content-First**: Design elements support and enhance content rather than competing with it

## When to Use

- **Product Displays**: Showcase items with consistent formatting
- **Feature Highlights**: Present key information in digestible chunks  
- **Interactive Elements**: Create clickable areas for navigation or actions
- **Content Organization**: Group related information visually
- **Dashboard Widgets**: Display metrics and data in contained spaces

## Variants

- **Default**: Standard card with subtle border and shadow
- **Outlined**: Clean border-only style for minimal layouts
- **Minimal**: Borderless design that integrates seamlessly
- **Elevated**: Enhanced shadow for emphasis and hierarchy
- **Interactive**: Hover effects and cursor changes for clickable cards
- **Brutalist**: Bold borders for striking, geometric designs
        `,
      },
    },
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outlined",
        "minimal",
        "elevated",
        "interactive",
        "brutalist",
      ],
      description: "Visual style variant",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Internal padding size",
    },
    hover: {
      control: "boolean",
      description: "Enable hover effects",
    },
    border: {
      control: "select",
      options: ["none", "subtle", "visible", "bold"],
      description: "Border style",
    },
  },
};

export default meta;
type Story = StoryObj<CardProps>;

// Basic Examples
export const Default: Story = {
  args: {
    variant: "default",
    padding: "md",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description that provides context about the card content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600">
          Card content goes here. This is where you would place the main
          information or interactive elements.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  args: {
    variant: "default",
    padding: "md",
  },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Complete Card</CardTitle>
        <CardDescription>
          Includes header, content, and footer sections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600">
          This card demonstrates all available sections working together.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Continue
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Variant Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <Card variant="default">
        <CardHeader>
          <CardTitle size="sm">Default</CardTitle>
          <CardDescription size="sm">
            Standard card with subtle shadow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Perfect for general content display
          </p>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle size="sm">Outlined</CardTitle>
          <CardDescription size="sm">Clean border-only design</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Minimal and modern aesthetic
          </p>
        </CardContent>
      </Card>

      <Card variant="minimal">
        <CardHeader>
          <CardTitle size="sm">Minimal</CardTitle>
          <CardDescription size="sm">Borderless and subtle</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Seamless integration with layouts
          </p>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle size="sm">Elevated</CardTitle>
          <CardDescription size="sm">
            Enhanced shadow for emphasis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">Creates visual hierarchy</p>
        </CardContent>
      </Card>

      <Card variant="interactive" hover>
        <CardHeader>
          <CardTitle size="sm">Interactive</CardTitle>
          <CardDescription size="sm">
            Hover effects and transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">For clickable elements</p>
        </CardContent>
      </Card>

      <Card variant="brutalist">
        <CardHeader>
          <CardTitle size="sm">Brutalist</CardTitle>
          <CardDescription size="sm">Bold and geometric</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Statement design for impact
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

// Real-world Examples
export const ProductCard: Story = {
  render: () => (
    <Card variant="interactive" hover className="max-w-sm group">
      <CardContent padding="none">
        <div className="aspect-square bg-neutral-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
            <span className="text-neutral-500 text-sm">Product Image</span>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" size="sm">
              New
            </Badge>
          </div>
          <button className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart size={16} className="text-neutral-600" />
          </button>
        </div>
        <div className="p-4">
          <CardTitle size="sm" className="mb-2">
            Minimalist Tote Bag
          </CardTitle>
          <CardDescription size="sm" className="mb-3">
            Sustainable canvas with leather handles
          </CardDescription>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-neutral-900">$89</span>
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-sm text-neutral-600">4.8 (24)</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter variant="minimal">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          leftIcon={<ShoppingCart size={16} />}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const FeatureCard: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-md">
      <CardHeader>
        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
          <TrendingUp size={24} className="text-neutral-700" />
        </div>
        <CardTitle>Analytics & Insights</CardTitle>
        <CardDescription>
          Track your progress with detailed analytics and actionable insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Monthly Growth</span>
            <span className="text-sm font-medium text-green-600">+24%</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Active Users</span>
            <span className="text-sm font-medium">2,847</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-neutral-600">Conversion Rate</span>
            <span className="text-sm font-medium text-blue-600">3.2%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight size={16} />}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const EventCard: Story = {
  render: () => (
    <Card variant="outlined" className="max-w-md">
      <CardHeader spacing="tight">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle size="lg">Design Workshop</CardTitle>
            <CardDescription className="mt-1">
              Learn modern design principles and tools
            </CardDescription>
          </div>
          <Badge variant="primary" size="sm">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent spacing="normal">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <Calendar size={16} className="mr-2" />
            March 15, 2025 • 2:00 PM - 5:00 PM
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin size={16} className="mr-2" />
            The Folk Studio, London
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Users size={16} className="mr-2" />
            12 / 20 attendees
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 bg-neutral-200 rounded-full border-2 border-white flex items-center justify-center"
              >
                <span className="text-xs text-neutral-600">{i}</span>
              </div>
            ))}
            <div className="w-8 h-8 bg-neutral-800 text-white rounded-full border-2 border-white flex items-center justify-center text-xs">
              +8
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter justify="between">
        <span className="text-lg font-medium">£45</span>
        <Button variant="primary" size="sm">
          Join Event
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const TestimonialCard: Story = {
  render: () => (
    <Card variant="minimal" className="max-w-lg">
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <blockquote className="text-neutral-700 mb-4">
              "The Folk's design system has transformed how we approach UI
              development. Clean, modern, and incredibly easy to work with."
            </blockquote>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-900">Sarah Chen</div>
                <div className="text-sm text-neutral-500">
                  Lead Designer at Acme
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="text-yellow-500 fill-current"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <Card variant="elevated" className="max-w-sm">
      <CardContent>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} className="text-blue-600" />
          </div>
          <CardTitle size="2xl" className="mb-2">
            2,847
          </CardTitle>
          <CardDescription className="mb-4">
            Total projects completed this month
          </CardDescription>
          <div className="flex items-center justify-center text-sm text-green-600">
            <TrendingUp size={16} className="mr-1" />
            +12% from last month
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const ArticleCard: Story = {
  render: () => (
    <Card variant="interactive" hover className="max-w-md group">
      <CardContent padding="none">
        <div className="aspect-video bg-neutral-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
            <span className="text-white text-sm">Article Image</span>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="default" size="sm">
              Design
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-neutral-500 mb-3">
            <Clock size={14} className="mr-1" />5 min read • March 10, 2025
          </div>
          <CardTitle className="mb-3 group-hover:text-blue-600 transition-colors">
            The Future of Minimalist Design
          </CardTitle>
          <CardDescription className="mb-4">
            Exploring how minimalism continues to evolve in 2025, with new
            approaches to clean, functional interfaces.
          </CardDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-neutral-200 rounded-full"></div>
              <span className="text-sm text-neutral-600">Alex Johnson</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ExternalLink size={14} />}
            >
              Read More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Layout Examples
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
      {[
        {
          title: "Total Revenue",
          value: "$124K",
          change: "+12%",
          positive: true,
        },
        {
          title: "Active Users",
          value: "8,429",
          change: "+24%",
          positive: true,
        },
        {
          title: "Conversion Rate",
          value: "3.2%",
          change: "-0.4%",
          positive: false,
        },
        {
          title: "Avg. Order Value",
          value: "$89",
          change: "+8%",
          positive: true,
        },
      ].map((stat, index) => (
        <Card key={index} variant="default">
          <CardContent>
            <div className="text-center">
              <CardTitle size="2xl" className="mb-2">
                {stat.value}
              </CardTitle>
              <CardDescription className="mb-3">{stat.title}</CardDescription>
              <div
                className={`text-sm font-medium ${
                  stat.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// Interactive Examples
export const InteractiveCards: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        Hover over these cards to see interactions
      </h3>

      <Card variant="interactive" hover className="group">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle size="sm" className="mb-1">
                Hover Effect
              </CardTitle>
              <CardDescription size="sm">
                This card lifts slightly on hover with smooth transitions
              </CardDescription>
            </div>
            <ArrowRight
              size={20}
              className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all"
            />
          </div>
        </CardContent>
      </Card>

      <Card variant="outlined" className="group cursor-pointer">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle size="sm" className="mb-1">
                Click Action
              </CardTitle>
              <CardDescription size="sm">
                Border changes color and background shifts on hover
              </CardDescription>
            </div>
            <div className="w-3 h-3 rounded-full bg-neutral-300 group-hover:bg-blue-500 transition-colors"></div>
          </div>
        </CardContent>
      </Card>

      <Card variant="brutalist" className="group cursor-pointer">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle size="sm" className="mb-1">
                Brutalist Style
              </CardTitle>
              <CardDescription size="sm">
                Bold shadow effect appears on hover for dramatic impact
              </CardDescription>
            </div>
            <Star
              size={20}
              className="text-neutral-900 group-hover:fill-current transition-all"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
