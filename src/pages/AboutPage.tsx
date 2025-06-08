import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Users, Star, Award } from "lucide-react";
import { Button, Card, CardContent } from "@/components/UI";

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description:
        "We carefully curate every product to ensure it meets our high standards for quality and craftsmanship.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description:
        "Our customers are at the heart of everything we do. We're committed to providing exceptional service and support.",
    },
    {
      icon: Star,
      title: "Style & Innovation",
      description:
        "We stay ahead of trends while maintaining timeless appeal, bringing you the latest in fashion innovation.",
    },
    {
      icon: Award,
      title: "Sustainability",
      description:
        "We're committed to responsible practices and working with brands that share our environmental values.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Products Curated" },
    { number: "5+", label: "Years of Excellence" },
    { number: "99%", label: "Customer Satisfaction" },
  ];

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
        <div className="space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-light text-gray-900">
              About The Folk
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              We believe style is personal, and everyone deserves access to
              quality fashion that expresses their unique identity.
            </p>
          </div>

          {/* Our Story */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2019, The Folk began as a simple idea: to make
                  quality fashion accessible to everyone. What started as a
                  small online boutique has grown into a curated marketplace
                  featuring carefully selected pieces from emerging and
                  established designers.
                </p>
                <p>
                  We believe that great style shouldn't come at the expense of
                  quality or ethics. That's why we work closely with our
                  partners to ensure every product meets our standards for
                  craftsmanship, sustainability, and design excellence.
                </p>
                <p>
                  Today, we're proud to serve customers worldwide, helping them
                  discover their personal style through thoughtfully curated
                  collections that blend contemporary trends with timeless
                  appeal.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Our Values */}
          <div className="space-y-8">
            <h2 className="text-xl font-medium text-gray-900 text-center">
              Our Values
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  className="border-gray-100"
                >
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <value.icon size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <h2 className="text-xl font-medium text-gray-900 mb-8 text-center">
                By the Numbers
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-light text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mission Statement */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Our Mission
              </h2>
              <div className="text-center">
                <p className="text-lg text-gray-600 leading-relaxed italic">
                  "To democratize access to quality fashion while supporting
                  sustainable practices and empowering individuals to express
                  their unique style with confidence."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <div className="space-y-8">
            <h2 className="text-xl font-medium text-gray-900 text-center">
              Meet Our Team
            </h2>

            <Card variant="outlined" className="border-gray-100">
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                    <Users size={32} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Our Growing Team
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We're a passionate team of fashion enthusiasts, designers,
                      and customer experience specialists working together to
                      bring you the best in contemporary style. Based in New
                      York with team members around the globe, we're united by
                      our love for great design and exceptional service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sustainability */}
          <Card variant="outlined" className="border-gray-100">
            <CardContent>
              <h2 className="text-xl font-medium text-gray-900 mb-6">
                Our Commitment
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We're committed to building a more sustainable fashion
                  industry. We carefully vet our brand partners to ensure they
                  share our values around ethical manufacturing, fair labor
                  practices, and environmental responsibility.
                </p>
                <p>
                  From packaging made with recycled materials to carbon-neutral
                  shipping options, we're constantly working to reduce our
                  environmental impact while maintaining the quality and service
                  our customers expect.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center space-y-6">
            <h2 className="text-xl font-medium text-gray-900">
              Join Our Community
            </h2>
            <p className="text-gray-500">
              Discover your style with carefully curated pieces that tell your
              story
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as={Link} to="/products" variant="primary" size="lg">
                Shop Collection
              </Button>
              <Button as={Link} to="/contact" variant="outline" size="lg">
                Get in Touch
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center pt-8 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Questions?
            </h3>
            <p className="text-gray-500 mb-4">
              We'd love to hear from you. Reach out anytime.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:hello@thefolkproject.com"
                className="block text-gray-900 hover:text-gray-700 transition-colors"
              >
                hello@thefolkproject.com
              </a>
              <a
                href="tel:+15551234567"
                className="block text-gray-900 hover:text-gray-700 transition-colors"
              >
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
