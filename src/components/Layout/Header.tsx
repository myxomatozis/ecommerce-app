import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Search, Heart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores";
import { Button } from "@/components/UI";

const Header: React.FC = () => {
  const cartSummary = useCartStore((state) => state.cartSummary);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "New Arrivals", href: "/products?sort=newest" },
    { name: "Women", href: "/products?category=women" },
    { name: "Men", href: "/products?category=men" },
    { name: "Accessories", href: "/products?category=accessories" },
    { name: "Sale", href: "/products?sale=true" },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.search.includes(path.split("?")[1])
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              StyleHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 pl-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  isActive(item.href)
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 justify-end ml-auto">
            {/* Search Icon */}
            <Button
              as={Link}
              to="/products"
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Search"
            >
              <Search size={20} />
            </Button>

            {/* Wishlist Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Button>

            {/* Cart Icon */}
            <Button
              onClick={() => setIsCartOpen(!isCartOpen)}
              variant="ghost"
              size="sm"
              className="relative p-2 text-gray-600 hover:text-gray-900"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {cartSummary.item_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {cartSummary.item_count}
                </span>
              )}
            </Button>

            {/* User Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex p-2 text-gray-600 hover:text-gray-900"
              aria-label="Account"
            >
              <User size={20} />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile User Link */}
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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
