import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Mail, Shield, FileText } from "lucide-react";
import { Button, Card, CardContent } from "@thefolk/ui";

const LegalPage: React.FC = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<"privacy" | "terms">(
    location.pathname === "/terms" ? "terms" : "privacy"
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Update active section based on URL
    if (location.pathname === "/terms") {
      setActiveSection("terms");
      scrollToSection("terms-of-service");
    } else {
      setActiveSection("privacy");
      scrollToSection("privacy-policy");
    }
  }, [location.pathname]);

  const lastUpdated = "December 1, 2024";

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
              Legal Information
            </h1>
            <p className="text-lg text-gray-500">
              Privacy Policy and Terms of Service
            </p>
            <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>
          </div>

          {/* Section Navigation */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  as={Link}
                  to="/privacy"
                  variant={activeSection === "privacy" ? "primary" : "ghost"}
                  leftIcon={<Shield size={16} />}
                  fullWidth
                >
                  Privacy Policy
                </Button>
                <Button
                  as={Link}
                  to="/terms"
                  variant={activeSection === "terms" ? "primary" : "ghost"}
                  leftIcon={<FileText size={16} />}
                  fullWidth
                >
                  Terms of Service
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <div id="privacy-policy">
            <Card variant="outlined" className="border-gray-100">
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <Shield size={24} className="text-gray-600" />
                    <h2 className="text-2xl font-light text-gray-900">
                      Privacy Policy
                    </h2>
                  </div>

                  <div className="space-y-6 text-gray-600 leading-relaxed">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Information We Collect
                      </h3>
                      <p className="mb-4">
                        We collect information you provide directly to us, such
                        as when you create an account, make a purchase,
                        subscribe to our newsletter, or contact us for support.
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          Personal information (name, email address, phone
                          number)
                        </li>
                        <li>Shipping and billing addresses</li>
                        <li>
                          Payment information (processed securely by our payment
                          processor)
                        </li>
                        <li>Order history and preferences</li>
                        <li>Communications with customer service</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        How We Use Your Information
                      </h3>
                      <p className="mb-4">
                        We use the information we collect to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Process and fulfill your orders</li>
                        <li>
                          Communicate with you about your orders and account
                        </li>
                        <li>Provide customer support</li>
                        <li>
                          Send you marketing communications (with your consent)
                        </li>
                        <li>Improve our products and services</li>
                        <li>Comply with legal obligations</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Information Sharing
                      </h3>
                      <p className="mb-4">
                        We do not sell, trade, or otherwise transfer your
                        personal information to third parties except as
                        described in this policy:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          Service providers who assist in our operations
                          (shipping, payment processing)
                        </li>
                        <li>Legal requirements or to protect our rights</li>
                        <li>Business transfers (mergers, acquisitions)</li>
                        <li>With your explicit consent</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Data Security
                      </h3>
                      <p>
                        We implement appropriate technical and organizational
                        measures to protect your personal information against
                        unauthorized access, alteration, disclosure, or
                        destruction. All payment information is processed using
                        secure encryption technology.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Your Rights
                      </h3>
                      <p className="mb-4">You have the right to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Access and update your personal information</li>
                        <li>Request deletion of your personal information</li>
                        <li>Opt out of marketing communications</li>
                        <li>Request a copy of your data</li>
                        <li>
                          Object to processing of your personal information
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Cookies and Tracking
                      </h3>
                      <p>
                        We use cookies and similar technologies to enhance your
                        browsing experience, analyze website traffic, and
                        understand user preferences. You can control cookie
                        settings through your browser preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terms of Service */}
          <div id="terms-of-service">
            <Card variant="outlined" className="border-gray-100">
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <FileText size={24} className="text-gray-600" />
                    <h2 className="text-2xl font-light text-gray-900">
                      Terms of Service
                    </h2>
                  </div>

                  <div className="space-y-6 text-gray-600 leading-relaxed">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Acceptance of Terms
                      </h3>
                      <p>
                        By accessing and using The Folk's website and services,
                        you accept and agree to be bound by the terms and
                        provision of this agreement. If you do not agree to
                        abide by the above, please do not use this service.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Use License
                      </h3>
                      <p className="mb-4">
                        Permission is granted to temporarily download one copy
                        of The Folk's materials for personal, non-commercial
                        transitory viewing only. This is the grant of a license,
                        not a transfer of title, and under this license you may
                        not:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Modify or copy the materials</li>
                        <li>
                          Use the materials for commercial purposes or public
                          display
                        </li>
                        <li>Attempt to reverse engineer any software</li>
                        <li>Remove any copyright or proprietary notations</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Product Information
                      </h3>
                      <p>
                        We strive to provide accurate product descriptions,
                        pricing, and availability information. However, we do
                        not warrant that product descriptions or other content
                        is accurate, complete, reliable, or error-free. We
                        reserve the right to correct any errors and update
                        information at any time.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Orders and Payment
                      </h3>
                      <p className="mb-4">
                        By placing an order, you agree to provide accurate and
                        complete information. We reserve the right to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Refuse or cancel any order for any reason</li>
                        <li>Limit quantities on any product or service</li>
                        <li>Verify information before processing orders</li>
                        <li>Cancel orders if payment cannot be processed</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Returns and Refunds
                      </h3>
                      <p>
                        Returns are accepted within 30 days of purchase for
                        unworn items in original condition with tags attached.
                        Refunds will be processed using the original payment
                        method within 3-5 business days of receiving the
                        returned item.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        User Accounts
                      </h3>
                      <p className="mb-4">
                        When creating an account, you agree to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your password</li>
                        <li>
                          Accept responsibility for all activities under your
                          account
                        </li>
                        <li>Notify us immediately of any unauthorized use</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Limitation of Liability
                      </h3>
                      <p>
                        The Folk shall not be liable for any indirect,
                        incidental, special, consequential, or punitive damages,
                        including without limitation, loss of profits, data,
                        use, goodwill, or other intangible losses, resulting
                        from your use of our services.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Governing Law
                      </h3>
                      <p>
                        These terms and conditions are governed by and construed
                        in accordance with the laws of New York State, and you
                        irrevocably submit to the exclusive jurisdiction of the
                        courts in that state or location.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Changes to Terms
                      </h3>
                      <p>
                        We reserve the right to modify these terms at any time.
                        Changes will be effective immediately upon posting. Your
                        continued use of our services after any changes
                        constitutes acceptance of the new terms.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Mail size={24} className="text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Questions About This Policy?
                  </h2>
                </div>
                <p className="text-gray-500">
                  If you have any questions about our Privacy Policy or Terms of
                  Service, please contact us.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> legal@thefolkproject.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Address:</strong> 123 Fashion Street, New York, NY
                    10001
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button as={Link} to="/contact" variant="primary" size="md">
                    Contact Us
                  </Button>
                  <Button
                    as="a"
                    href="mailto:legal@thefolkproject.com"
                    variant="outline"
                    size="md"
                  >
                    Email Legal Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Related Pages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                as={Link}
                to="/faq"
                variant="ghost"
                size="sm"
                fullWidth
                className="text-gray-600 hover:text-gray-900"
              >
                FAQ
              </Button>
              <Button
                as={Link}
                to="/shipping"
                variant="ghost"
                size="sm"
                fullWidth
                className="text-gray-600 hover:text-gray-900"
              >
                Shipping Policy
              </Button>
              <Button
                as={Link}
                to="/returns"
                variant="ghost"
                size="sm"
                fullWidth
                className="text-gray-600 hover:text-gray-900"
              >
                Return Policy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
