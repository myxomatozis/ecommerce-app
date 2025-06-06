import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button, Card, CardContent, Input } from "@/components/UI";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqData: FAQItem[] = [
    // Shipping & Delivery
    {
      id: "shipping-1",
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days. We also offer expedited shipping (2-3 business days) and overnight delivery. Free shipping is available on orders over $100.",
      category: "shipping",
    },
    {
      id: "shipping-2",
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping times vary by destination, typically 7-14 business days. Customs duties and taxes may apply and are the responsibility of the customer.",
      category: "shipping",
    },
    {
      id: "shipping-3",
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by visiting our order tracking page or logging into your account.",
      category: "shipping",
    },

    // Orders & Payment
    {
      id: "orders-1",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through Stripe.",
      category: "orders",
    },
    {
      id: "orders-2",
      question: "Can I modify or cancel my order?",
      answer:
        "You can modify or cancel your order within 1 hour of placing it. After that, orders enter our fulfillment process and cannot be changed. Please contact customer service immediately if you need to make changes.",
      category: "orders",
    },
    {
      id: "orders-3",
      question: "Do you offer gift cards?",
      answer:
        "Yes, we offer digital gift cards in denominations from $25 to $500. Gift cards never expire and can be used for any purchase on our website.",
      category: "orders",
    },

    // Returns & Exchanges
    {
      id: "returns-1",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unworn items in original condition with tags attached. Items must be returned in original packaging. Return shipping is free for exchanges or store credit.",
      category: "returns",
    },
    {
      id: "returns-2",
      question: "How do I start a return?",
      answer:
        "To start a return, visit our returns page and enter your order number and email. You'll receive a prepaid return label and instructions. Refunds are processed within 3-5 business days after we receive your return.",
      category: "returns",
    },
    {
      id: "returns-3",
      question: "Can I exchange an item for a different size?",
      answer:
        "Yes, we offer free exchanges for different sizes within 30 days. Use our return process and select 'exchange' as your reason. We'll send the new size as soon as we receive your return.",
      category: "returns",
    },

    // Sizing & Products
    {
      id: "sizing-1",
      question: "How do I find the right size?",
      answer:
        "Each product page includes a detailed size chart. We recommend measuring yourself and comparing to our size guide. If you're between sizes, we generally recommend sizing up for a more comfortable fit.",
      category: "sizing",
    },
    {
      id: "sizing-2",
      question: "Are your products true to size?",
      answer:
        "Our products generally run true to size, but fit can vary by brand and style. We include fit notes on each product page and customer reviews often mention sizing feedback.",
      category: "sizing",
    },
    {
      id: "sizing-3",
      question: "Do you restock sold-out items?",
      answer:
        "Some items are restocked regularly, while others are limited edition. You can sign up for restock notifications on product pages. We also release new collections monthly.",
      category: "sizing",
    },

    // Account & General
    {
      id: "account-1",
      question: "Do I need an account to place an order?",
      answer:
        "No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, view order history, and get faster checkout.",
      category: "account",
    },
    {
      id: "account-2",
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within a few minutes. Check your spam folder if you don't see it.",
      category: "account",
    },
    {
      id: "general-1",
      question: "How can I contact customer service?",
      answer:
        "You can reach us via email at hello@thefolkproject.com, phone at +1 (555) 123-4567, or through our contact form. Our team responds to emails within 24 hours during business days.",
      category: "general",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "shipping", name: "Shipping & Delivery" },
    { id: "orders", name: "Orders & Payment" },
    { id: "returns", name: "Returns & Exchanges" },
    { id: "sizing", name: "Sizing & Products" },
    { id: "account", name: "Account" },
    { id: "general", name: "General" },
  ];

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setOpenItems([]); // Close all items when switching categories
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Button
            as={Link}
            to="/"
            variant="ghost"
            leftIcon={<ArrowLeft size={16} />}
            className="text-gray-600 hover:text-gray-900"
          >
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-light text-gray-900">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-500">
              Find answers to common questions about shopping with The Folk
            </p>
          </div>

          {/* Search */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={20} />}
                fullWidth
              />
            </CardContent>
          </Card>

          {/* Categories */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    variant={
                      selectedCategory === category.id ? "primary" : "ghost"
                    }
                    size="sm"
                    fullWidth
                    className="justify-start"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card variant="outlined" className="border-gray-100">
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No questions found matching your search.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Clear filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((item) => (
                <Card
                  key={item.id}
                  variant="outlined"
                  className="border-gray-100"
                >
                  <CardContent padding="none">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 pr-4">
                        {item.question}
                      </h3>
                      {openItems.includes(item.id) ? (
                        <ChevronUp
                          size={20}
                          className="text-gray-400 flex-shrink-0"
                        />
                      ) : (
                        <ChevronDown
                          size={20}
                          className="text-gray-400 flex-shrink-0"
                        />
                      )}
                    </button>

                    {openItems.includes(item.id) && (
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Still Need Help */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <div className="text-center space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Still need help?
                </h2>
                <p className="text-gray-500">
                  Can't find what you're looking for? Our customer service team
                  is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button as={Link} to="/contact" variant="primary" size="md">
                    Contact Support
                  </Button>
                  <Button
                    as="a"
                    href="mailto:hello@thefolkproject.com"
                    variant="outline"
                    size="md"
                  >
                    Email Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 text-center">
              Quick Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                as={Link}
                to="/shipping"
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Shipping Information
              </Button>
              <Button
                as={Link}
                to="/returns"
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Return Policy
              </Button>
              <Button
                as={Link}
                to="/size-guide"
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Size Guide
              </Button>
              <Button
                as={Link}
                to="/track-order"
                variant="ghost"
                size="sm"
                fullWidth
                className="justify-start text-gray-600 hover:text-gray-900"
              >
                Track Your Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
