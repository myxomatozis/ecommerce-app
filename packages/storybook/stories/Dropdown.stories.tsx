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
  Flag,
  Home,
  Building,
  Briefcase,
  GraduationCap,
  Music,
  Camera,
  Book,
  Coffee,
  Car,
  Plane,
} from "lucide-react";

// Large options array to test scrolling
const countryOptions: DropdownOption[] = [
  {
    value: "us",
    label: "United States",
    icon: <Flag size={16} />,
    description: "North America",
  },
  {
    value: "ca",
    label: "Canada",
    icon: <Flag size={16} />,
    description: "North America",
  },
  {
    value: "mx",
    label: "Mexico",
    icon: <Flag size={16} />,
    description: "North America",
  },
  {
    value: "uk",
    label: "United Kingdom",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "de",
    label: "Germany",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "fr",
    label: "France",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "it",
    label: "Italy",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "es",
    label: "Spain",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "nl",
    label: "Netherlands",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "se",
    label: "Sweden",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "no",
    label: "Norway",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "dk",
    label: "Denmark",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "fi",
    label: "Finland",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "ch",
    label: "Switzerland",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "at",
    label: "Austria",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "be",
    label: "Belgium",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "ie",
    label: "Ireland",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "pt",
    label: "Portugal",
    icon: <Flag size={16} />,
    description: "Europe",
  },
  {
    value: "jp",
    label: "Japan",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "kr",
    label: "South Korea",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "cn",
    label: "China",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "in",
    label: "India",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "sg",
    label: "Singapore",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "hk",
    label: "Hong Kong",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "tw",
    label: "Taiwan",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "th",
    label: "Thailand",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "vn",
    label: "Vietnam",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "my",
    label: "Malaysia",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "id",
    label: "Indonesia",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "ph",
    label: "Philippines",
    icon: <Flag size={16} />,
    description: "Asia",
  },
  {
    value: "au",
    label: "Australia",
    icon: <Flag size={16} />,
    description: "Oceania",
  },
  {
    value: "nz",
    label: "New Zealand",
    icon: <Flag size={16} />,
    description: "Oceania",
  },
  {
    value: "br",
    label: "Brazil",
    icon: <Flag size={16} />,
    description: "South America",
  },
  {
    value: "ar",
    label: "Argentina",
    icon: <Flag size={16} />,
    description: "South America",
  },
  {
    value: "cl",
    label: "Chile",
    icon: <Flag size={16} />,
    description: "South America",
  },
  {
    value: "co",
    label: "Colombia",
    icon: <Flag size={16} />,
    description: "South America",
  },
  {
    value: "pe",
    label: "Peru",
    icon: <Flag size={16} />,
    description: "South America",
  },
  {
    value: "za",
    label: "South Africa",
    icon: <Flag size={16} />,
    description: "Africa",
  },
  {
    value: "eg",
    label: "Egypt",
    icon: <Flag size={16} />,
    description: "Africa",
  },
  {
    value: "ng",
    label: "Nigeria",
    icon: <Flag size={16} />,
    description: "Africa",
  },
  {
    value: "ke",
    label: "Kenya",
    icon: <Flag size={16} />,
    description: "Africa",
  },
];

