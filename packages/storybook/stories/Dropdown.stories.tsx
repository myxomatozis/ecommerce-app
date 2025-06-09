import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "@thefolk/ui";
import type { DropdownProps, DropdownOption } from "@thefolk/ui";
import { useState } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Download,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  SortAsc,
  Calendar,
  MapPin,
  Star,
  Heart,
  Share,
} from "lucide-react";

const meta: Meta<DropdownProps> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component: `
# Dropdown Component

A flexible, accessible dropdown component for selection interfaces. Built with modern design principles and The Folk's minimalist aesthetic, supporting single selection, search, custom options, and rich content.

## Design Philosophy

**Intuitive Selection**: Clear visual hierarchy makes options easy to scan and select  
**Accessible Navigation**: Full keyboard support, screen reader compatibility, and focus management  
**Flexible Content**: Support for icons, descriptions, grouped options, and custom layouts  
**Modern Interactions**: Smooth animations and responsive design for excellent user experience

## When to Use

- **Form Inputs**: Select from predefined options in forms and filters
- **Navigation Menus**: User account menus, action menus, and contextual options
- **Data Selection**: Choose from lists of items, categories, or settings
- **Action Triggers**: Dropdown buttons for actions and operations
- **Filtering**: Single-selection filters and category choices

## Features

- **Multiple Sizes**: sm, md, lg for different interface contexts
- **Variants**: Default, minimal, outlined styles
- **Search Support**: Filter options with built-in search functionality  
- **Rich Options**: Icons, descriptions, and custom content in options
- **Keyboard Navigation**: Full accessibility with arrow keys and enter selection
- **Flexible Positioning**: Smart positioning to stay within viewport
- **Form Integration**: Works seamlessly with form validation and state management
        `,
      },
    },
    layout: "padded",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Visual size of the dropdown",
    },
    variant: {
      control: "select",
      options: ["default", "minimal", "outlined"],
      description: "Visual style variant",
    },
    disabled: {
      control: "boolean",
      description: "Disable interaction",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no option is selected",
    },
    searchable: {
      control: "boolean",
      description: "Enable search functionality",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    helperText: {
      control: "text",
      description: "Helper text to provide context",
    },
  },
};

export default meta;
type Story = StoryObj<DropdownProps>;

// Sample data for stories
const basicOptions: DropdownOption[] = [
  { value: "option1", label: "Option One" },
  { value: "option2", label: "Option Two" },
  { value: "option3", label: "Option Three" },
  { value: "option4", label: "Option Four" },
];

const countryOptions: DropdownOption[] = [
  { value: "us", label: "United States", icon: "🇺🇸" },
  { value: "uk", label: "United Kingdom", icon: "🇬🇧" },
  { value: "ca", label: "Canada", icon: "🇨🇦" },
  { value: "de", label: "Germany", icon: "🇩🇪" },
  { value: "fr", label: "France", icon: "🇫🇷" },
  { value: "jp", label: "Japan", icon: "🇯🇵" },
  { value: "au", label: "Australia", icon: "🇦🇺" },
];

const statusOptions: DropdownOption[] = [
  {
    value: "active",
    label: "Active",
    description: "Currently active and running",
    icon: <div className="w-2 h-2 bg-green-500 rounded-full"></div>,
  },
  {
    value: "pending",
    label: "Pending",
    description: "Waiting for approval",
    icon: <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>,
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Currently disabled",
    icon: <div className="w-2 h-2 bg-gray-400 rounded-full"></div>,
  },
  {
    value: "error",
    label: "Error",
    description: "Something went wrong",
    icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div>,
  },
];

// Basic Examples
export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: "Select an option",
    size: "md",
    variant: "default",
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    options: basicOptions,
    value: "option2",
    placeholder: "Select an option",
    size: "md",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    options: basicOptions,
    disabled: true,
    placeholder: "Disabled dropdown",
    size: "md",
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    options: basicOptions,
    error: "Please select a valid option",
    placeholder: "Select an option",
    size: "md",
    onChange: () => {},
  },
};

export const WithHelperText: Story = {
  args: {
    options: basicOptions,
    helperText: "Choose the option that best fits your needs",
    placeholder: "Select an option",
    size: "md",
    onChange: () => {},
  },
};

