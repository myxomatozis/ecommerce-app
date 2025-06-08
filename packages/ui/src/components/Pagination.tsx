import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 7,
  size = "md",
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  const buttonBaseClasses = `
    inline-flex items-center justify-center border border-gray-300 bg-white
    font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
  `;

  const PageButton: React.FC<{
    page: number;
    isActive?: boolean;
    disabled?: boolean;
  }> = ({ page, isActive = false, disabled = false }) => (
    <button
      onClick={() => onPageChange(page)}
      disabled={disabled}
      className={`
        ${buttonBaseClasses}
        ${
          isActive
            ? "bg-primary-600 text-white border-primary-600 hover:bg-primary-700"
            : ""
        }
      `}
    >
      {page}
    </button>
  );

  const NavButton: React.FC<{
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    "aria-label": string;
  }> = ({ onClick, disabled, children, "aria-label": ariaLabel }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={buttonBaseClasses}
    >
      {children}
    </button>
  );

  const EllipsisButton: React.FC = () => (
    <span
      className={`inline-flex items-center justify-center text-gray-500 ${sizeClasses[size]}`}
    >
      <MoreHorizontal size={iconSizes[size]} />
    </span>
  );

  return (
    <nav
      className={`flex items-center space-x-1 ${className}`}
      aria-label="Pagination"
    >
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <NavButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <ChevronLeft size={iconSizes[size]} />
          <ChevronLeft size={iconSizes[size]} className="-ml-1" />
        </NavButton>
      )}

      {/* Previous button */}
      <NavButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={iconSizes[size]} />
      </NavButton>

      {/* First page (if not in visible range) */}
      {visiblePages[0] > 1 && (
        <>
          <PageButton page={1} />
          {showStartEllipsis && <EllipsisButton />}
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map((page) => (
        <PageButton key={page} page={page} isActive={page === currentPage} />
      ))}

      {/* Last page (if not in visible range) */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {showEndEllipsis && <EllipsisButton />}
          <PageButton page={totalPages} />
        </>
      )}

      {/* Next button */}
      <NavButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight size={iconSizes[size]} />
      </NavButton>

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages && (
        <NavButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <ChevronRight size={iconSizes[size]} />
          <ChevronRight size={iconSizes[size]} className="-ml-1" />
        </NavButton>
      )}
    </nav>
  );
};

export default Pagination;
