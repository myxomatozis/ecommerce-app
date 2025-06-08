import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import SupabaseAPI from "@/lib/supabase";
import { toast } from "@/utils/toast";
import { Button } from "@thefolk/ui";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      await SupabaseAPI.submitContactForm(formData);
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit contact form. Please try again later.");
      console.error("Error submitting contact form:", error);
    }

    setIsSubmitting(false);
  };

  const isFormValid =
    formData.name.trim() && formData.email.trim() && formData.message.trim();

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
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

        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-8">
            <CheckCircle size={32} className="text-gray-700" />
          </div>

          <h1 className="text-3xl font-light text-gray-900 mb-4">
            Message Sent
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>

          <Button
            onClick={() => setSubmitted(false)}
            variant="primary"
            size="lg"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

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
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">
                Get in Touch
              </h1>
              <p className="text-gray-500">We'd love to hear from you</p>
            </div>

            <Card variant="outlined" className="border-gray-100">
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    fullWidth
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    leftIcon={<Mail size={20} />}
                    fullWidth
                    required
                  />

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    helperText="Optional"
                    fullWidth
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!isFormValid}
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card variant="outlined" className="border-gray-100">
              <CardContent>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Email</p>
                      <a
                        href="mailto:hello@thefolkproject.com"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        hello@thefolkproject.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Phone size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Phone</p>
                      <a
                        href="tel:+15551234567"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Address</p>
                      <div className="text-gray-600 text-sm">
                        <p>123 Fashion Street</p>
                        <p>New York, NY 10001</p>
                        <p>United States</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card variant="outlined" className="border-gray-100">
              <CardContent>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Business Hours
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900 font-medium">
                      9:00 AM - 6:00 PM EST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900 font-medium">
                      10:00 AM - 4:00 PM EST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-900 font-medium">Closed</span>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                  We typically respond to emails within 24 hours during business
                  days
                </div>
              </CardContent>
            </Card>

            {/* Quick Help Links */}
            <Card variant="outlined" className="border-gray-100">
              <CardContent>
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Need Quick Help?
                </h2>

                <div className="space-y-3">
                  <Button
                    as={Link}
                    to="/faq"
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start text-gray-600 hover:text-gray-900"
                  >
                    Frequently Asked Questions
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
                    Returns & Exchanges
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Support */}
        <div className="mt-16 pt-16 border-t border-gray-100">
          <Card variant="outlined" className="border-gray-100">
            <CardContent className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Still need help?
              </h3>
              <p className="text-gray-500 mb-6">
                Check out our comprehensive help center or browse frequently
                asked questions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button as={Link} to="/help" variant="outline" size="md">
                  Visit Help Center
                </Button>
                <Button as={Link} to="/faq" variant="ghost" size="md">
                  Browse FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
