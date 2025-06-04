import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Send,
  ArrowUp,
} from "lucide-react";
import { Button, Input, Card, CardContent, Badge } from "@/components/UI";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "Electronics", href: "/products?category=electronics" },
      { name: "Clothing", href: "/products?category=clothing" },
      { name: "Home & Garden", href: "/products?category=home" },
      { name: "Sale Items", href: "/products?sale=true" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Track Order", href: "/track" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Refund Policy", href: "/refunds" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com",
      color: "hover:text-gray-900",
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribing(false);
    setEmail("");
    // Show success message in real app
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link
                to="/"
                className="text-2xl font-bold text-gray-900 mb-4 block"
              >
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  ModernStore
                </span>
              </Link>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Discover premium products with exceptional quality. We're
                committed to providing the best shopping experience with fast
                shipping and outstanding customer service.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors">
                  <Mail size={18} className="text-primary-600" />
                  <span>hello@modernstore.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors">
                  <Phone size={18} className="text-primary-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-colors">
                  <MapPin size={18} className="text-primary-600" />
                  <span>123 Commerce St, City, State 12345</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-2 mt-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="sm"
                      className={`text-gray-400 ${social.color} transition-colors`}
                      aria-label={social.name}
                    >
                      <Icon size={20} />
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Shop
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Button
                      as={Link}
                      to={link.href}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-primary-600 justify-start p-0 h-auto font-normal"
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Button
                      as={Link}
                      to={link.href}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-primary-600 justify-start p-0 h-auto font-normal"
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Button
                      as={Link}
                      to={link.href}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-primary-600 justify-start p-0 h-auto font-normal"
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Button
                      as={Link}
                      to={link.href}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-primary-600 justify-start p-0 h-auto font-normal"
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="mt-12 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
            <CardContent>
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Stay in the loop
                </h3>
                <p className="text-gray-600 mb-6">
                  Subscribe to our newsletter for the latest updates, exclusive
                  offers, and style inspiration.
                </p>
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    leftIcon={<Mail size={18} />}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubscribing}
                    rightIcon={!isSubscribing ? <Send size={16} /> : undefined}
                    className="whitespace-nowrap"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
                <p className="text-sm text-gray-500 mt-3">
                  No spam, unsubscribe at any time. By subscribing, you agree to
                  our Privacy Policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              © {currentYear} ModernStore. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">We accept:</span>
              <div className="flex space-x-2">
                <Badge variant="secondary" size="sm">
                  VISA
                </Badge>
                <Badge variant="secondary" size="sm">
                  MC
                </Badge>
                <Badge variant="secondary" size="sm">
                  AMEX
                </Badge>
                <Badge variant="secondary" size="sm">
                  PayPal
                </Badge>
                <Badge variant="secondary" size="sm">
                  Apple Pay
                </Badge>
              </div>
            </div>

            {/* Back to Top */}
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-primary-600"
              leftIcon={<ArrowUp size={16} />}
            >
              Back to Top
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <Card className="mb-6 bg-gray-50 border-gray-200">
          <CardContent padding="sm">
            <div className="flex flex-wrap justify-center items-center gap-6 text-center">
              <div className="flex items-center space-x-2">
                <Badge variant="success" dot />
                <span className="text-sm text-gray-600">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success" dot />
                <span className="text-sm text-gray-600">Free Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success" dot />
                <span className="text-sm text-gray-600">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success" dot />
                <span className="text-sm text-gray-600">Fast Shipping</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
};

export default Footer;