export const Searchable: Story = {
  args: {
    options: countryOptions,
    searchable: true,
    placeholder: "Search countries...",
    size: "md",
    onChange: () => {},
  },
};

// Size Variations
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Small</h3>
        <div className="max-w-xs">
          <Dropdown
            size="sm"
            options={basicOptions}
            placeholder="Small dropdown"
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">
          Medium (Default)
        </h3>
        <div className="max-w-xs">
          <Dropdown
            size="md"
            options={basicOptions}
            placeholder="Medium dropdown"
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Large</h3>
        <div className="max-w-xs">
          <Dropdown
            size="lg"
            options={basicOptions}
            placeholder="Large dropdown"
            onChange={() => {}}
          />
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
          <Dropdown
            variant="default"
            options={basicOptions}
            placeholder="Default style"
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Outlined</h3>
        <div className="max-w-xs">
          <Dropdown
            variant="bordered"
            options={basicOptions}
            placeholder="Outlined style"
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-neutral-900 mb-3">Minimal</h3>
        <div className="max-w-xs">
          <Dropdown
            variant="filled"
            options={basicOptions}
            placeholder="Minimal style"
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  ),
};

// Rich Content Examples
export const WithIcons: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <h3 className="text-lg font-medium text-neutral-900">Select Country</h3>
      <Dropdown
        options={countryOptions}
        placeholder="Choose your country"
        searchable
        onChange={() => {}}
      />
    </div>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <h3 className="text-lg font-medium text-neutral-900">Project Status</h3>
      <Dropdown
        options={statusOptions}
        placeholder="Select status"
        value="active"
        onChange={() => {}}
      />
    </div>
  ),
};

// Interactive Examples
export const InteractiveDemo: Story = {
  render: () => {
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("active");

    return (
      <div className="max-w-md space-y-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          Form Example
        </h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Country
          </label>
          <Dropdown
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Select your country"
            searchable
            helperText="This will be used for shipping and billing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Account Status
          </label>
          <Dropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="Choose status"
          />
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Selected: {selectedCountry || "None"} | {selectedStatus}
          </p>
        </div>
      </div>
    );
  },
};

// Menu Examples
export const UserMenu: Story = {
  render: () => {
    const userMenuOptions: DropdownOption[] = [
      {
        value: "profile",
        label: "Profile",
        icon: <User size={16} />,
        description: "Manage your account",
      },
      {
        value: "settings",
        label: "Settings",
        icon: <Settings size={16} />,
        description: "Preferences and configuration",
      },
      {
        value: "billing",
        label: "Billing",
        icon: <CreditCard size={16} />,
        description: "Subscription and payments",
      },
      {
        value: "notifications",
        label: "Notifications",
        icon: <Bell size={16} />,
        description: "Email and push settings",
      },
      {
        value: "logout",
        label: "Sign Out",
        icon: <LogOut size={16} />,
      },
    ];

    return (
      <div className="max-w-sm space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">
          User Account Menu
        </h3>
        <Dropdown
          options={userMenuOptions}
          placeholder="Select action..."
          variant="bordered"
          onChange={(value) => console.log("Selected:", value)}
        />
      </div>
    );
  },
};

export const ActionMenu: Story = {
  render: () => {
    const actionOptions: DropdownOption[] = [
      {
        value: "edit",
        label: "Edit",
        icon: <Edit size={16} />,
      },
      {
        value: "duplicate",
        label: "Duplicate",
        icon: <Download size={16} />,
      },
      {
        value: "share",
        label: "Share",
        icon: <Share size={16} />,
      },
      {
        value: "archive",
        label: "Archive",
        description: "Hide from main view",
      },
      {
        value: "delete",
        label: "Delete",
        icon: <Trash2 size={16} />,
      },
    ];

    return (
      <div className="max-w-sm space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">Action Menu</h3>
        <Dropdown
          options={actionOptions}
          placeholder="Choose action..."
          variant="bordered"
          onChange={(value) => console.log("Action:", value)}
        />
      </div>
    );
  },
};

