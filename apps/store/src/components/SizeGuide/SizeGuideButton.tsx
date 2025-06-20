// src/components/SizeGuide/SizeGuideButton.tsx
import React, { useState } from "react";
import { Ruler } from "lucide-react";
import SizeGuideModal from "./SizeGuideModal";
import { Button, ButtonProps } from "@thefolk/ui";

interface SizeGuideButtonProps {
  productCategory?: string;
  productType?: "tops" | "bottoms" | "shoes" | "accessories";
  variant?: "ghost" | "outline" | "minimal";
  size?: ButtonProps["size"];
  className?: string;
}

const SizeGuideButton: React.FC<SizeGuideButtonProps> = ({
  productCategory,
  productType,
  variant = "ghost",
  size = "xs",
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        leftIcon={<Ruler size={16} />}
        className={`text-neutral-600 hover:text-neutral-900 ${className}`}
      >
        Size Guide
      </Button>

      <SizeGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productCategory={productCategory}
        productType={productType}
      />
    </>
  );
};

export default SizeGuideButton;
