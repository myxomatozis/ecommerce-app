import React, { useState, useRef, useEffect, useCallback } from "react";
import { Product } from "@/stores";
import ProductImage from "@/components/Product/ProductImage";

interface MobileProductCarouselProps {
  product: Product;
  productImages: string[];
}

const MobileProductCarousel: React.FC<MobileProductCarouselProps> = ({
  product,
  productImages,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastMoveX, setLastMoveX] = useState(0);

  // Pinch-to-zoom states
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPinching, setIsPinching] = useState(false);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  const [isPanning, setIsPanning] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(null);
  const isVerticalScrollRef = useRef(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Helper function to calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Reset zoom state
  const resetZoom = useCallback(() => {
    setScale(1);
    setPanX(0);
    setPanY(0);
    setIsPinching(false);
    setIsPanning(false);
  }, []);

  // Reset zoom when changing images
  useEffect(() => {
    resetZoom();
  }, [currentIndex, resetZoom]);

  // Enhanced touch/mouse event handlers with better sensitivity
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartY(clientY);
    setVelocity(0);
    setLastMoveTime(Date.now());
    setLastMoveX(clientX);
    isVerticalScrollRef.current = false;

    if (carouselRef.current) {
      setScrollLeft(carouselRef.current.scrollLeft);
      // Disable smooth scrolling during drag
      carouselRef.current.style.scrollBehavior = "auto";
    }

    // Cancel any ongoing momentum animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !carouselRef.current) return;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      const currentTime = Date.now();

      // Detect if this is a vertical scroll gesture
      if (
        !isVerticalScrollRef.current &&
        Math.abs(deltaY) > Math.abs(deltaX) &&
        Math.abs(deltaY) > 10
      ) {
        isVerticalScrollRef.current = true;
        setIsDragging(false);
        return;
      }

      // Calculate velocity for momentum scrolling
      if (currentTime - lastMoveTime > 0) {
        setVelocity((clientX - lastMoveX) / (currentTime - lastMoveTime));
      }
      setLastMoveTime(currentTime);
      setLastMoveX(clientX);

      // Reduced sensitivity multiplier (was 2, now 1.2 for better control)
      const walk = deltaX * 1.2;
      carouselRef.current.scrollLeft = scrollLeft - walk;

      // Prevent default to avoid page scrolling
      event?.preventDefault();
    },
    [isDragging, startX, startY, scrollLeft, lastMoveTime, lastMoveX]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging || isVerticalScrollRef.current) {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);

    if (carouselRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const currentScrollLeft = carouselRef.current.scrollLeft;

      // Enhanced snapping with momentum consideration
      let targetIndex = Math.round(currentScrollLeft / containerWidth);

      // Apply momentum if velocity is significant
      if (Math.abs(velocity) > 0.5) {
        if (velocity > 0) {
          targetIndex = Math.max(0, targetIndex - 1);
        } else {
          targetIndex = Math.min(productImages.length - 1, targetIndex + 1);
        }
      }

      const clampedIndex = Math.max(
        0,
        Math.min(targetIndex, productImages.length - 1)
      );

      setCurrentIndex(clampedIndex);

      // Re-enable smooth scrolling and scroll to target
      carouselRef.current.style.scrollBehavior = "smooth";
      carouselRef.current.scrollTo({
        left: clampedIndex * containerWidth,
        behavior: "smooth",
      });
    }
  }, [isDragging, velocity, productImages.length]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Enhanced touch events with pinch-to-zoom support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touches = e.touches;

    if (touches.length === 1) {
      // Single touch - handle swipe
      if (scale <= 1) {
        handleStart(touches[0].clientX, touches[0].clientY);
      } else {
        // If zoomed in, handle panning
        setIsPanning(true);
        setStartX(touches[0].clientX - panX);
        setStartY(touches[0].clientY - panY);
      }
    } else if (touches.length === 2) {
      // Two fingers - handle pinch
      setIsPinching(true);
      setIsDragging(false);

      const distance = getDistance(touches[0], touches[1]);
      setLastPinchDistance(distance);

      // Disable carousel scrolling when pinching
      if (carouselRef.current) {
        carouselRef.current.style.overflowX = "hidden";
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touches = e.touches;

    if (touches.length === 1 && !isPinching) {
      if (scale <= 1 && isDragging && !isVerticalScrollRef.current) {
        // Single touch swiping (only when not zoomed)
        handleMove(touches[0].clientX, touches[0].clientY);
        e.preventDefault();
      } else if (scale > 1 && isPanning) {
        // Single touch panning when zoomed
        const newPanX = touches[0].clientX - startX;
        const newPanY = touches[0].clientY - startY;

        // Constrain panning to image bounds
        const maxPanX = (scale - 1) * 150; // Adjust based on image size
        const maxPanY = (scale - 1) * 150;

        setPanX(Math.max(-maxPanX, Math.min(maxPanX, newPanX)));
        setPanY(Math.max(-maxPanY, Math.min(maxPanY, newPanY)));
        e.preventDefault();
      }
    } else if (touches.length === 2 && isPinching) {
      // Two fingers - handle pinch zoom
      const distance = getDistance(touches[0], touches[1]);
      const scaleChange = distance / lastPinchDistance;

      let newScale = scale * scaleChange;
      newScale = Math.max(1, Math.min(4, newScale)); // Limit zoom between 1x and 4x

      setScale(newScale);
      setLastPinchDistance(distance);

      // If zooming out to 1x, reset pan
      if (newScale <= 1) {
        setPanX(0);
        setPanY(0);
      }

      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touches = e.touches;

    if (touches.length === 0) {
      // All fingers lifted
      if (isPinching) {
        setIsPinching(false);
        // Re-enable carousel scrolling
        if (carouselRef.current) {
          carouselRef.current.style.overflowX = scale <= 1 ? "auto" : "hidden";
        }
      }

      if (isPanning) {
        setIsPanning(false);
      }

      if (isDragging && scale <= 1) {
        handleEnd();
      }
    } else if (touches.length === 1 && isPinching) {
      // Switched from pinch to single touch
      setIsPinching(false);
      if (carouselRef.current) {
        carouselRef.current.style.overflowX = scale <= 1 ? "auto" : "hidden";
      }
    }
  };

  // Handle image click (disabled on mobile to prevent modal opening)
  const handleImageClick = (_index: number) => {
    // On mobile, we disable modal opening - carousel is the main image viewing experience
    // Only allow click-through if not dragging and velocity is minimal
    if (!isDragging && Math.abs(velocity) < 0.1) {
      // Disabled: onImageClick(index);
      // Mobile users interact with the carousel directly rather than opening a modal
    }
  };

  // Scroll to specific image
  const scrollToImage = (index: number) => {
    if (carouselRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      carouselRef.current.style.scrollBehavior = "smooth";
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

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            // Enhanced CSS for better touch performance and zoom support
            touchAction: scale > 1 ? "none" : "pan-x",
            WebkitOverflowScrolling: "touch",
            overflowX: scale > 1 ? "hidden" : "auto",
          }}
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
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className="relative flex-none w-full h-full snap-start group cursor-grab active:cursor-grabbing"
              onClick={() => handleImageClick(index)}
            >
              <div
                className="w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transform:
                    index === currentIndex
                      ? `scale(${scale}) translate(${panX}px, ${panY}px)`
                      : "scale(1) translate(0px, 0px)",
                  transformOrigin: "center center",
                }}
              >
                <ProductImage
                  product={{
                    ...product,
                    image_url: image,
                  }}
                  draggable={false}
                  className="w-full h-full object-cover object-center select-none"
                />
              </div>

              {/* Enhanced hover/touch feedback */}
              <div className="absolute inset-0 bg-black/0 group-active:bg-black/3 transition-colors duration-150" />

              {/* Touch feedback indicator - shows swipe interaction */}
              <div className="absolute top-4 right-4 opacity-0 group-active:opacity-100 transition-opacity duration-150">
                <div className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-1 h-1 bg-neutral-800 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Zoom level indicator (when zoomed) */}
              {index === currentIndex && scale > 1 && (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-xs font-medium">
                    {Math.round(scale * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image counter overlay - enhanced styling */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-white text-sm font-medium tracking-wide">
            {currentIndex + 1} / {productImages.length}
          </span>
        </div>

        {/* Reset zoom button (when zoomed in) */}
        {scale > 1 && (
          <button
            onClick={resetZoom}
            className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full p-3 transition-opacity duration-200"
          >
            <div className="w-4 h-4 border border-white rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 border border-white"></div>
            </div>
          </button>
        )}
      </div>

      {/* Enhanced dot indicators */}
      {productImages.length > 1 && (
        <div className="flex justify-center py-6 space-x-2">
          {productImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-neutral-900 w-8 h-2"
                  : "bg-neutral-300 hover:bg-neutral-400 w-2 h-2"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip (for 4+ images) */}
      {productImages.length > 3 && (
        <div className="px-4 pb-6">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)}
                className={`relative flex-none w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-neutral-900 ring-2 ring-neutral-900/20"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <ProductImage
                  product={product}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-neutral-900/10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProductCarousel;
