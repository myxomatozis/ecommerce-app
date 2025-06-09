import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@thefolk/ui";
import type { CheckboxProps } from "@thefolk/ui";
import { useState } from "react";
import {
  Shield,
  Settings,
  Bell,
  Mail,
  Star,
  Heart,
  Download,
  Eye,
  Lock,
  Users,
} from "lucide-react";

const meta: Meta<CheckboxProps> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `
# Checkbox Component

A clean, accessible checkbox component following modern design principles. Built for The Folk's minimalist aesthetic with proper form validation, multiple states, and excellent user experience.

## Design Philosophy

**Clarity First**: Clear visual states make selection obvious and unambiguous  
**Accessible by Default**: Built-in focus management, keyboard navigation, and screen reader support  
**Minimal Aesthetics**: Clean design that integrates seamlessly with forms and interfaces  
**Flexible Context**: Works in forms, settings panels, lists, and interactive elements

## When to Use

- **Form Inputs**: User preferences, terms acceptance, multi-select options
- **Settings Panels**: Toggle features, permissions, and configurations  
- **Lists & Tables**: Bulk selection, filtering, and batch operations
- **Interactive Elements**: Favorites, bookmarks, and status toggles
- **Accessibility**: When users need clear on/off state indication

## Features

- **Multiple Sizes**: sm, md, lg for different contexts
- **States**: Default, checked, indeterminate, disabled, error
- **Validation**: Built-in error states with helper text
- **Label Positioning**: Left or right alignment options
- **Rich Content**: Support for descriptions and complex labels
- **Keyboard Navigation**: Full accessibility support
        `,
      },
    },
    layout: "padded",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Visual size of the checkbox",
    },
    variant: {
      control: "select",
      options: ["default", "minimal"],
      description: "Visual style variant",
    },
    disabled: {
      control: "boolean",
      description: "Disable interaction",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    helperText: {
      control: "text",
      description: "Helper text to provide context",
    },
    labelPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Position of the label relative to checkbox",
    },
    label: {
      control: "text",
      description: "Label text for the checkbox",
    },
  },
};

export default meta;
type Story = StoryObj<CheckboxProps>;

// Basic Examples
export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
    size: "md",
    variant: "default",
  },
};

export const Checked: Story = {
  args: {
    label: "Newsletter subscription",
    defaultChecked: true,
    size: "md",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled option",
    disabled: true,
    size: "md",
  },
};

export const WithError: Story = {
  args: {
    label: "Required field",
    error: "This field is required to proceed",
    size: "md",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Enable notifications",
    helperText: "You can change this setting anytime in your preferences",
    size: "md",
  },
};

// Size Variations
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Small</h3>
        <div className="space-y-3">
          <Checkbox size="sm" label="Compact checkbox for dense layouts" />
          <Checkbox size="sm" defaultChecked label="Checked small checkbox" />
          <Checkbox size="sm" disabled label="Disabled small option" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">
          Medium (Default)
        </h3>
        <div className="space-y-3">
          <Checkbox size="md" label="Standard checkbox for most use cases" />
          <Checkbox size="md" defaultChecked label="Checked medium checkbox" />
          <Checkbox size="md" disabled label="Disabled medium option" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Large</h3>
        <div className="space-y-3">
          <Checkbox
            size="lg"
            label="Large checkbox for emphasis or accessibility"
          />
          <Checkbox size="lg" defaultChecked label="Checked large checkbox" />
          <Checkbox size="lg" disabled label="Disabled large option" />
        </div>
      </div>
    </div>
  ),
};

// Interactive Examples
export const InteractiveDemo: Story = {
  render: () => {
    const [preferences, setPreferences] = useState({
      newsletter: true,
      updates: false,
      promotions: false,
      reminders: true,
    });

    const handleChange = (key: string) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: !prev[key as keyof typeof prev],
      }));
    };

    return (
      <div className="max-w-md space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          Email Preferences
        </h3>

        <Checkbox
          checked={preferences.newsletter}
          onChange={() => handleChange("newsletter")}
          label="Weekly Newsletter"
        />

        <Checkbox
          checked={preferences.updates}
          onChange={() => handleChange("updates")}
          helperText="Get notified about new features and updates"
          label="Product Updates"
        />

        <Checkbox
          checked={preferences.promotions}
          onChange={() => handleChange("promotions")}
          label="Promotional Emails"
        />

        <Checkbox
          checked={preferences.reminders}
          onChange={() => handleChange("reminders")}
          helperText="Helpful reminders about your account and activities"
          label="Account Reminders"
        />

        <div className="mt-6 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Current selections:{" "}
            {Object.values(preferences).filter(Boolean).length} of 4
          </p>
        </div>
      </div>
    );
  },
};

