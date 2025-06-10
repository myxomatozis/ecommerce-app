import React from "react";
import { Package, ShoppingBag, Shirt, Watch, Gem, Heart } from "lucide-react";

interface ProductImagePlaceholderProps {
  category?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "gradient" | "solid" | "minimal";
  className?: string;
}

const ProductImagePlaceholder: React.FC<ProductImagePlaceholderProps> = ({
  category = "general",
  size = "md",
  variant = "gradient",
  className = "",
}) => {
  // Choose icon based on category
  const getIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      women: Shirt,
      men: Shirt,
      clothing: Shirt,
      accessories: Watch,
      jewelry: Gem,
      bags: ShoppingBag,
      general: Package,
      default: Package,
    };

    const normalizedCategory = category.toLowerCase();
    const IconComponent = iconMap[normalizedCategory] || iconMap["default"];
    return IconComponent;
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "h-32",
      icon: 24,
      secondary: 16,
    },
    md: {
      container: "h-48",
      icon: 32,
      secondary: 20,
    },
    lg: {
      container: "h-64",
      icon: 40,
      secondary: 24,
    },
    xl: {
      container: "h-80",
      icon: 48,
      secondary: 28,
    },
  };

  // Variant styles
  const variantStyles = {
    gradient: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200",
    solid: "bg-gray-100",
    minimal: "bg-gray-50 border-2 border-dashed border-gray-200",
  };

  const IconComponent = getIcon(category);
  const config = sizeConfig[size];

  return (
    <div
      className={`
        w-full ${config.container} 
        ${variantStyles[variant]}
        rounded-2xl
        flex flex-col items-center justify-center
        relative overflow-hidden
        group hover:scale-[1.02] transition-transform duration-300
        ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-3">
        {/* Primary Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-lg scale-150"></div>
          <div className="relative bg-white/80 p-3 rounded-full shadow-sm">
            <IconComponent
              size={config.icon}
              className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300"
            />
          </div>
        </div>

        {/* Secondary Icons */}
        <div className="flex space-x-2 opacity-60">
          <Heart size={config.secondary} className="text-gray-300" />
          <Package size={config.secondary} className="text-gray-300" />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-xs text-gray-400 font-light">Image Coming Soon</p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </div>
  );
};

export default ProductImagePlaceholder;
