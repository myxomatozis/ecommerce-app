import { useState, useEffect, useRef, FC } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Reset zoom and pan when image changes
  useEffect(() => {
    setIsZoomed(false);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const nextImage = () => {
    if (currentIndex < productImages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleZoom = (e: React.MouseEvent) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isZoomed) {
      setIsZoomed(true);
      setZoomLevel(2);

      // Calculate pan position to zoom into click point
      const containerCenterX = rect.width / 2;
      const containerCenterY = rect.height / 2;
      const panX = (containerCenterX - x) * 0.5;
      const panY = (containerCenterY - y) * 0.5;

      // Get image dimensions for constraints
      const imgElement = imageRef.current.querySelector("img");
      if (imgElement) {
        const containerWidth = rect.width - 160; // Account for padding
        const containerHeight = rect.height - 160; // Account for padding
        const imageWidth = imgElement.offsetWidth;
        const imageHeight = imgElement.offsetHeight;
        const scaledWidth = imageWidth * 2; // zoom level 2
        const scaledHeight = imageHeight * 2; // zoom level 2

        // Calculate maximum pan distances
        const maxPanX = Math.max(0, (scaledWidth - containerWidth) / 2);
        const maxPanY = Math.max(0, (scaledHeight - containerHeight) / 2);

        setPanPosition({
          x: Math.max(-maxPanX, Math.min(maxPanX, panX)),
          y: Math.max(-maxPanY, Math.min(maxPanY, panY)),
        });
      } else {
        setPanPosition({ x: panX, y: panY });
      }
    } else {
      setIsZoomed(false);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isZoomed || !containerRef.current || !imageRef.current)
      return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width - 160; // Account for padding
    const containerHeight = containerRect.height - 160; // Account for padding

    // Get the image element to calculate its natural dimensions
    const imgElement = imageRef.current.querySelector("img");
    if (!imgElement) return;

    const imageWidth = imgElement.offsetWidth;
    const imageHeight = imgElement.offsetHeight;

    // Calculate the scaled dimensions
    const scaledWidth = imageWidth * zoomLevel;
    const scaledHeight = imageHeight * zoomLevel;

    // Calculate maximum pan distances
    const maxPanX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (scaledHeight - containerHeight) / 2);

    setPanPosition({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    if (!isZoomed || !containerRef.current || !imageRef.current) return;

    e.preventDefault();

    // Convert scroll to pan movement
    const scrollSpeed = 1;
    const deltaX = e.deltaX * scrollSpeed;
    const deltaY = e.deltaY * scrollSpeed;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width - 160; // Account for padding
    const containerHeight = containerRect.height - 160; // Account for padding

    // Get the image element to calculate its natural dimensions
    const imgElement = imageRef.current.querySelector("img");
    if (!imgElement) return;

    const imageWidth = imgElement.offsetWidth;
    const imageHeight = imgElement.offsetHeight;

    // Calculate the scaled dimensions
    const scaledWidth = imageWidth * zoomLevel;
    const scaledHeight = imageHeight * zoomLevel;

    // Calculate maximum pan distances
    const maxPanX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (scaledHeight - containerHeight) / 2);

    setPanPosition((prev) => {
      const newX = prev.x - deltaX;
      const newY = prev.y - deltaY;

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
      };
    });
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
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    // Add wheel event listener to container
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
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
    <div className="fixed inset-0 z-50 bg-white">
      {/* Minimal header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div className="text-black">
            <p className="text-sm font-light tracking-wide uppercase">
              {product.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-black transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation arrows - only show when multiple images */}
      {productImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            disabled={currentIndex === 0}
            className={`absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center text-black transition-all duration-200 z-20 ${
              currentIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextImage}
            disabled={currentIndex === productImages.length - 1}
            className={`absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center text-black transition-all duration-200 z-20 ${
              currentIndex === productImages.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Main image container */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ padding: "80px 80px" }}
      >
        <div
          ref={imageRef}
          className={`relative transition-all duration-300 ease-out ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
            transformOrigin: "center center",
          }}
          onClick={handleZoom}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <ProductImage
            product={{
              ...product,
              image_url: productImages[currentIndex],
            }}
            src={productImages[currentIndex]}
            className="max-w-[100vw] max-h-[100vh] w-auto h-auto object-contain select-none"
            draggable={false}
            style={{
              maxWidth: "calc(100vw - 160px)",
              maxHeight: "calc(100vh - 160px)",
            }}
          />
        </div>
      </div>

      {/* Image counter */}
      {productImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="text-black/60 text-sm font-light tracking-wide">
            {currentIndex + 1} / {productImages.length}
          </div>
        </div>
      )}

      {/* Minimal dots indicator */}
      {productImages.length > 1 && productImages.length <= 6 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-black"
                    : "bg-black/20 hover:bg-black/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      <div className="absolute bottom-6 right-6 text-black/40 text-xs font-light tracking-wide space-y-1 z-20">
        <p>Click to {isZoomed ? "zoom out" : "zoom in"}</p>
        {isZoomed && <p>Drag or scroll to pan</p>}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