// Categories for testing grouped options with scrolling
const categoryOptions: DropdownOption[] = [
  {
    value: "home",
    label: "Home & Garden",
    icon: <Home size={16} />,
    group: "Living",
  },
  {
    value: "furniture",
    label: "Furniture",
    icon: <Building size={16} />,
    group: "Living",
  },
  {
    value: "decor",
    label: "Home Decor",
    icon: <Heart size={16} />,
    group: "Living",
  },
  {
    value: "kitchen",
    label: "Kitchen",
    icon: <Coffee size={16} />,
    group: "Living",
  },
  {
    value: "work",
    label: "Work & Office",
    icon: <Briefcase size={16} />,
    group: "Professional",
  },
  {
    value: "business",
    label: "Business",
    icon: <Building size={16} />,
    group: "Professional",
  },
  {
    value: "finance",
    label: "Finance",
    icon: <CreditCard size={16} />,
    group: "Professional",
  },
  {
    value: "consulting",
    label: "Consulting",
    icon: <User size={16} />,
    group: "Professional",
  },
  {
    value: "education",
    label: "Education",
    icon: <GraduationCap size={16} />,
    group: "Learning",
  },
  {
    value: "books",
    label: "Books",
    icon: <Book size={16} />,
    group: "Learning",
  },
  {
    value: "courses",
    label: "Online Courses",
    icon: <GraduationCap size={16} />,
    group: "Learning",
  },
  {
    value: "music",
    label: "Music",
    icon: <Music size={16} />,
    group: "Entertainment",
  },
  {
    value: "photography",
    label: "Photography",
    icon: <Camera size={16} />,
    group: "Entertainment",
  },
  {
    value: "gaming",
    label: "Gaming",
    icon: <Star size={16} />,
    group: "Entertainment",
  },
  {
    value: "movies",
    label: "Movies & TV",
    icon: <Camera size={16} />,
    group: "Entertainment",
  },
  {
    value: "travel",
    label: "Travel",
    icon: <Plane size={16} />,
    group: "Lifestyle",
  },
  {
    value: "automotive",
    label: "Automotive",
    icon: <Car size={16} />,
    group: "Lifestyle",
  },
  {
    value: "fitness",
    label: "Health & Fitness",
    icon: <Heart size={16} />,
    group: "Lifestyle",
  },
  {
    value: "food",
    label: "Food & Drink",
    icon: <Coffee size={16} />,
    group: "Lifestyle",
  },
];

const basicOptions: DropdownOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4", disabled: true },
  { value: "option5", label: "Option 5" },
];

const meta: Meta<DropdownProps> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Refined Dropdown Component

A flexible, accessible dropdown component with enhanced scrolling capabilities for selection interfaces. Built with modern design principles and The Folk's minimalist aesthetic, now featuring:

