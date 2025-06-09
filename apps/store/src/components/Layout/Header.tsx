import React, { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores";
import { Button, IconCounter } from "@thefolk/ui";

const Header: React.FC = () => {
  const { cartSummary, isCartOpen, setIsCartOpen } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const navigation = [
    { name: "New Arrivals", category: null, sort: "newest", sale: null },
    { name: "Women", category: "women", sort: null, sale: null },
    { name: "Men", category: "men", sort: null, sale: null },
    { name: "Accessories", category: "accessories", sort: null, sale: null },
    { name: "Sale", category: null, sort: null, sale: "true" },
  ];

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
      return {
        pathname: "/products",
        search: `?${queryString}`,
      };
    }
    return "/products";
  };

  return (
    <header className="bg-white border-b border-neutral-200/50 sticky top-0 z-50 backdrop-blur-md">
      <div className="container-modern">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-medium text-neutral-900 hover:text-neutral-600 transition-colors duration-300"
            >
              The Folk
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, idx) => {
              const isItemActive = isActive(item);
              const to = buildToOptions(item);
              return (
                <Link
                  key={`${item.name}-${idx}`}
                  to={to}
                  className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                    isItemActive
                      ? "text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {item.name}
                  {isItemActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-900" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <Button
              as={Link}
              to="/products"
              variant="ghost"
              size="sm"
              className="p-2 text-neutral-600 hover:text-neutral-900 h-9 w-9"
              aria-label="Search"
            >
              <Search size={24} />
            </Button>

            {/* Cart Icon */}
            <Button
              onClick={() => setIsCartOpen(!isCartOpen)}
              variant="ghost"
              size="sm"
              className="relative p-2 text-neutral-600 hover:text-neutral-900 h-9 w-9"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={24} />
              <IconCounter
                count={cartSummary.item_count}
                max={9}
                size="xs"
                className="top-0 right-0"
              />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 h-9 w-9"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/50 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isItemActive = isActive(item);
                const url = buildToOptions(item);
                return (
                  <Link
                    key={`mobile-${item.name}-${url}`}
                    to={url}
                    reloadDocument={location.pathname === "/products"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                      isItemActive
                        ? "text-neutral-900 bg-neutral-50"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile User Link */}
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors duration-300"
              >
                My Account
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
