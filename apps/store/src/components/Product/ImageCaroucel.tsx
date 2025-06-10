import { useState, useEffect, FC } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Product } from "@/stores";
import ProductImage from "./ProductImage";

type Props = {
  productImages: string[];
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
};

const ProductImageCarousel: FC<Props> = ({
  productImages,
  product,
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setImageLoaded(false);
    const timer = setTimeout(() => setImageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % productImages.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
    setIsZoomed(false);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case " ":
          e.preventDefault();
          toggleZoom();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, isZoomed]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neutral-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neutral-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header with controls */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-light">{product.name}</h3>
            <p className="text-white/60 text-sm">
              {currentIndex + 1} of {productImages.length}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleZoom}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              title={isZoomed ? "Zoom Out" : "Zoom In"}
            >
              <ZoomIn size={18} />
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {productImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 z-10"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 z-10"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Main image container */}
      <div className="absolute inset-0 flex items-center justify-center p-20">
        <div
          className={`relative max-w-full max-h-full transition-all duration-500 ease-out ${
            isZoomed
              ? "transform scale-150 cursor-zoom-out"
              : "cursor-zoom-in hover:scale-105"
          } ${
            imageLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          onClick={toggleZoom}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <ProductImage
              product={{
                ...product,
                image_url: productImages[currentIndex],
              }}
              imageProps={{
                className:
                  "w-full h-full object-contain max-w-[70vw] max-h-[60vh]",
                style: {
                  filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.3))",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {productImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-3">
            <div className="flex space-x-2 max-w-md overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? "border-white shadow-lg"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <ProductImage
                    product={product}
                    imageProps={{
                      src: image,
                      alt: `${product.name} thumbnail ${index + 1}`,
                      className: "w-full h-full object-cover",
                    }}
                  />

                  {/* Active indicator */}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-20 left-6 text-white/40 text-xs space-y-1">
        <p>← → Navigate</p>
        <p>Space Bar: Zoom</p>
        <p>Esc: Close</p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductImageCarousel;
