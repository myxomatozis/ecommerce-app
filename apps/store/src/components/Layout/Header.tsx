import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores";
import { Button, IconCounter } from "@thefolk/ui";
import { useScroll } from "@/context/ScrollContext";

const Header: React.FC = () => {
  const { cartSummary, setIsCartOpen } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScroll();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // State for product detail page scroll behavior
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigation = [
    { name: "New Arrivals", category: null, sort: "newest", sale: null },
    { name: "Women", category: "women", sort: null, sale: null },
    { name: "Men", category: "men", sort: null, sale: null },
    { name: "Accessories", category: "accessories", sort: null, sale: null },
    { name: "Sale", category: null, sort: null, sale: "true" },
  ];

  const isHomePage = location.pathname === "/";
  const isProductDetailPage =
    location.pathname.startsWith("/products/") &&
    location.pathname.split("/").length === 3;

  // Scroll handler for product detail page
  useEffect(() => {
    if (!isProductDetailPage) {
      setIsHeaderVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Header behavior for product detail page
      if (currentScrollY < 80) {
        // Show header when near top
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Hide header when scrolling down past 80px
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show header when scrolling up
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProductDetailPage, lastScrollY]);

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

  // Determine header classes based on page and scroll state
  const getHeaderClasses = () => {
    const baseClasses =
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out";

    if (isProductDetailPage) {
      // Product detail page: sliding behavior
      const transformClass = isHeaderVisible
        ? "translate-y-0"
        : "-translate-y-full";
      const backdropClass =
        scrollY > 20
          ? "bg-white/95 backdrop-blur-lg border-b border-neutral-100 shadow-sm"
          : "bg-white/95 backdrop-blur-lg border-b border-neutral-100";
      return `${baseClasses} ${transformClass} ${backdropClass}`;
    } else {
      // Other pages: standard fixed behavior
      if (isHomePage) {
        return `${baseClasses} ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-neutral-100 shadow-sm"
            : "bg-transparent"
        }`;
      } else {
        return `${baseClasses} bg-white/95 backdrop-blur-lg border-b border-neutral-100`;
      }
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className={getHeaderClasses()}>
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
                ${
                  isHomePage && !isScrolled && !isProductDetailPage
                    ? "text-white"
                    : "text-neutral-900"
                }
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
                        : isHomePage && !isScrolled && !isProductDetailPage
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
                    isHomePage && !isScrolled && !isProductDetailPage
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
                    isHomePage && !isScrolled && !isProductDetailPage
                      ? "text-white hover:text-white/75"
                      : "text-neutral-600 hover:text-neutral-900"
                  }
                `}
              >
                <ShoppingBag size={24} />
                <IconCounter
                  count={cartSummary.item_count}
                  max={9}
                  size="sm"
                  className="top-0 right-1"
                />
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
