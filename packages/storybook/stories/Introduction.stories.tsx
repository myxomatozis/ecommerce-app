import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
} from "@thefolk/ui";
import { Heart, Star, Search, Filter, ArrowRight } from "lucide-react";

const meta: Meta = {
  title: "Introduction",
  parameters: {
    docs: {
      description: {
        component: `
# The Folk Design System

Welcome to The Folk Design System – a modern, minimalist component library built for contemporary digital experiences. Inspired by the principles of clean design, sustainability, and human-centered interaction, our system empowers teams to create beautiful, accessible, and performant user interfaces.

## Design Philosophy

**Minimalism with Purpose**  
Every element serves a function. We eliminate visual noise while preserving meaning and usability.

**Neutral Excellence**  
Our carefully crafted neutral color palette creates timeless designs that focus attention on content and user tasks.

**Modern Typography**  
Clean, readable typography that scales beautifully across devices and maintains accessibility standards.

**Sustainable Design**  
Built with performance in mind, reducing digital carbon footprint through efficient code and optimized assets.

## Key Features

- **🎨 Modern Aesthetic**: Following 2025 design trends with clean lines and subtle interactions
- **♿ Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support  
- **📱 Responsive by Default**: Mobile-first approach with fluid layouts
- **⚡ Performance Optimized**: Lightweight components with minimal bundle impact
- **🔧 Developer Experience**: TypeScript-first with comprehensive documentation
- **🎭 Flexible Theming**: Easily customizable with CSS variables and Tailwind CSS

## Component Categories

### Foundation
- **Colors**: Neutral palette with semantic color tokens
- **Typography**: Inter font family with consistent sizing scales
- **Spacing**: 8px grid system for consistent layouts
- **Shadows**: Subtle elevation system for depth

### Interactive Components
- **Buttons**: 6 variants from minimal to primary actions
- **Inputs**: Form controls with validation states
- **Dropdowns**: Accessible selection components
- **Tabs**: Navigation and content organization

### Data Display
- **Cards**: Flexible content containers
- **Badges**: Status and category indicators
- **Tables**: (Coming soon) Data presentation
- **Lists**: (Coming soon) Organized content display

### Feedback
- **Toasts**: Non-intrusive notifications
- **Modals**: Focused task completion
- **Spinners**: Loading state indicators
- **Progress**: (Coming soon) Task completion feedback

### Navigation
- **Breadcrumbs**: (Coming soon) Hierarchical navigation
- **Pagination**: Content navigation controls
- **Menus**: (Coming soon) Action organization

## Getting Started

\`\`\`bash
# Install the package
npm install @thefolk/ui

# Import components
import { Button, Card, Badge } from '@thefolk/ui';
\`\`\`

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Accessibility**: Full keyboard navigation and screen reader support

---

*Built with ❤️ for The Folk Project – where minimalism meets functionality.*
        `,
      },
    },
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component showcase
export const ComponentShowcase: Story = {
  render: () => (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-neutral-50 to-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            The Folk
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            A modern design system built for minimalist e-commerce experiences.
            Clean, accessible, and beautifully crafted.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              Explore Components
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Component Preview Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
          Component Library
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Buttons Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                6 variants with loading states and icon support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="primary" size="sm" fullWidth>
                  Primary
                </Button>
                <Button variant="secondary" size="sm" fullWidth>
                  Secondary
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  Outline
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  leftIcon={<Heart size={14} />}
                >
                  With Icon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Status indicators and content labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">Featured</Badge>
                  <Badge variant="secondary">New</Badge>
                  <Badge variant="outline">Limited</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="minimal">Minimal</Badge>
                  <Badge variant="counter">99+</Badge>
                  <Badge dot variant="primary" />
                  <span className="text-sm text-neutral-600">Status dot</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forms Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Form Controls</CardTitle>
              <CardDescription>
                Accessible inputs with validation states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  placeholder="Search products..."
                  leftIcon={<Search size={16} />}
                />
                <Input
                  placeholder="Filter by category"
                  rightIcon={<Filter size={16} />}
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm">
                    Apply
                  </Button>
                  <Button variant="ghost" size="sm">
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Card Example */}
          <Card variant="elevated" className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Real-World Example: Product Card</CardTitle>
              <CardDescription>
                How components work together in The Folk e-commerce platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Organic Cotton Tee",
                    price: "$45",
                    rating: "4.9",
                    badge: "New",
                  },
                  {
                    name: "Linen Dress",
                    price: "$89",
                    rating: "4.8",
                    badge: "Featured",
                  },
                  {
                    name: "Wool Sweater",
                    price: "$125",
                    rating: "4.7",
                    badge: "Limited",
                  },
                  {
                    name: "Denim Jacket",
                    price: "$95",
                    rating: "4.9",
                    badge: "Sale",
                  },
                ].map((product, index) => (
                  <Card
                    key={index}
                    variant="interactive"
                    className="cursor-pointer"
                  >
                    <CardContent padding="none">
                      <div className="aspect-square bg-neutral-100 flex items-center justify-center">
                        <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                      </div>
                    </CardContent>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle size="sm">{product.name}</CardTitle>
                        <Badge variant="primary" size="xs">
                          {product.badge}
                        </Badge>
                      </div>
                      <CardDescription size="sm">
                        Sustainable fashion
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900">
                          {product.price}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star
                            size={12}
                            className="text-yellow-400 fill-current"
                          />
                          <span className="text-xs text-neutral-600">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-neutral-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
            Built for Modern Development
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="minimal" className="text-center">
              <CardContent>
                <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle size="sm" className="mb-3">
                  Performance First
                </CardTitle>
                <p className="text-neutral-600 text-sm">
                  Optimized components with minimal bundle size and fast render
                  times.
                </p>
              </CardContent>
            </Card>

            <Card variant="minimal" className="text-center">
              <CardContent>
                <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">♿</span>
                </div>
                <CardTitle size="sm" className="mb-3">
                  Accessibility Built-in
                </CardTitle>
                <p className="text-neutral-600 text-sm">
                  WCAG 2.1 AA compliant with full keyboard navigation and screen
                  reader support.
                </p>
              </CardContent>
            </Card>

            <Card variant="minimal" className="text-center">
              <CardContent>
                <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <CardTitle size="sm" className="mb-3">
                  Design System
                </CardTitle>
                <p className="text-neutral-600 text-sm">
                  Consistent design tokens and patterns for cohesive user
                  experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Color Palette Preview */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">
          Neutral Color Palette
        </h2>

        <Card>
          <CardHeader>
            <CardTitle>Neutral Grays</CardTitle>
            <CardDescription>
              Our carefully crafted neutral palette provides the foundation for
              all components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {[
                { color: "bg-neutral-50", name: "50", hex: "#fafafa" },
                { color: "bg-neutral-100", name: "100", hex: "#f5f5f5" },
                { color: "bg-neutral-200", name: "200", hex: "#e5e5e5" },
                { color: "bg-neutral-300", name: "300", hex: "#d4d4d4" },
                { color: "bg-neutral-400", name: "400", hex: "#a3a3a3" },
                { color: "bg-neutral-500", name: "500", hex: "#737373" },
                { color: "bg-neutral-600", name: "600", hex: "#525252" },
                { color: "bg-neutral-700", name: "700", hex: "#404040" },
                { color: "bg-neutral-800", name: "800", hex: "#262626" },
                { color: "bg-neutral-900", name: "900", hex: "#171717" },
              ].map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-full h-16 rounded-lg border border-neutral-200 ${color.color} mb-2`}
                  ></div>
                  <p className="text-xs font-medium text-neutral-900">
                    {color.name}
                  </p>
                  <p className="text-xs text-neutral-600">{color.hex}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <div className="bg-neutral-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build?</h2>
          <p className="text-neutral-300 mb-8 text-lg">
            Get started with The Folk Design System and create beautiful,
            minimalist interfaces.
          </p>

          <Card className="bg-neutral-800 border-neutral-700 text-left max-w-2xl mx-auto">
            <CardContent>
              <pre className="text-neutral-300 text-sm overflow-x-auto">
                <code>{`# Install the package
npm install @thefolk/ui

# Import components
import { Button, Card, Badge } from '@thefolk/ui';

# Start building
<Button variant="primary">
  Get Started
</Button>`}</code>
              </pre>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button variant="primary" size="lg">
              View Documentation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-neutral-600 text-white hover:bg-neutral-800"
            >
              Browse Components
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of The Folk Design System showcasing components, philosophy, and getting started information.",
      },
    },
  },
};

// Design tokens
export const DesignTokens: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          Design Tokens
        </h2>
        <p className="text-neutral-600 mb-8">
          The building blocks of The Folk Design System. These tokens ensure
          consistency across all components and applications.
        </p>
      </div>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Scale</CardTitle>
          <CardDescription>
            Inter font family with consistent sizing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-xs text-neutral-600">
              12px - Small text, captions
            </div>
            <div className="text-sm text-neutral-700">
              14px - Body text, labels
            </div>
            <div className="text-base text-neutral-800">
              16px - Default body text
            </div>
            <div className="text-lg text-neutral-900">
              18px - Large body text
            </div>
            <div className="text-xl font-semibold text-neutral-900">
              20px - Section headings
            </div>
            <div className="text-2xl font-bold text-neutral-900">
              24px - Page headings
            </div>
            <div className="text-3xl font-bold text-neutral-900">
              30px - Hero headings
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>8px base grid system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "0.5", px: "2px", rem: "0.125rem" },
              { name: "1", px: "4px", rem: "0.25rem" },
              { name: "2", px: "8px", rem: "0.5rem" },
              { name: "3", px: "12px", rem: "0.75rem" },
              { name: "4", px: "16px", rem: "1rem" },
              { name: "6", px: "24px", rem: "1.5rem" },
              { name: "8", px: "32px", rem: "2rem" },
              { name: "12", px: "48px", rem: "3rem" },
              { name: "16", px: "64px", rem: "4rem" },
            ].map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <div className="w-12 text-sm font-mono text-neutral-600">
                  {space.name}
                </div>
                <div
                  className={`h-4 bg-neutral-300`}
                  style={{ width: space.px }}
                ></div>
                <div className="text-sm text-neutral-600">{space.px}</div>
                <div className="text-sm text-neutral-500">({space.rem})</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>Shadow System</CardTitle>
          <CardDescription>
            Subtle elevation for modern interfaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 bg-white shadow-minimal rounded-lg text-center">
              <div className="text-sm font-medium text-neutral-900">
                Minimal
              </div>
              <div className="text-xs text-neutral-600 mt-1">Subtle hover</div>
            </div>
            <div className="p-6 bg-white shadow-soft rounded-lg text-center">
              <div className="text-sm font-medium text-neutral-900">Soft</div>
              <div className="text-xs text-neutral-600 mt-1">Card default</div>
            </div>
            <div className="p-6 bg-white shadow-medium rounded-lg text-center">
              <div className="text-sm font-medium text-neutral-900">Medium</div>
              <div className="text-xs text-neutral-600 mt-1">
                Elevated cards
              </div>
            </div>
            <div className="p-6 bg-white shadow-large rounded-lg text-center">
              <div className="text-sm font-medium text-neutral-900">Large</div>
              <div className="text-xs text-neutral-600 mt-1">
                Modals, dropdowns
              </div>
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
          "Design tokens including typography, spacing, and shadow scales used throughout the system.",
      },
    },
  },
};
