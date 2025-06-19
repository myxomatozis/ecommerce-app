import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Truck, RotateCcw } from "lucide-react";
import { Button } from "@thefolk/ui";
import { Product, useAppData } from "@/stores";
import { getCurrencySymbol } from "@thefolk/utils";
import { config } from "@/config";
import FeaturedProduct from "@/components/Product/FeaturedProduct";
import { useScroll } from "@/context/ScrollContext";

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const { getProducts } = useAppData();
  const { isScrolled } = useScroll();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=1080&fit=crop&auto=format",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts({ limit: 6 });
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [getProducts]);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="bg-white">
      {/* Hero Section - Sophisticated full-screen presentation */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Images with improved transitions */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out ${
              index === currentImageIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.25)), url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ))}

        {/* Hero Content - Refined typography and positioning */}
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[0.9]">
              The Folk
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide opacity-90 max-w-lg mx-auto leading-relaxed">
              Curated fashion for the modern minimalist
            </p>
            <div className="pt-4">
              <Button
                as={Link}
                to="/products"
                variant="ghost"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-500 px-12 py-4 text-base font-normal tracking-wide"
              >
                Explore Collection
              </Button>
            </div>
          </div>
        </div>

        {/* Elegant scroll indicator */}
        {!isScrolled && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        )}
      </section>

      {/* Featured Products - Toteme-inspired clean grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header - Minimal and sophisticated */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight mb-4">
              Featured Selection
            </h2>
            <div className="w-12 h-px bg-neutral-900 mx-auto"></div>
          </div>

          {/* Products Grid - Clean and spacious */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <FeaturedProduct product={product} />
              </div>
            ))}
          </div>

          {/* View All Products - Subtle call-to-action */}
          <div className="text-center mt-20">
            <Button
              as={Link}
              to="/products"
              variant="ghost"
              size="lg"
              className="border border-neutral-200 text-neutral-900 hover:bg-neutral-50 px-12 py-4 font-normal tracking-wide"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Philosophy - New section inspired by luxury fashion sites */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight leading-tight">
                Timeless pieces for the conscious wardrobe
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed font-light">
                Each piece in our collection is carefully selected for its
                craftsmanship, sustainability, and enduring style. We believe in
                quality over quantity, creating a wardrobe that transcends
                seasons.
              </p>
              <Button
                as={Link}
                to="/about"
                variant="ghost"
                rightIcon={<ArrowRight size={16} />}
                className="text-neutral-900 hover:text-neutral-600 font-normal tracking-wide px-0"
              >
                Our Story
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-neutral-200 rounded-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&auto=format"
                  alt="The Folk Philosophy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Refined and minimal */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-tight">
              Stay Updated
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed font-light max-w-lg mx-auto">
              Be the first to discover new arrivals, exclusive pieces, and
              stories from our carefully curated world.
            </p>

            {/* Newsletter Form - Clean and sophisticated */}
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 border border-neutral-200 focus:border-neutral-400 focus:outline-none text-neutral-900 placeholder-neutral-400 font-light tracking-wide"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="h-full"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Services - Refined features section */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: Award,
                title: "Curated Quality",
                description:
                  "Every piece is carefully selected for exceptional craftsmanship and enduring style",
              },
              {
                icon: Truck,
                title: "Complimentary Delivery",
                description: `Free shipping on orders over ${getCurrencySymbol(config.storeCurrency)}${config.freeShippingThreshold} with carbon-neutral delivery`,
              },
              {
                icon: RotateCcw,
                title: "Effortless Returns",
                description:
                  "30-day return policy with complimentary exchanges for the perfect fit",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center space-y-6 group">
                <div className="w-16 h-16 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto group-hover:border-neutral-300 transition-colors duration-300">
                  <feature.icon size={24} className="text-neutral-700" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-normal text-neutral-900 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed font-light max-w-xs mx-auto">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
