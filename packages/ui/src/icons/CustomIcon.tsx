import React, { forwardRef } from "react";
import type { IconSize } from "./index";

// Icon sizes matching lucide-react
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

// Extended props for custom icons
export interface CustomIconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "size"> {
  size?: IconSize | number;
  strokeWidth?: number;
  color?: string;
}

// Wrapper component for custom SVG icons
export const createCustomIcon = (
  iconName: string,
  iconContent: React.ReactNode,
  defaultViewBox: string = "0 0 24 24"
) => {
  const CustomIcon = forwardRef<SVGSVGElement, CustomIconProps>(
    (
      { size = "md", className = "", color, strokeWidth, style, ...props },
      ref
    ) => {
      const iconSize = typeof size === "number" ? size : iconSizes[size];

      return (
        <svg
          ref={ref}
          role="img"
          width={iconSize}
          height={iconSize}
          viewBox={defaultViewBox}
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{
            color: color,
            ...style,
          }}
          strokeWidth={strokeWidth}
          {...props}
        >
          <title>{iconName}</title>
          {iconContent}
        </svg>
      );
    }
  );

  CustomIcon.displayName = `${iconName}Icon`;
  return CustomIcon;
};

export default createCustomIcon;