## Key Improvements
- **Configurable Max Height**: Set custom maximum height via \`maxHeight\` prop
- **Smooth Scrolling**: Enhanced overflow handling with proper scroll indicators
- **Better Performance**: Optimized rendering for large option lists
- **Sticky Elements**: Search bar and group headers stay in place while scrolling
- **Visual Feedback**: Subtle scroll indicators and improved empty states

## Features
- **Unlimited Options**: Handles hundreds of options with smooth scrolling
- **Smart Search**: Filter through large lists with instant results
- **Grouped Content**: Organized sections with sticky headers
- **Responsive Design**: Adapts to different container sizes
- **Accessibility**: Full keyboard navigation and screen reader support
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    maxHeight: {
      control: { type: "range", min: 200, max: 600, step: 20 },
      description: "Maximum height of dropdown in pixels",
    },
    searchable: {
      control: "boolean",
      description: "Enable search functionality",
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple selections",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the dropdown",
    },
    variant: {
      control: "select",
      options: ["default", "bordered", "filled"],
      description: "Visual style variant",
    },
  },
  args: {
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default with scrolling
export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: "Select a country",
    searchable: true,
    maxHeight: 320,
  },
};

// Large dataset demonstration
export const ManyOptions: Story = {
  render: () => {
    const [selectedCountry, setSelectedCountry] = useState("");

    return (
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Large Dataset with Scrolling
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            This dropdown contains {countryOptions.length} countries. Notice how
            the scrolling works smoothly with the search functionality.
          </p>
          <div className="max-w-sm">
            <Dropdown
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder="Search and select a country"
              searchable={true}
              clearable={true}
              maxHeight={300}
              label="Country"
              helperText="Start typing to search through all countries"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates smooth scrolling with a large dataset of countries. The search functionality helps users find options quickly.",
      },
    },
  },
};

// Grouped options with scrolling
export const GroupedWithScrolling: Story = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Grouped Categories with Sticky Headers
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Categories are organized into groups with sticky headers that remain
            visible while scrolling.
          </p>
          <div className="max-w-sm">
            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Browse categories"
              searchable={true}
              clearable={true}
              maxHeight={350}
              label="Category"
              helperText="Scroll through grouped categories"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows how grouped options work with scrolling. Group headers stick to the top for better navigation.",
      },
    },
  },
};

// Custom max heights comparison
export const CustomMaxHeights: Story = {
  render: () => {
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const [value3, setValue3] = useState("");

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">
            Compact (200px)
          </h4>
          <Dropdown
            options={countryOptions}
            value={value1}
            onChange={setValue1}
            placeholder="Compact dropdown"
            searchable={true}
            maxHeight={200}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">
            Standard (320px)
          </h4>
          <Dropdown
            options={countryOptions}
            value={value2}
            onChange={setValue2}
            placeholder="Standard dropdown"
            searchable={true}
            maxHeight={320}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-neutral-900 mb-3">
            Expanded (500px)
          </h4>
          <Dropdown
            options={countryOptions}
            value={value3}
            onChange={setValue3}
            placeholder="Expanded dropdown"
            searchable={true}
            maxHeight={500}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Compare different maximum heights. Use the maxHeight prop to control how much content is visible before scrolling.",
      },
    },
  },
};

// Multiple selection with scrolling
export const MultipleWithScrolling: Story = {
  render: () => {
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    return (
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Multiple Selection with Scrolling
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Select multiple countries from a large list. Selected items are
            highlighted with a colored border.
          </p>
          <div className="max-w-sm">
            <Dropdown
              options={countryOptions}
              value={selectedCountries as any}
              onChange={(value: any) => setSelectedCountries(value)}
              placeholder="Select multiple countries"
              searchable={true}
              clearable={true}
              multiple={true}
              maxHeight={280}
              label="Countries"
              helperText={`${selectedCountries.length} countries selected`}
            />
          </div>

          {selectedCountries.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                Selected:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((countryValue) => {
                  const country = countryOptions.find(
                    (opt) => opt.value === countryValue
                  );
                  return (
                    <span
                      key={countryValue}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                    >
                      {country?.icon}
                      <span className="ml-1">{country?.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates multiple selection with a large scrollable list. Selected items are visually highlighted.",
      },
    },
  },
};

// Performance test with many options
export const PerformanceTest: Story = {
  render: () => {
    // Generate a large number of options to test performance
    const generateManyOptions = (count: number): DropdownOption[] => {
      const icons = [Home, Building, User, Star, Heart, Globe, Settings, Bell];
      return Array.from({ length: count }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i + 1}`,
        description: `Description for option ${i + 1}`,
        // @ts-expect-error
        icon: React.createElement(icons[i % icons.length], { size: 16 }),
        group: i < count / 2 ? "Group A" : "Group B",
      }));
    };

    const manyOptions = generateManyOptions(200);
    const [selectedValue, setSelectedValue] = useState("");

    return (
      <div className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Performance Test - 200 Options
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            This dropdown contains 200 options to test scrolling performance and
            search functionality.
          </p>
          <div className="max-w-sm">
            <Dropdown
              options={manyOptions}
              value={selectedValue}
              onChange={setSelectedValue}
              placeholder="Search through 200 options"
              searchable={true}
              clearable={true}
              maxHeight={400}
              label="Performance Test"
              helperText="Try searching to filter options"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Performance test with 200 options. Notice how smooth the scrolling and search remain even with large datasets.",
      },
    },
  },
};

// Interactive playground
export const Interactive: Story = {
  args: {
    options: countryOptions,
    placeholder: "Interactive dropdown",
    searchable: true,
    clearable: true,
    maxHeight: 320,
    label: "Interactive Example",
    helperText: "Use the controls to experiment with different settings",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the controls panel to experiment with different dropdown configurations and see how scrolling behaves.",
      },
    },
  },
};
