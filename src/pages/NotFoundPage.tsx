import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  ArrowLeft,
  ShoppingBag,
  Package,
  Users,
  Headphones,
} from "lucide-react";
import { Button, Card, CardContent, Input, Badge } from "@/components/UI";

const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const popularPages = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      description: "Return to our homepage",
    },
    {
      name: "All Products",
      href: "/products",
      icon: ShoppingBag,
      description: "Browse our full catalog",
    },
    {
      name: "Electronics",
      href: "/products?category=electronics",
      icon: Headphones,
      description: "Tech gadgets and devices",
    },
    {
      name: "New Arrivals",
      href: "/products?sort=newest",
      icon: Package,
      description: "Latest products added",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 404 Illustration */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-primary-600 mb-4 animate-bounce-in">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Search size={120} className="text-gray-300" />
                </div>
                <div className="relative bg-white rounded-full w-32 h-32 flex items-center justify-center shadow-lg animate-bounce-in">
                  <ShoppingBag size={48} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <Badge variant="warning" size="lg" className="mb-6">
            <Users size={16} className="mr-1" />
            Page Not Found
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Lost in the Store?
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            The page you're looking for seems to have wandered off into the
            digital wilderness. Don't worry, even the best explorers get lost
            sometimes!
          </p>
          <p className="text-gray-500 mb-8">
            Let's get you back on track with some helpful options below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => window.history.back()}
            variant="primary"
            size="lg"
            leftIcon={<ArrowLeft size={20} />}
          >
            Go Back
          </Button>

          <Button
            as={Link}
            to="/"
            variant="secondary"
            size="lg"
            leftIcon={<Home size={20} />}
          >
            Go Home
          </Button>
        </div>

        {/* Search Suggestion */}
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardContent>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Try searching for what you need
            </h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={20} />}
                fullWidth
              />
              <Button
                type="submit"
                variant="primary"
                className="whitespace-nowrap"
              >
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularPages.map((page, index) => {
                const Icon = page.icon;
                return (
                  <Card
                    key={index}
                    hover
                    variant="outlined"
                    className="transition-all duration-200 hover:border-primary-300 hover:shadow-md group"
                  >
                    <CardContent padding="sm">
                      <Link
                        to={page.href}
                        className="flex items-start space-x-3 text-left"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 group-hover:bg-primary-100 rounded-lg flex items-center justify-center transition-colors">
                          <Icon
                            size={20}
                            className="text-gray-600 group-hover:text-primary-600 transition-colors"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                            {page.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {page.description}
                          </p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                Our customer support team is here to help you find what you're
                looking for.
              </p>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600 hover:text-primary-700"
                >
                  📧 Contact Support
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600 hover:text-primary-700"
                >
                  💬 Live Chat
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600 hover:text-primary-700"
                >
                  📞 Call Us
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quick Links
              </h3>
              <p className="text-gray-600 mb-4">
                Jump to the most commonly visited sections of our store.
              </p>
              <div className="space-y-2">
                <Button
                  as={Link}
                  to="/products?sale=true"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600 hover:text-primary-700"
                >
                  🏷️ Sale Items
                </Button>
                <Button
                  as={Link}
                  to="/products?featured=true"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600 hover:text-primary-700"
                >
                  ⭐ Featured Products
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  className="justify-start text-primary-600 hover:text-primary-700"
                >
                  ℹ️ About Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fun Fact */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent>
            <div className="text-center">
              <Badge variant="info" size="lg" className="mb-3">
                💡 Fun Fact
              </Badge>
              <p className="text-sm text-blue-800 leading-relaxed">
                The term "404" comes from the room number at CERN where the
                first web server was located. When a page couldn't be found, it
                was like saying "it's not in room 404!" Now you know a bit of
                internet history! 🌐
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Still can't find what you're looking for?
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-600 hover:text-primary-700 ml-1 p-0 h-auto"
            >
              Let us know
            </Button>
            and we'll help you out!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
