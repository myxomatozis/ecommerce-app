import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@thefolk/ui";
import type { InputProps } from "@thefolk/ui";
import { useState } from "react";
import {
  Search,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  DollarSign,
  Percent,
  Hash,
  AtSign,
  Globe,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const meta: Meta<InputProps> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `
# Input Component

A versatile, accessible input component designed for modern forms and interfaces. Built with The Folk's minimalist aesthetic, providing excellent user experience with validation states, icons, and flexible styling options.

## Design Philosophy

**Clarity First**: Clear visual hierarchy and states make form completion intuitive  
**Accessible by Default**: Built-in focus management, proper labeling, and screen reader support  
**Flexible Design**: Multiple variants and sizes for different interface contexts  
**Validation Ready**: Comprehensive error and success states with helpful messaging

## When to Use

- **Form Fields**: Text inputs, email, password, and other form data collection
- **Search Interfaces**: Search bars with icons and placeholder guidance
- **Data Entry**: Numeric inputs, dates, addresses, and structured data
- **User Authentication**: Login forms, registration, and account management
- **Filters**: Quick input fields for filtering content and data

## Features

- **Multiple Sizes**: sm, md, lg for different interface densities
- **Variants**: Default, outlined, minimal styles for various contexts
- **Input Types**: Support for all HTML input types (text, email, password, etc.)
- **Icon Support**: Left and right icons for enhanced usability
- **Validation States**: Error, success, and loading states with helper text
- **Accessibility**: Proper labeling, focus management, and keyboard navigation
- **Responsive**: Consistent appearance across devices and screen sizes
        `,
      },
    },
    layout: "padded",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url", "number"],
      description: "HTML input type",
    },
    disabled: {
      control: "boolean",
      description: "Disable interaction",
    },
    required: {
      control: "boolean",
      description: "Mark field as required",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    helperText: {
      control: "text",
      description: "Helper text to provide context",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    label: {
      control: "text",
      description: "Field label",
    },
  },
};

export default meta;
type Story = StoryObj<InputProps>;

// Basic Examples
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Full Name",
    placeholder: "Enter your full name",
  },
};

export const WithValue: Story = {
  args: {
    label: "Email Address",
    value: "user@example.com",
    placeholder: "Enter email",
    type: "email",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    value: "This field is disabled",
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: "Required Field",
    placeholder: "This field is required",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Email Address",
    value: "invalid-email",
    error: "Please enter a valid email address",
    type: "email",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    helperText:
      "Must be at least 8 characters with uppercase, lowercase, and numbers",
    type: "password",
  },
};

// Size Variations
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Small</h3>
        <div className="max-w-xs space-y-3">
          <Input label="Compact Input" placeholder="Small size input" />
          <Input placeholder="Without label" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">
          Medium (Default)
        </h3>
        <div className="max-w-xs space-y-3">
          <Input label="Standard Input" placeholder="Medium size input" />
          <Input placeholder="Without label" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Large</h3>
        <div className="max-w-xs space-y-3">
          <Input label="Large Input" placeholder="Large size input" />
          <Input placeholder="Without label" />
        </div>
      </div>
    </div>
  ),
};

// Variant Showcase
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Default</h3>
        <div className="max-w-xs">
          <Input label="Default Style" placeholder="Standard input style" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Outlined</h3>
        <div className="max-w-xs">
          <Input label="Outlined Style" placeholder="Outlined input style" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Minimal</h3>
        <div className="max-w-xs">
          <Input label="Minimal Style" placeholder="Minimal input style" />
        </div>
      </div>
    </div>
  ),
};

// Input Types
export const InputTypes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <Input type="text" label="Text Input" placeholder="Enter any text" />

      <Input type="email" label="Email Input" placeholder="user@example.com" />

      <Input
        type="password"
        label="Password Input"
        placeholder="Enter password"
      />

      <Input type="search" label="Search Input" placeholder="Search..." />

      <Input type="tel" label="Phone Input" placeholder="+1 (555) 123-4567" />

      <Input type="url" label="URL Input" placeholder="https://example.com" />

      <Input type="number" label="Number Input" placeholder="123" />

      <Input type="date" label="Date Input" />
    </div>
  ),
};

