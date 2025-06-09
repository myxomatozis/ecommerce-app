# The Folk Design System - Storybook

A comprehensive Storybook setup showcasing The Folk's minimalist design system components. Built with modern tools and following 2025 design trends for clean, accessible, and performant user interfaces.

## 🎨 Features

- **Complete Component Documentation**: Every component from `@thefolk/ui` with comprehensive examples
- **Interactive Controls**: Real-time component customization and experimentation
- **Modern Design**: Following 2025 minimalist trends with neutral color palettes
- **Accessibility Testing**: Built-in a11y addon for accessibility compliance
- **Responsive Previews**: Test components across different viewport sizes
- **Auto-generated Documentation**: TypeScript-powered prop documentation
- **Dark/Light Themes**: Theme switching for different design contexts

## 🚀 Quick Start

### Prerequisites

Ensure you're in the root of The Folk monorepo and have dependencies installed:

```bash
# From the root directory
pnpm install
```

### Development

Start the Storybook development server:

```bash
# From the root directory
cd packages/storybook
pnpm storybook

# Or using turbo from root
pnpm turbo dev --filter=@thefolk/storybook
```

This will start Storybook at `http://localhost:6006`

### Building

Build the static Storybook for deployment:

```bash
# From the storybook package
pnpm build-storybook

# Or using turbo from root
pnpm turbo build --filter=@thefolk/storybook
```

## 📁 Project Structure

```
packages/storybook/
├── .storybook/           # Storybook configuration
│   ├── main.ts          # Main configuration
│   ├── preview.ts       # Global preview settings
│   └── styles.css       # Global styles
├── stories/             # Component stories
│   ├── Introduction.stories.tsx
│   ├── Button.stories.tsx
│   ├── Badge.stories.tsx
│   ├── Card.stories.tsx
│   └── ...
├── tailwind.config.js   # Tailwind configuration
├── package.json
└── README.md
```

## 🧩 Adding New Stories

When you add a new component to `@thefolk/ui`, create a corresponding story:

### 1. Create a New Story File

```typescript
// stories/YourComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from '@thefolk/ui';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Description of your component...',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for props
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <YourComponent variant="primary">Primary</YourComponent>
      <YourComponent variant="secondary">Secondary</YourComponent>
    </div>
  ),
};
```

### 2. Update the Story Sort Order

In `.storybook/preview.ts`, add your component to the `storySort` order:

```typescript
options: {
  storySort: {
    order: [
      'Introduction',
      'Design System',
      'Components',
      [
        'Button',
        'Badge',
        'Card',
        'YourComponent', // Add here
        // ...
      ],
    ],
  },
},
```

## 🎯 Story Types and Patterns

### Basic Component Story

```typescript
export const Default: Story = {
  args: {
    children: 'Button Text',
    variant: 'primary',
  },
};
```

### Multiple Variants Showcase

```typescript
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Component variant="primary">Primary</Component>
      <Component variant="secondary">Secondary</Component>
    </div>
  ),
};
```

### Interactive Example

```typescript
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls panel to experiment with different props.',
      },
    },
  },
};
```

### Real-World Examples

```typescript
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <h3>E-commerce Use Cases</h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Real implementation examples */}
      </div>
    </div>
  ),
};
```

## 🎨 Design Guidelines

### Component Documentation Structure

1. **Introduction**: What the component does and when to use it
2. **Default**: Basic usage example
3. **Variants**: All available visual variants
4. **Sizes**: Different size options
5. **States**: Interactive states (hover, focus, disabled, loading)
6. **With Icons**: Icon integration examples
7. **Real-World Examples**: Actual usage patterns from The Folk
8. **Interactive**: Playground with all controls

### Visual Consistency

- Use consistent spacing (multiples of 4px/8px)
- Stick to the neutral color palette
- Maintain proper contrast ratios
- Follow The Folk's minimalist aesthetic
- Ensure responsive design patterns

### Code Examples

- Use realistic content and data
- Show practical usage patterns
- Include accessibility considerations
- Demonstrate proper prop usage
- Provide clear, commented code

## 🔧 Configuration

### Tailwind CSS Integration

The Storybook uses a dedicated Tailwind configuration that extends the main project config:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Folk-specific extensions
    },
  },
};
```

### Theme Customization

Customize the Storybook theme in `.storybook/preview.ts`:

```typescript
const folkTheme = create({
  base: 'light',
  brandTitle: 'The Folk Design System',
  brandUrl: 'https://thefolkproject.com',
  colorPrimary: '#171717',
  // ... other theme options
});
```

## 📱 Responsive Testing

Use the viewport addon to test components across different screen sizes:

- **Mobile**: 375px width
- **Tablet**: 768px width  
- **Desktop**: 1440px width

## ♿ Accessibility Testing

The a11y addon automatically checks for:

- Color contrast ratios
- Keyboard navigation
- ARIA labels and roles
- Focus management
- Screen reader compatibility

## 🚀 Deployment

### Static Build

```bash
pnpm build-storybook
```

### Deployment Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `storybook-static` folder
- **GitHub Pages**: Use GitHub Actions for automated deployments
- **Chromatic**: Visual testing and component library hosting

### Example Vercel Deployment

```json
{
  "name": "thefolk-storybook",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "storybook-static"
      }
    }
  ]
}
```

## 🤝 Contributing

### Adding New Components

1. Create the component in `@thefolk/ui`
2. Export it from the main index file
3. Create comprehensive stories in this package
4. Add to the component order in preview.ts
5. Update this README if adding new patterns

### Story Guidelines

- **Comprehensive**: Cover all props and use cases
- **Realistic**: Use real content, not Lorem Ipsum
- **Accessible**: Include accessibility examples
- **Documented**: Add clear descriptions and code examples
- **Consistent**: Follow the established story patterns

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [The Folk Design Principles](https://thefolkproject.com/design)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Modern Web Design Trends](https://www.webfx.com/blog/web-design/modern-web-design/)

## 🆘 Troubleshooting

### Common Issues

**Tailwind styles not loading**
- Check that the Tailwind config includes the correct content paths
- Ensure styles.css is imported in preview.ts

**Component not found**
- Verify the component is exported from @thefolk/ui
- Check the import path in your story

**TypeScript errors**
- Ensure @thefolk/ui types are properly exported
- Check that argTypes match component props

**Build errors**
- Clear node_modules and reinstall dependencies
- Check for conflicting package versions

---

*Built with ❤️ for The Folk Project – showcasing minimalist design excellence.*