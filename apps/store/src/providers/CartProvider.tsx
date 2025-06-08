// src/providers/CartProvider.tsx
import React, { useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const loadCartData = useCartStore((state) => state.loadCartData);

  useEffect(() => {
    // Initialize cart data when the app starts
    loadCartData();
  }, [loadCartData]);

  return <>{children}</>;
};
