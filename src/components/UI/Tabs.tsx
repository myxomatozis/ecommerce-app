import React, {
  useState,
  createContext,
  useContext,
  HTMLAttributes,
} from "react";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  variant: "default" | "pills" | "underline";
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  onTabChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  children,
  defaultTab,
  variant = "default",
  onTabChange,
  className = "",
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || "");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab: handleTabChange, variant }}
    >
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
}

export const TabsList: React.FC<TabsListProps> = ({
  tabs,
  className = "",
  ...props
}) => {
  const { activeTab, setActiveTab, variant } = useTabsContext();

  const getVariantClasses = () => {
    switch (variant) {
      case "pills":
        return "bg-gray-100 rounded-lg p-1";
      case "underline":
        return "border-b border-gray-200";
      default:
        return "border-b border-gray-200";
    }
  };

  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    const baseClasses =
      "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500";

    if (tab.disabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case "pills":
        return `${baseClasses} rounded-md ${
          isActive
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
        }`;
      case "underline":
        return `${baseClasses} border-b-2 ${
          isActive
            ? "border-primary-600 text-primary-600"
            : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
        }`;
      default:
        return `${baseClasses} border-b-2 ${
          isActive
            ? "border-primary-600 text-primary-600"
            : "border-transparent text-gray-600 hover:text-gray-900"
        }`;
    }
  };

  return (
    <div
      className={`flex space-x-1 ${getVariantClasses()} ${className}`}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            className={getTabClasses(tab, isActive)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`
                inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                ${
                  isActive
                    ? "bg-primary-100 text-primary-800"
                    : "bg-gray-100 text-gray-600"
                }
              `}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  tabId: string;
}

export const TabsPanel: React.FC<TabsPanelProps> = ({
  children,
  tabId,
  className = "",
  ...props
}) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== tabId) {
    return null;
  }

  return (
    <div
      className={`mt-4 ${className}`}
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tabs;
