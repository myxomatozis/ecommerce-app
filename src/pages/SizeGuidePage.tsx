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

const SizeGuidePage: React.FC = () => {
  const tabs = [
    { id: "womens", label: "Women's", icon: <User size={16} /> },
    { id: "mens", label: "Men's", icon: <User size={16} /> },
    { id: "shoes", label: "Shoes", icon: <Package size={16} /> },
    { id: "accessories", label: "Accessories", icon: <Shirt size={16} /> },
  ];

  // Women's sizing data
  const womensData = {
    tops: [
      { uk: "6", eu: "34", us: "2", bust: "32", waist: "24", hips: "34" },
      { uk: "8", eu: "36", us: "4", bust: "34", waist: "26", hips: "36" },
      { uk: "10", eu: "38", us: "6", bust: "36", waist: "28", hips: "38" },
      { uk: "12", eu: "40", us: "8", bust: "38", waist: "30", hips: "40" },
      { uk: "14", eu: "42", us: "10", bust: "40", waist: "32", hips: "42" },
      { uk: "16", eu: "44", us: "12", bust: "42", waist: "34", hips: "44" },
      { uk: "18", eu: "46", us: "14", bust: "44", waist: "36", hips: "46" },
    ],
    bottoms: [
      { uk: "6", eu: "34", us: "2", waist: "24", hips: "34", inseam: "32" },
      { uk: "8", eu: "36", us: "4", waist: "26", hips: "36", inseam: "32" },
      { uk: "10", eu: "38", us: "6", waist: "28", hips: "38", inseam: "32" },
      { uk: "12", eu: "40", us: "8", waist: "30", hips: "40", inseam: "32" },
      { uk: "14", eu: "42", us: "10", waist: "32", hips: "42", inseam: "32" },
      { uk: "16", eu: "44", us: "12", waist: "34", hips: "44", inseam: "32" },
      { uk: "18", eu: "46", us: "14", waist: "36", hips: "46", inseam: "32" },
    ],
  };

  // Men's sizing data
  const mensData = {
    tops: [
      { uk: "XS", eu: "44", us: "XS", chest: "34", waist: "28", neck: "14" },
      { uk: "S", eu: "46", us: "S", chest: "36", waist: "30", neck: "14.5" },
      { uk: "M", eu: "48", us: "M", chest: "38", waist: "32", neck: "15" },
      { uk: "L", eu: "50", us: "L", chest: "40", waist: "34", neck: "15.5" },
      { uk: "XL", eu: "52", us: "XL", chest: "42", waist: "36", neck: "16" },
      {
        uk: "XXL",
        eu: "54",
        us: "XXL",
        chest: "44",
        waist: "38",
        neck: "16.5",
      },
    ],
    bottoms: [
      { uk: "28", eu: "44", us: "28", waist: "28", hips: "36", inseam: "32" },
      { uk: "30", eu: "46", us: "30", waist: "30", hips: "38", inseam: "32" },
      { uk: "32", eu: "48", us: "32", waist: "32", hips: "40", inseam: "32" },
      { uk: "34", eu: "50", us: "34", waist: "34", hips: "42", inseam: "32" },
      { uk: "36", eu: "52", us: "36", waist: "36", hips: "44", inseam: "32" },
      { uk: "38", eu: "54", us: "38", waist: "38", hips: "46", inseam: "32" },
    ],
  };

  // Shoes sizing data
  const shoesData = {
    womens: [
      { uk: "3", eu: "36", us: "5.5", length: "22.5" },
      { uk: "3.5", eu: "36.5", us: "6", length: "23" },
      { uk: "4", eu: "37", us: "6.5", length: "23.5" },
      { uk: "4.5", eu: "37.5", us: "7", length: "24" },
      { uk: "5", eu: "38", us: "7.5", length: "24.5" },
      { uk: "5.5", eu: "38.5", us: "8", length: "25" },
      { uk: "6", eu: "39", us: "8.5", length: "25.5" },
      { uk: "6.5", eu: "40", us: "9", length: "26" },
      { uk: "7", eu: "40.5", us: "9.5", length: "26.5" },
      { uk: "7.5", eu: "41", us: "10", length: "27" },
      { uk: "8", eu: "42", us: "10.5", length: "27.5" },
    ],
    mens: [
      { uk: "6", eu: "40", us: "7", length: "25" },
      { uk: "6.5", eu: "40.5", us: "7.5", length: "25.5" },
      { uk: "7", eu: "41", us: "8", length: "26" },
      { uk: "7.5", eu: "41.5", us: "8.5", length: "26.5" },
      { uk: "8", eu: "42", us: "9", length: "27" },
      { uk: "8.5", eu: "42.5", us: "9.5", length: "27.5" },
      { uk: "9", eu: "43", us: "10", length: "28" },
      { uk: "9.5", eu: "43.5", us: "10.5", length: "28.5" },
      { uk: "10", eu: "44", us: "11", length: "29" },
      { uk: "10.5", eu: "44.5", us: "11.5", length: "29.5" },
      { uk: "11", eu: "45", us: "12", length: "30" },
      { uk: "12", eu: "46", us: "13", length: "31" },
    ],
  };

  const measurementGuide = [
    {
      title: "Bust/Chest",
      description:
        "Measure around the fullest part of your chest, keeping the tape horizontal.",
      icon: <User size={20} className="text-neutral-600" />,
    },
    {
      title: "Waist",
      description:
        "Measure around your natural waist, typically the narrowest part of your torso.",
      icon: <User size={20} className="text-neutral-600" />,
    },
    {
      title: "Hips",
      description:
        "Measure around the fullest part of your hips, about 8 inches below your waist.",
      icon: <User size={20} className="text-neutral-600" />,
    },
    {
      title: "Inseam",
      description:
        "For trousers, measure from the crotch to the desired hem length.",
      icon: <Ruler size={20} className="text-neutral-600" />,
    },
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

  const SizeTable: React.FC<{
    data: any[];
    headers: string[];
    measurements: string[];
  }> = ({ data, headers, measurements }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left py-3 px-4 font-medium text-neutral-900 text-sm"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              {measurements.map((measurement, cellIndex) => (
                <td
                  key={cellIndex}
                  className="py-3 px-4 text-sm text-neutral-700"
                >
                  {row[measurement]}
                  {measurement.includes("waist") ||
                  measurement.includes("chest") ||
                  measurement.includes("bust") ||
                  measurement.includes("hips") ||
                  measurement.includes("inseam") ||
                  measurement.includes("length") ? (
                    <span className="text-neutral-400 ml-1">
                      {measurement.includes("length") ? "cm" : '"'}
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
                      <h3 className="text-lg font-medium text-neutral-900 mb-6">
                        Women's Tops & Dresses
                      </h3>
                      <SizeTable
                        data={womensData.tops}
                        headers={["UK", "EU", "US", "Bust", "Waist", "Hips"]}
                        measurements={[
                          "uk",
                          "eu",
                          "us",
                          "bust",
                          "waist",
                          "hips",
                        ]}
                      />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <h3 className="text-lg font-medium text-neutral-900 mb-6">
                        Women's Bottoms
                      </h3>
                      <SizeTable
                        data={womensData.bottoms}
                        headers={["UK", "EU", "US", "Waist", "Hips", "Inseam"]}
                        measurements={[
                          "uk",
                          "eu",
                          "us",
                          "waist",
                          "hips",
                          "inseam",
                        ]}
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
                      <h3 className="text-lg font-medium text-neutral-900 mb-6">
                        Men's Tops & Shirts
                      </h3>
                      <SizeTable
                        data={mensData.tops}
                        headers={["UK", "EU", "US", "Chest", "Waist", "Neck"]}
                        measurements={[
                          "uk",
                          "eu",
                          "us",
                          "chest",
                          "waist",
                          "neck",
                        ]}
                      />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <h3 className="text-lg font-medium text-neutral-900 mb-6">
                        Men's Bottoms
                      </h3>
                      <SizeTable
                        data={mensData.bottoms}
                        headers={["UK", "EU", "US", "Waist", "Hips", "Inseam"]}
                        measurements={[
                          "uk",
                          "eu",
                          "us",
                          "waist",
                          "hips",
                          "inseam",
                        ]}
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
                      <h3 className="text-lg font-medium text-neutral-900 mb-6">
                        Women's Shoes
                      </h3>
                      <SizeTable
                        data={shoesData.womens}
                        headers={["UK", "EU", "US", "Length (cm)"]}
                        measurements={["uk", "eu", "us", "length"]}
                      />
                    </CardContent>
                  </Card>

                  <Card variant="outlined" className="border-neutral-100">
                    <CardContent>
                      <h3 className="text-lg font-medium text-neutral-900 mb-6">
                        Men's Shoes
                      </h3>
                      <SizeTable
                        data={shoesData.mens}
                        headers={["UK", "EU", "US", "Length (cm)"]}
                        measurements={["uk", "eu", "us", "length"]}
                      />
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
              {measurementGuide.map((item, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  className="border-neutral-100"
                >
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                        {item.icon}
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
