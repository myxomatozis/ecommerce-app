// src/pages/SizeGuidePage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Ruler, User, Shirt, Package } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsPanel,
} from "@/components/UI";
import { SizeTable } from "@/components/SizeGuide";
import {
  sizeCategories,
  womensShoes,
  mensShoes,
  measurementTips,
} from "@/components/SizeGuide/data";

const SizeGuidePage: React.FC = () => {
  const tabs = [
    { id: "womens", label: "Women's", icon: <User size={16} /> },
    { id: "mens", label: "Men's", icon: <User size={16} /> },
    { id: "shoes", label: "Shoes", icon: <Package size={16} /> },
    { id: "accessories", label: "Accessories", icon: <Shirt size={16} /> },
  ];

  const fitGuide = [
    {
      name: "Slim Fit",
      description:
        "Close-fitting through the body with minimal ease. Tailored for a streamlined silhouette.",
    },
    {
      name: "Regular Fit",
      description:
        "Our standard fit with comfortable ease through the body. Not too tight, not too loose.",
    },
    {
      name: "Relaxed Fit",
      description:
        "Generous cut with extra room for comfort and layering. Casual, easy-wearing style.",
    },
    {
      name: "Oversized",
      description:
        "Intentionally loose fit for a contemporary, relaxed aesthetic. Size down for a regular fit.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Button
            as={Link}
            to="/products"
            variant="ghost"
            leftIcon={<ArrowLeft size={16} />}
            className="text-neutral-600 hover:text-neutral-900"
          >
            Back to Products
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-6">
              <Ruler size={24} className="text-neutral-600" />
            </div>
            <h1 className="text-3xl font-light text-neutral-900">Size Guide</h1>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Find your perfect fit with our comprehensive sizing guide. All
              measurements are in inches unless otherwise noted.
            </p>
          </div>

          {/* Quick Tips */}
          <Card variant="outlined" className="border-neutral-100">
            <CardContent>
              <h2 className="text-lg font-medium text-neutral-900 mb-6">
                Sizing Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2"></div>
                    <p className="text-sm text-neutral-600">
                      If you're between sizes, we recommend sizing up for a more
                      comfortable fit
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2"></div>
                    <p className="text-sm text-neutral-600">
                      Check individual product pages for specific fit notes and
                      styling tips
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2"></div>
                    <p className="text-sm text-neutral-600">
                      Our customer reviews often include helpful sizing feedback
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2"></div>
                    <p className="text-sm text-neutral-600">
                      Contact us if you need help choosing the right size
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Size Charts by Category */}
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-neutral-900 text-center">
              Size Charts
            </h2>

            <Tabs defaultTab="womens">
              <div className="flex justify-center mb-8">
                <TabsList tabs={tabs} />
              </div>

              {/* Women's Sizes */}
              <TabsPanel tabId="womens">
                <div className="space-y-12">
                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <SizeTable
                        data={sizeCategories.women.tables.clothing}
                        title="Women's Tops & Dresses"
                      />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <SizeTable
                        data={sizeCategories.women.tables.clothing}
                        title="Women's Bottoms"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsPanel>

              {/* Men's Sizes */}
              <TabsPanel tabId="mens">
                <div className="space-y-12">
                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <SizeTable
                        data={sizeCategories.men.tables.clothing}
                        title="Men's Tops & Shirts"
                      />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <SizeTable
                        data={sizeCategories.men.tables.clothing}
                        title="Men's Bottoms"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsPanel>

              {/* Shoes */}
              <TabsPanel tabId="shoes">
                <div className="space-y-12">
                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <SizeTable data={womensShoes} title="Women's Shoes" />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <SizeTable data={mensShoes} title="Men's Shoes" />
                    </CardContent>
                  </Card>
                </div>
              </TabsPanel>

              {/* Accessories */}
              <TabsPanel tabId="accessories">
                <div className="space-y-12">
                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <h3 className="text-lg font-medium text-neutral-900 mb-6">
                        Accessories Guide
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-neutral-900 mb-3">
                            Belts
                          </h4>
                          <p className="text-sm text-neutral-600 mb-4">
                            Belt sizes are measured from the buckle to the
                            middle hole. Add 2 inches to your waist measurement.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium text-neutral-900">
                                S
                              </div>
                              <div className="text-neutral-600">30-32"</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-neutral-900">
                                M
                              </div>
                              <div className="text-neutral-600">34-36"</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-neutral-900">
                                L
                              </div>
                              <div className="text-neutral-600">38-40"</div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-neutral-100 pt-6">
                          <h4 className="font-medium text-neutral-900 mb-3">
                            Hats
                          </h4>
                          <p className="text-sm text-neutral-600 mb-4">
                            Measure around your head just above the ears and
                            eyebrows.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium text-neutral-900">
                                S
                              </div>
                              <div className="text-neutral-600">54-56 cm</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-neutral-900">
                                M
                              </div>
                              <div className="text-neutral-600">57-59 cm</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-neutral-900">
                                L
                              </div>
                              <div className="text-neutral-600">60-62 cm</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsPanel>
            </Tabs>
          </div>

          {/* How to Measure */}
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-neutral-900 text-center">
              How to Measure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {measurementTips.map((item, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  className="border-neutral-100"
                >
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <User size={20} className="text-neutral-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Fit Guide */}
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-neutral-900 text-center">
              Fit Guide
            </h2>

            <Card variant="outlined" className="border-neutral-100">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {fitGuide.map((fit, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-medium text-neutral-900">
                        {fit.name}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {fit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Still Need Help */}
          <Card variant="outlined" className="border-neutral-100">
            <CardContent>
              <div className="text-center space-y-6">
                <h2 className="text-xl font-medium text-neutral-900">
                  Still Need Help?
                </h2>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Our customer service team is here to help you find the perfect
                  fit. We offer free exchanges on all orders.
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

          {/* Return Policy Notice */}
          <div className="text-center space-y-4 pt-8 border-t border-neutral-100">
            <h3 className="text-lg font-medium text-neutral-900">
              Free Exchanges
            </h3>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Not sure about the size? We offer free exchanges within 30 days of
              purchase. All items must be unworn with original tags attached.
            </p>
            <div className="space-x-4">
              <Button as={Link} to="/returns" variant="ghost" size="sm">
                Return Policy
              </Button>
              <Button as={Link} to="/faq" variant="ghost" size="sm">
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
