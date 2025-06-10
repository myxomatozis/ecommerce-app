import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ScrollContextValue {
  isScrolled: boolean;
  scrollY: number;
  scrollDirection: "up" | "down" | null;
  isAtTop: boolean;
  isAtBottom: boolean;
}

interface ScrollProviderProps {
  children: ReactNode;
  threshold?: number;
  throttleMs?: number;
}

const ScrollContext = createContext<ScrollContextValue | undefined>(undefined);

export const useScroll = (): ScrollContextValue => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
  threshold = 50,
  throttleMs = 16, // ~60fps
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Update scroll position
        setScrollY(currentScrollY);

        // Update scroll threshold state
        setIsScrolled(currentScrollY > threshold);

        // Update scroll direction
        if (currentScrollY > previousScrollY) {
          setScrollDirection("down");
        } else if (currentScrollY < previousScrollY) {
          setScrollDirection("up");
        }

        // Update position states
        setIsAtTop(currentScrollY <= 0);
        setIsAtBottom(currentScrollY + windowHeight >= documentHeight - 10);

        setPreviousScrollY(currentScrollY);
        timeoutId = null;
      }, throttleMs);
    };

    // Add event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial call to set state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, throttleMs, previousScrollY]);

  const value: ScrollContextValue = {
    isScrolled,
    scrollY,
    scrollDirection,
    isAtTop,
    isAtBottom,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
