import { FC, useState } from "react";

interface ProductImagePlaceholderProps {
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

const ProductImagePlaceholder: FC<ProductImagePlaceholderProps> = ({
  className = "",
  variant = "primary",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: "bg-gray-50",
    secondary: "bg-gray-100",
    accent: "bg-stone-100",
  };

  return (
    <div
      className={`${variants[variant]} ${className} relative overflow-hidden group cursor-pointer transition-all duration-700 ease-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient overlay that appears on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
      />

      {/* Image placeholder content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-gray-400 transition-all duration-500scale-100`}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
        </div>
      </div>

      {/* Subtle zoom effect on hover */}
      <div
        className={`absolute inset-0 transition-transform duration-700 ease-out ${isHovered ? "scale-105" : "scale-100"}`}
      />
    </div>
  );
};

export default ProductImagePlaceholder;