// Filter Examples
export const FilterDropdown: Story = {
  render: () => {
    const [selectedFilter, setSelectedFilter] = useState<string>("priority");

    const filterOptions: DropdownOption[] = [
      {
        value: "status",
        label: "Status",
        icon: <div className="w-2 h-2 bg-blue-500 rounded-full"></div>,
      },
      {
        value: "priority",
        label: "Priority",
        icon: <Star size={16} className="text-yellow-500" />,
      },
      {
        value: "assignee",
        label: "Assignee",
        icon: <User size={16} />,
      },
      {
        value: "date",
        label: "Date Created",
        icon: <Calendar size={16} />,
      },
    ];

    return (
      <div className="max-w-sm space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">Filter Options</h3>

        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-neutral-500" />
          <Dropdown
            options={filterOptions}
            placeholder="Add filter"
            value={selectedFilter}
            onChange={setSelectedFilter}
          />
        </div>

        {selectedFilter && (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
              {selectedFilter}
              <button
                onClick={() => setSelectedFilter("")}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>
    );
  },
};

// Complex Examples
export const GroupedOptions: Story = {
  render: () => {
    const navigationOptions: DropdownOption[] = [
      { value: "dashboard", label: "Dashboard", icon: <Settings size={16} /> },
      { value: "analytics", label: "Analytics", icon: <Star size={16} /> },
      { value: "settings", label: "Settings", icon: <User size={16} /> },
      { value: "posts", label: "Posts", description: "Manage blog posts" },
      { value: "pages", label: "Pages", description: "Static pages" },
      { value: "media", label: "Media", description: "Images and files" },
      { value: "users", label: "Users", icon: <User size={16} /> },
      { value: "logs", label: "System Logs", icon: <Settings size={16} /> },
    ];

    return (
      <div className="max-w-sm space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">
          Navigation Menu
        </h3>
        <Dropdown
          options={navigationOptions}
          placeholder="Go to..."
          searchable
          onChange={(value) => console.log("Navigate to:", value)}
        />
      </div>
    );
  },
};

export const LargeDataset: Story = {
  render: () => {
    // Generate a large dataset for testing performance
    const largeOptions: DropdownOption[] = Array.from(
      { length: 100 },
      (_, i) => ({
        value: `item-${i}`,
        label: `Item ${i + 1}`,
        description: `This is the description for item ${i + 1}`,
        icon: i % 5 === 0 ? <Star size={16} /> : undefined,
      })
    );

    return (
      <div className="max-w-sm space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">
          Large Dataset (100 items)
        </h3>
        <Dropdown
          options={largeOptions}
          placeholder="Search through 100 items..."
          searchable
          helperText="Type to filter through the options"
          onChange={(value) => console.log("Selected:", value)}
        />
      </div>
    );
  },
};

// Form Integration
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      country: "",
      category: "",
      priority: "medium",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const categoryOptions: DropdownOption[] = [
      { value: "electronics", label: "Electronics", icon: "📱" },
      { value: "clothing", label: "Clothing", icon: "👔" },
      { value: "books", label: "Books", icon: "📚" },
      { value: "home", label: "Home & Garden", icon: "🏠" },
    ];

    const priorityOptions: DropdownOption[] = [
      {
        value: "low",
        label: "Low",
        icon: <div className="w-2 h-2 bg-green-500 rounded-full"></div>,
      },
      {
        value: "medium",
        label: "Medium",
        icon: <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>,
      },
      {
        value: "high",
        label: "High",
        icon: <div className="w-2 h-2 bg-red-500 rounded-full"></div>,
      },
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.country) {
        newErrors.country = "Please select a country";
      }
      if (!formData.category) {
        newErrors.category = "Please select a category";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert("Form submitted successfully!");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          Product Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Country *
          </label>
          <Dropdown
            options={countryOptions}
            value={formData.country}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, country: value }));
              if (errors.country) {
                setErrors((prev) => ({ ...prev, country: "" }));
              }
            }}
            placeholder="Select country"
            error={errors.country}
            searchable
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category *
          </label>
          <Dropdown
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, category: value }));
              if (errors.category) {
                setErrors((prev) => ({ ...prev, category: "" }));
              }
            }}
            placeholder="Choose category"
            error={errors.category}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Priority
          </label>
          <Dropdown
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, priority: value }))
            }
            helperText="This helps us process your request appropriately"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Submit Form
        </button>

        <div className="text-sm text-neutral-500">
          <p>Form data: {JSON.stringify(formData, null, 2)}</p>
        </div>
      </form>
    );
  },
};
