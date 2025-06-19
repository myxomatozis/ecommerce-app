import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "../Cart/CartSidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Check if we're on a page that needs different spacing
  const isHomePage = location.pathname === "/";
  const isProductDetailPage =
    location.pathname.startsWith("/products/") &&
    location.pathname.split("/").length === 3;

  // Determine the main content classes based on the page
  const getMainClasses = () => {
    if (isHomePage) {
      // Homepage: no top padding since hero section covers full viewport
      return "flex-1";
    } else if (isProductDetailPage) {
      // Product detail: minimal padding since header slides away
      return "flex-1 pt-20";
    } else {
      // Other pages: standard padding for fixed header
      return "flex-1 pt-20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className={getMainClasses()}>{children}</main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layout;
