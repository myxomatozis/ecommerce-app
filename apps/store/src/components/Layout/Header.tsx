import React, { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores";
import { Button, IconCounter } from "@thefolk/ui";
import { useScroll } from "@/context/ScrollContext";

const Header: React.FC = () => {
  const { cartSummary, isCartOpen, setIsCartOpen } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScroll();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const navigation = [
    { name: "New Arrivals", category: null, sort: "newest", sale: null },
    { name: "Women", category: "women", sort: null, sale: null },
    { name: "Men", category: "men", sort: null, sale: null },
    { name: "Accessories", category: "accessories", sort: null, sale: null },
    { name: "Sale", category: null, sort: null, sale: "true" },
  ];

  const isHomePage = location.pathname === "/";

  const isActive = (item: (typeof navigation)[0]) => {
    if (location.pathname !== "/products") return false;
    const currentCategory = searchParams.get("category");
    const currentSort = searchParams.get("sort");
    const currentSale = searchParams.get("sale");
    return (
      currentCategory === item.category &&
      currentSort === item.sort &&
      currentSale === item.sale
    );
  };

  const buildToOptions = (item: (typeof navigation)[0]) => {
    const params = new URLSearchParams();
    if (item.category) params.set("category", item.category);
    if (item.sort) params.set("sort", item.sort);
    if (item.sale) params.set("sale", item.sale);
    const queryString = params.toString();
    if (queryString) {
      return { pathname: "/products", search: `?${queryString}` };
    }
    return "/products";
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
          ${
            isHomePage
              ? isScrolled
                ? "bg-white/95 backdrop-blur-lg border-b border-neutral-100 shadow-sm"
                : "bg-transparent"
              : "bg-white/95 backdrop-blur-lg border-b border-neutral-100"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-neutral-700" />
                ) : (
                  <Menu size={20} className="text-neutral-700" />
                )}
              </Button>
            </div>

            {/* Logo */}
            <Link
              to="/"
              className={`
                text-2xl font-light tracking-tight transition-colors duration-300
                ${isHomePage && !isScrolled ? "text-white" : "text-neutral-900"}
                hover:opacity-75
              `}
            >
              The Folk
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={buildToOptions(item)}
                  className={`
                    text-sm font-normal tracking-wide transition-all duration-300 relative
                    ${
                      isActive(item)
                        ? "text-neutral-900"
                        : isHomePage && !isScrolled
                          ? "text-white/90 hover:text-white"
                          : "text-neutral-600 hover:text-neutral-900"
                    }
                  `}
                >
                  {item.name}
                  {/* Active indicator */}
                  {isActive(item) && (
                    <div className="absolute -bottom-6 left-0 right-0 h-px bg-neutral-900" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`
                  p-2 transition-colors duration-300
                  ${
                    isHomePage && !isScrolled
                      ? "text-white hover:text-white/75"
                      : "text-neutral-600 hover:text-neutral-900"
                  }
                `}
              >
                <Search size={18} />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className={`
                  p-2 relative transition-colors duration-300
                  ${
                    isHomePage && !isScrolled
                      ? "text-white hover:text-white/75"
                      : "text-neutral-600 hover:text-neutral-900"
                  }
                `}
              >
                <ShoppingBag size={18} />
                {cartSummary.totalItems > 0 && (
                  <IconCounter
                    count={cartSummary.totalItems}
                    className="absolute -top-1 -right-1 bg-neutral-900 text-white"
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-20 left-0 right-0 bg-white border-b border-neutral-100 shadow-lg">
            <nav className="max-w-7xl mx-auto px-6 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={buildToOptions(item)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    block text-lg font-normal tracking-wide transition-colors duration-300
                    ${
                      isActive(item)
                        ? "text-neutral-900 font-medium"
                        : "text-neutral-600 hover:text-neutral-900"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
