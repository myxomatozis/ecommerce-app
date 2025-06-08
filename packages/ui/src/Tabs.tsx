import React, {
  useState,
  createContext,
  useContext,
  HTMLAttributes,
  useRef,
  useEffect,
} from "react";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  description?: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  variant: "default" | "pills" | "underline" | "cards";
  size: "sm" | "md" | "lg";
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
  variant?: "default" | "pills" | "underline" | "cards";
  size?: "sm" | "md" | "lg";
  onTabChange?: (tabId: string) => void;
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  children,
  defaultTab,
  variant = "default",
  size = "md",
  onTabChange,
  orientation = "horizontal",
  fullWidth = false,
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
      value={{ activeTab, setActiveTab: handleTabChange, variant, size }}
    >
      <div
        className={`
          ${orientation === "vertical" ? "flex gap-6" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
}

export const TabsList: React.FC<TabsListProps> = ({
  tabs,
  orientation = "horizontal",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const { activeTab, setActiveTab, variant, size } = useTabsContext();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: "px-3 py-1.5",
      text: "text-sm",
      icon: 16,
      gap: "gap-1.5",
    },
    md: {
      padding: "px-4 py-2.5",
      text: "text-sm",
      icon: 18,
      gap: "gap-2",
    },
    lg: {
      padding: "px-6 py-3",
      text: "text-base",
      icon: 20,
      gap: "gap-2.5",
    },
  };

  const config = sizeConfig[size];

  // Update indicator position
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeElement = tabsRef.current[activeIndex];

    if (activeElement && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      if (orientation === "horizontal") {
        setIndicatorStyle({
          width: activeRect.width,
          height: variant === "underline" ? "2px" : activeRect.height,
          transform: `translateX(${activeRect.left - listRect.left}px)`,
        });
      } else {
        setIndicatorStyle({
          width: variant === "underline" ? "2px" : activeRect.width,
          height: activeRect.height,
          transform: `translateY(${activeRect.top - listRect.top}px)`,
        });
      }
    }
  }, [activeTab, tabs, orientation, variant]);

  const getContainerClasses = () => {
    const baseClasses = "relative inline-flex";

    switch (variant) {
      case "pills":
        return `${baseClasses} bg-gray-100 rounded-xl p-1 ${
          orientation === "vertical" ? "flex-col" : ""
        }`;
      case "underline":
        return `${baseClasses} ${
          orientation === "vertical"
            ? "flex-col border-l border-gray-200 pl-1"
            : "border-b border-gray-200"
        }`;
      case "cards":
        return `${baseClasses} ${
          orientation === "vertical" ? "flex-col gap-1" : "gap-1"
        }`;
      default:
        return `${baseClasses} ${
          orientation === "vertical" ? "flex-col" : ""
        } border-b border-gray-200`;
    }
  };

  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    const baseClasses = `
      relative flex items-center font-medium transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded-lg
      ${config.padding} ${config.text} ${config.gap}
      ${
        fullWidth && orientation === "horizontal" ? "flex-1 justify-center" : ""
      }
    `;

    if (tab.disabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case "pills":
        return `${baseClasses} rounded-lg relative z-10 ${
          isActive
            ? "text-primary-700 font-semibold"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
        }`;
      case "underline":
        return `${baseClasses} ${
          isActive
            ? "text-primary-600 font-semibold"
            : "text-gray-600 hover:text-gray-900"
        }`;
      case "cards":
        return `${baseClasses} border rounded-xl ${
          isActive
            ? "bg-white border-primary-200 text-primary-700 shadow-sm font-semibold"
            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50"
        }`;
      default:
        return `${baseClasses} ${
          isActive
            ? "text-primary-600 font-semibold"
            : "text-gray-600 hover:text-gray-900"
        }`;
    }
  };

  const getIndicatorClasses = () => {
    const baseClasses = "absolute transition-all duration-300 ease-out";

    switch (variant) {
      case "pills":
        return `${baseClasses} bg-white shadow-sm rounded-lg border border-gray-200/50`;
      case "underline":
        return `${baseClasses} bg-primary-600 ${
          orientation === "vertical" ? "left-0" : "bottom-0"
        }`;
      case "cards":
        return ""; // No indicator for cards
      default:
        return `${baseClasses} bg-primary-600 bottom-0 h-0.5`;
    }
  };

  return (
    <div
      ref={listRef}
      className={`${getContainerClasses()} ${className}`}
      role="tablist"
      aria-orientation={orientation}
      {...props}
    >
      {/* Animated Indicator */}
      {variant !== "cards" && (
        <div
          className={getIndicatorClasses()}
          style={indicatorStyle}
          aria-hidden="true"
        />
      )}

      {/* Tabs */}
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => (tabsRef.current[index] = el)}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            className={getTabClasses(tab, isActive)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
          >
            {/* Icon */}
            {tab.icon && (
              <span className="flex-shrink-0" style={{ fontSize: config.icon }}>
                {tab.icon}
              </span>
            )}

            {/* Label */}
            <span className="truncate">{tab.label}</span>

            {/* Description (for larger sizes) */}
            {tab.description && size === "lg" && (
              <span className="text-xs text-gray-500 font-normal ml-1">
                {tab.description}
              </span>
            )}

            {/* Badge */}
            {tab.badge && (
              <span
                className={`
                  inline-flex items-center justify-center min-w-[1.25rem] h-5 
                  px-1.5 text-xs font-semibold rounded-full
                  ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600"
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
  lazy?: boolean;
  unmountOnExit?: boolean;
}

export const TabsPanel: React.FC<TabsPanelProps> = ({
  children,
  tabId,
  lazy = false,
  unmountOnExit = false,
  className = "",
  ...props
}) => {
  const { activeTab } = useTabsContext();
  const [hasBeenActive, setHasBeenActive] = useState(!lazy);
  const isActive = activeTab === tabId;

  // Track if tab has ever been active (for lazy loading)
  useEffect(() => {
    if (isActive && !hasBeenActive) {
      setHasBeenActive(true);
    }
  }, [isActive, hasBeenActive]);

  // Don't render if lazy and never been active
  if (lazy && !hasBeenActive) {
    return null;
  }

  // Don't render if unmountOnExit and not active
  if (unmountOnExit && !isActive) {
    return null;
  }

  return (
    <div
      className={`
        ${isActive ? "block" : "hidden"}
        ${className}
      `}
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tabs;
