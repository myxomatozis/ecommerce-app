export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

export type IconSize = keyof typeof iconSizes;

// Base icon component with consistent styling
export interface IconProps {
  size?: IconSize | number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export * from "./social";
