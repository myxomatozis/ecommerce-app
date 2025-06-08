// src/components/SizeGuide/types.ts
export interface SizeRow {
  [key: string]: string | number;
}

export interface SizeTableData {
  headers: string[];
  measurements: string[];
  data: SizeRow[];
}

export interface SizeCategory {
  id: string;
  name: string;
  tables: {
    [key: string]: SizeTableData;
  };
}

export interface MeasurementTip {
  title: string;
  description: string;
}

export type ProductCategory =
  | "women"
  | "men"
  | "shoes"
  | "accessories"
  | "unisex";

export interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCategory?: string;
  productType?: "tops" | "bottoms" | "shoes" | "accessories";
}