// Complex Content Examples
export const RichContent: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-lg font-medium text-neutral-900 mb-4">
        Account Settings
      </h3>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 border border-neutral-200 rounded-lg">
          <Checkbox size="md" defaultChecked className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Shield size={16} className="text-blue-600" />
              <span className="font-medium text-neutral-900">
                Two-Factor Authentication
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              Add an extra layer of security to your account with SMS or
              authenticator app verification.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-neutral-200 rounded-lg">
          <Checkbox size="md" className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Bell size={16} className="text-orange-600" />
              <span className="font-medium text-neutral-900">
                Push Notifications
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              Receive real-time notifications about important account activities
              and updates.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-neutral-200 rounded-lg">
          <Checkbox size="md" defaultChecked className="mt-1" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Users size={16} className="text-green-600" />
              <span className="font-medium text-neutral-900">
                Public Profile
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              Make your profile visible to other users. You can control what
              information is shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Form Integration
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      terms: false,
      newsletter: false,
      age: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.terms) {
        newErrors.terms = "You must accept the terms and conditions";
      }
      if (!formData.age) {
        newErrors.age = "You must confirm you are 18 or older";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert("Form submitted successfully!");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          Create Account
        </h3>

        <div className="space-y-4">
          <Checkbox
            checked={formData.terms}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, terms: e.target.checked }));
              if (errors.terms) {
                setErrors((prev) => ({ ...prev, terms: "" }));
              }
            }}
            error={errors.terms}
            label={
              <span>
                I accept the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            }
          />

          <Checkbox
            checked={formData.age}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, age: e.target.checked }));
              if (errors.age) {
                setErrors((prev) => ({ ...prev, age: "" }));
              }
            }}
            error={errors.age}
            label="I confirm that I am 18 years or older"
          />

          <Checkbox
            checked={formData.newsletter}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, newsletter: e.target.checked }))
            }
            helperText="We'll send you updates about new features and special offers"
            label="Subscribe to our newsletter (optional)"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Create Account
        </button>

        <div className="text-sm text-neutral-500">
          <p>Form data: {JSON.stringify(formData, null, 2)}</p>
        </div>
      </form>
    );
  },
};

// List Selection
export const ListSelection: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>(["item-2"]);

    const items = [
      {
        id: "item-1",
        label: "Quarterly Report",
        description: "Financial overview and key metrics",
        icon: Download,
      },
      {
        id: "item-2",
        label: "Team Meeting Notes",
        description: "Weekly sync notes and action items",
        icon: Users,
      },
      {
        id: "item-3",
        label: "Project Documentation",
        description: "Technical specs and requirements",
        icon: Eye,
      },
      {
        id: "item-4",
        label: "Design Assets",
        description: "Brand guidelines and visual assets",
        icon: Star,
      },
    ];

    const handleToggle = (itemId: string) => {
      setSelectedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    };

    return (
      <div className="max-w-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-neutral-900">
            Select Files to Download
          </h3>
          <span className="text-sm text-neutral-500">
            {selectedItems.length} selected
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItems.includes(item.id);

            return (
              <div
                key={item.id}
                className={`
                  flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer
                  ${
                    isSelected
                      ? "border-blue-200 bg-blue-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }
                `}
                onClick={() => handleToggle(item.id)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleToggle(item.id)}
                  className="mt-0.5"
                />
                <Icon
                  size={20}
                  className="text-neutral-600 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">
                    {item.label}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedItems.length > 0 && (
          <div className="pt-4 border-t border-neutral-200">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Download {selectedItems.length} File
              {selectedItems.length !== 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
    );
  },
};

// States Showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 max-w-lg">
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-4">
          Basic States
        </h3>
        <div className="space-y-3">
          <Checkbox label="Unchecked state" />
          <Checkbox defaultChecked label="Checked state" />
          <Checkbox disabled label="Disabled unchecked" />
          <Checkbox disabled defaultChecked label="Disabled checked" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-4">
          Validation States
        </h3>
        <div className="space-y-4">
          <Checkbox
            error="This is a required field"
            label="Checkbox with error"
          />
          <Checkbox
            helperText="This provides additional context"
            label="Checkbox with helper text"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-4">
          Label Positions
        </h3>
        <div className="space-y-3">
          <Checkbox
            labelPosition="right"
            label="Label on the right (default)"
          />
          <Checkbox labelPosition="left" label="Label on the left" />
        </div>
      </div>
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-4">
          Default Variant
        </h3>
        <div className="space-y-3">
          <Checkbox variant="default" label="Standard checkbox style" />
          <Checkbox
            variant="default"
            defaultChecked
            label="Checked standard style"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-4">
          Minimal Variant
        </h3>
        <div className="space-y-3">
          <Checkbox variant="minimal" label="Minimal checkbox style" />
          <Checkbox
            variant="minimal"
            defaultChecked
            label="Checked minimal style"
          />
        </div>
      </div>
    </div>
  ),
};
