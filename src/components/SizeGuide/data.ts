// src/components/SizeGuide/data.ts
import { SizeCategory, MeasurementTip, SizeTableData } from "./types";

export const measurementTips: MeasurementTip[] = [
  {
    title: "Bust/Chest",
    description: "Measure around the fullest part, keeping tape horizontal",
  },
  {
    title: "Waist",
    description:
      "Measure around your natural waist, typically the narrowest part",
  },
  {
    title: "Hips",
    description: "Measure around the fullest part, about 8 inches below waist",
  },
  {
    title: "Length",
    description: "For shoes, measure from heel to longest toe",
  },
];

export const womensData: SizeTableData = {
  headers: ["Size", "UK", "EU", "US", "Bust", "Waist", "Hips"],
  measurements: ["size", "uk", "eu", "us", "bust", "waist", "hips"],
  data: [
    {
      size: "XS",
      uk: "6",
      eu: "34",
      us: "2",
      bust: "32",
      waist: "24",
      hips: "34",
    },
    {
      size: "S",
      uk: "8",
      eu: "36",
      us: "4",
      bust: "34",
      waist: "26",
      hips: "36",
    },
    {
      size: "M",
      uk: "10",
      eu: "38",
      us: "6",
      bust: "36",
      waist: "28",
      hips: "38",
    },
    {
      size: "L",
      uk: "12",
      eu: "40",
      us: "8",
      bust: "38",
      waist: "30",
      hips: "40",
    },
    {
      size: "XL",
      uk: "14",
      eu: "42",
      us: "10",
      bust: "40",
      waist: "32",
      hips: "42",
    },
    {
      size: "XXL",
      uk: "16",
      eu: "44",
      us: "12",
      bust: "42",
      waist: "34",
      hips: "44",
    },
  ],
};

export const mensData: SizeTableData = {
  headers: ["Size", "UK", "EU", "US", "Chest", "Waist", "Hips"],
  measurements: ["size", "uk", "eu", "us", "chest", "waist", "hips"],
  data: [
    {
      size: "XS",
      uk: "34",
      eu: "44",
      us: "XS",
      chest: "34",
      waist: "28",
      hips: "35",
    },
    {
      size: "S",
      uk: "36",
      eu: "46",
      us: "S",
      chest: "36",
      waist: "30",
      hips: "37",
    },
    {
      size: "M",
      uk: "38",
      eu: "48",
      us: "M",
      chest: "38",
      waist: "32",
      hips: "39",
    },
    {
      size: "L",
      uk: "40",
      eu: "50",
      us: "L",
      chest: "40",
      waist: "34",
      hips: "41",
    },
    {
      size: "XL",
      uk: "42",
      eu: "52",
      us: "XL",
      chest: "42",
      waist: "36",
      hips: "43",
    },
    {
      size: "XXL",
      uk: "44",
      eu: "54",
      us: "XXL",
      chest: "44",
      waist: "38",
      hips: "45",
    },
  ],
};

export const womensShoes: SizeTableData = {
  headers: ["US", "UK", "EU", "Length (cm)"],
  measurements: ["us", "uk", "eu", "length"],
  data: [
    { us: "5", uk: "2.5", eu: "35", length: "22.5" },
    { us: "5.5", uk: "3", eu: "35.5", length: "23" },
    { us: "6", uk: "3.5", eu: "36", length: "23.5" },
    { us: "6.5", uk: "4", eu: "37", length: "24" },
    { us: "7", uk: "4.5", eu: "37.5", length: "24.5" },
    { us: "7.5", uk: "5", eu: "38", length: "25" },
    { us: "8", uk: "5.5", eu: "38.5", length: "25.5" },
    { us: "8.5", uk: "6", eu: "39", length: "26" },
    { us: "9", uk: "6.5", eu: "40", length: "26.5" },
    { us: "9.5", uk: "7", eu: "40.5", length: "27" },
    { us: "10", uk: "7.5", eu: "41", length: "27.5" },
  ],
};

export const mensShoes: SizeTableData = {
  headers: ["US", "UK", "EU", "Length (cm)"],
  measurements: ["us", "uk", "eu", "length"],
  data: [
    { us: "7", uk: "6", eu: "40", length: "25" },
    { us: "7.5", uk: "6.5", eu: "40.5", length: "25.5" },
    { us: "8", uk: "7", eu: "41", length: "26" },
    { us: "8.5", uk: "7.5", eu: "41.5", length: "26.5" },
    { us: "9", uk: "8", eu: "42", length: "27" },
    { us: "9.5", uk: "8.5", eu: "42.5", length: "27.5" },
    { us: "10", uk: "9", eu: "43", length: "28" },
    { us: "10.5", uk: "9.5", eu: "43.5", length: "28.5" },
    { us: "11", uk: "10", eu: "44", length: "29" },
    { us: "11.5", uk: "10.5", eu: "44.5", length: "29.5" },
    { us: "12", uk: "11", eu: "45", length: "30" },
    { us: "13", uk: "12", eu: "46", length: "31" },
  ],
};

export const sizeCategories: Record<string, SizeCategory> = {
  women: {
    id: "women",
    name: "Women's Sizing",
    tables: {
      clothing: womensData,
      shoes: womensShoes,
    },
  },
  men: {
    id: "men",
    name: "Men's Sizing",
    tables: {
      clothing: mensData,
      shoes: mensShoes,
    },
  },
  unisex: {
    id: "unisex",
    name: "Unisex Sizing",
    tables: {
      clothing: womensData, // Default to women's for unisex
      shoes: womensShoes,
    },
  },
};

// Helper function to determine size category from product category
export const getSizeCategoryFromProduct = (
  productCategory?: string
): string => {
  if (!productCategory) return "unisex";

  const category = productCategory.toLowerCase();

  if (category.includes("women") || category.includes("female")) return "women";
  if (category.includes("men") || category.includes("male")) return "men";

  return "unisex";
};

// Helper function to determine product type
export const getProductTypeFromCategory = (
  productCategory?: string
): "tops" | "bottoms" | "shoes" | "accessories" => {
  if (!productCategory) return "tops";

  const category = productCategory.toLowerCase();

  if (
    category.includes("shoe") ||
    category.includes("sneaker") ||
    category.includes("boot")
  )
    return "shoes";
  if (
    category.includes("bottom") ||
    category.includes("pant") ||
    category.includes("jean") ||
    category.includes("short")
  )
    return "bottoms";
  if (
    category.includes("accessor") ||
    category.includes("bag") ||
    category.includes("hat") ||
    category.includes("belt")
  )
    return "accessories";

  return "tops"; // Default to tops for shirts, dresses, etc.
};
