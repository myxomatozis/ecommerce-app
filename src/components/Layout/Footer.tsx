import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social Media Icons */}
          <div className="flex space-x-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={social.name}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              ©{currentYear} The Folk. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