// With Icons (if supported)
export const WithIcons: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        leftIcon={<Mail size={16} />}
      />

      <Input
        label="Search"
        type="search"
        placeholder="Search products..."
        leftIcon={<Search size={16} />}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 123-4567"
        leftIcon={<Phone size={16} />}
      />

      <Input
        label="Website"
        type="url"
        placeholder="https://yoursite.com"
        leftIcon={<Globe size={16} />}
      />

      <Input
        label="Username"
        type="text"
        placeholder="Enter username"
        leftIcon={<User size={16} />}
      />

      <Input
        label="Location"
        type="text"
        placeholder="Enter address"
        leftIcon={<MapPin size={16} />}
      />
    </div>
  ),
};

// Interactive Examples
export const PasswordToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    return (
      <div className="max-w-sm space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">
          Password with Toggle
        </h3>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            leftIcon={<Lock size={16} />}
            helperText="Must be at least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-neutral-500 hover:text-neutral-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  },
};

export const RealTimeValidation: Story = {
  render: () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (value: string) => {
      if (!value) {
        setError("");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError("Please enter a valid email address");
      } else {
        setError("");
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);
      validateEmail(value);
    };

    return (
      <div className="max-w-sm space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">
          Real-time Validation
        </h3>

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={error}
          leftIcon={<Mail size={16} />}
        />

        {email && !error && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle size={16} className="mr-2" />
            Valid email address
          </div>
        )}
      </div>
    );
  },
};

// Form Examples
export const LoginForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert("Login successful!");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-sm space-y-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Sign In</h3>

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          placeholder="Enter your email"
          error={errors.email}
          leftIcon={<Mail size={16} />}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }));
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            placeholder="Enter your password"
            error={errors.password}
            leftIcon={<Lock size={16} />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-neutral-500 hover:text-neutral-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Sign In
        </button>
      </form>
    );
  },
};

export const ContactForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });

    return (
      <form className="max-w-2xl space-y-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            placeholder="John"
            required
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Doe"
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="john.doe@example.com"
          leftIcon={<Mail size={16} />}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="+1 (555) 123-4567"
            leftIcon={<Phone size={16} />}
          />

          <Input
            label="Company (Optional)"
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, company: e.target.value }))
            }
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Tell us how we can help..."
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Send Message
        </button>
      </form>
    );
  },
};

// Search Examples
export const SearchVariations: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        Search Input Variations
      </h3>

      <Input
        type="search"
        placeholder="Search products..."
        leftIcon={<Search size={16} />}
      />

      <Input
        type="search"
        placeholder="Search users..."
        leftIcon={<User size={16} />}
      />

      <Input
        type="search"
        placeholder="Quick search"
        leftIcon={<Search size={16} />}
      />
    </div>
  ),
};

// Validation States
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        Validation States
      </h3>

      <Input
        label="Normal State"
        placeholder="Enter text"
        helperText="This field accepts any text input"
      />

      <Input
        label="Error State"
        value="invalid@email"
        error="Please enter a valid email address"
        leftIcon={<AlertCircle size={16} />}
      />

      <Input
        label="Success State"
        value="valid@email.com"
        helperText="Email address is valid"
        leftIcon={<CheckCircle size={16} />}
      />

      <Input
        label="Required Field"
        placeholder="This field is required"
        required
        error="This field cannot be empty"
      />

      <Input
        label="Disabled Field"
        value="Cannot be edited"
        disabled
        helperText="This field is currently disabled"
      />
    </div>
  ),
};

// Specialized Inputs
export const SpecializedInputs: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <Input
        label="Credit Card"
        placeholder="1234 5678 9012 3456"
        leftIcon={<CreditCard size={16} />}
        helperText="Enter 16-digit card number"
      />

      <Input
        label="Price"
        type="number"
        placeholder="0.00"
        leftIcon={<DollarSign size={16} />}
        helperText="Enter amount in USD"
      />

      <Input
        label="Percentage"
        type="number"
        placeholder="0"
        rightIcon={<Percent size={16} />}
        helperText="Enter percentage value"
      />

      <Input
        label="Reference Number"
        placeholder="REF-123456"
        leftIcon={<Hash size={16} />}
        helperText="Unique reference identifier"
      />

      <Input
        label="Username"
        placeholder="username"
        leftIcon={<AtSign size={16} />}
        helperText="Choose a unique username"
      />

      <Input
        label="Event Date"
        type="date"
        leftIcon={<Calendar size={16} />}
        helperText="Select event date"
      />
    </div>
  ),
};
