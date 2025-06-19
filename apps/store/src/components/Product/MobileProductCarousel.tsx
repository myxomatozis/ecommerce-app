import React, { useState, useRef, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import { Product } from "@/stores";
import ProductImage from "@/components/Product/ProductImage";

interface MobileProductCarouselProps {
  product: Product;
  productImages: string[];
  onImageClick: (index: number) => void;
}

const MobileProductCarousel: React.FC<MobileProductCarouselProps> = ({
  product,
  productImages,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle touch/mouse events for swiping
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    if (carouselRef.current) {
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !carouselRef.current) return;

    const x = clientX;
    const walk = (x - startX) * 2; // Adjust scroll speed
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleEnd = () => {
    setIsDragging(false);

    // Snap to nearest image
    if (carouselRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scrollLeft = carouselRef.current.scrollLeft;
      const imageIndex = Math.round(scrollLeft / containerWidth);
      const clampedIndex = Math.max(
        0,
        Math.min(imageIndex, productImages.length - 1)
      );

      setCurrentIndex(clampedIndex);
      carouselRef.current.scrollTo({
        left: clampedIndex * containerWidth,
        behavior: "smooth",
      });
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Handle image click (only if not dragging)
  const handleImageClick = (index: number) => {
    if (!isDragging) {
      onImageClick(index);
    }
  };

  // Scroll to specific image
  const scrollToImage = (index: number) => {
    if (carouselRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: index * containerWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  // Update current index on scroll (for indicators)
  useEffect(() => {
    const carousel = carouselRef.current;
    const container = containerRef.current;
    if (!carousel || !container) return;

    const handleScroll = () => {
      if (!isDragging) {
        const containerWidth = container.offsetWidth;
        const scrollLeft = carousel.scrollLeft;
        const newIndex = Math.round(scrollLeft / containerWidth);
        setCurrentIndex(newIndex);
      }
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [isDragging]);

  if (productImages.length === 0) return null;

  return (
    <div className="lg:hidden bg-white">
      {/* Main Carousel */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[2.5/4] overflow-hidden"
      >
        <div
          ref={carouselRef}
          className="flex w-full h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {productImages.map((image, index) => (
            <div
              key={index}
              className="relative flex-none w-full h-full snap-start group cursor-zoom-in"
              onClick={() => handleImageClick(index)}
            >
              <ProductImage
                product={{
                  ...product,
                  image_url: image,
                }}
                imageProps={{
                  className: "w-full h-full object-cover object-center",
                  draggable: false,
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-active:bg-black/5 transition-colors duration-200" />

              {/* Zoom indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-active:opacity-100 transition-opacity duration-200">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                  <ZoomIn size={14} className="text-neutral-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image counter overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {productImages.length}
          </span>
        </div>
      </div>

      {/* Dot Indicators */}
      {productImages.length > 1 && (
        <div className="flex justify-center py-4 space-x-2">
          {productImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-neutral-900 w-6"
                  : "bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip (Optional - only show if many images) */}
      {productImages.length > 3 && (
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)}
                className={`relative flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-neutral-900 ring-2 ring-neutral-900/20"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <ProductImage
                  product={product}
                  imageProps={{
                    src: image,
                    alt: `${product.name} thumbnail ${index + 1}`,
                    className: "w-full h-full object-cover",
                    draggable: false,
                  }}
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-neutral-900/10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MobileProductCarousel;
