import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  const popularPages = [
    { name: "All Products", href: "/products" },
    { name: "New Arrivals", href: "/products?sort=newest" },
    { name: "Women", href: "/products?category=women" },
    { name: "Men", href: "/products?category=men" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* 404 Content */}
        <div className="text-center mb-16">
          <div className="text-8xl font-light text-gray-200 mb-8">404</div>

          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            The page you're looking for doesn't exist
          </p>
        </div>

        {/* Search */}
        <div className="mb-16">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center">
            Try searching for what you need
          </h2>

          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded focus:border-gray-900 focus:ring-0 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular Pages */}
        <div className="mb-16">
          <h2 className="text-lg font-medium text-gray-900 mb-6 text-center">
            Popular Destinations
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {popularPages.map((page, index) => (
              <Link
                key={index}
                to={page.href}
                className="p-4 text-center border border-gray-200 hover:border-gray-900 transition-colors group"
              >
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  {page.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Home Link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-gray-900 text-white px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
        </div>

        {/* Help */}
        <div className="text-center mt-16 pt-16 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Still can't find what you're looking for?
          </h3>
          <a
            href="mailto:support@thefolkproject.com"
            className="text-gray-900 underline hover:no-underline transition-all"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
