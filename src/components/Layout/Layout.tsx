import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "../Cart/CartSidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layout;
