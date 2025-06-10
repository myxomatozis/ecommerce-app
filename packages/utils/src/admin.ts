export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const getStockStatus = (stock: number | null) => {
  if (!stock || stock === 0) {
    return {
      label: "Out of Stock",
      variant: "outline" as const,
      color: "text-red-600",
    };
  } else if (stock < 5) {
    return {
      label: "Low Stock",
      variant: "counter" as const,
      color: "text-yellow-600",
    };
  } else {
    return {
      label: "In Stock",
      variant: "secondary" as const,
      color: "text-green-600",
    };
  }
};

export const getOrderStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "text-yellow-700 bg-yellow-100";
    case "processing":
      return "text-blue-700 bg-blue-100";
    case "shipped":
      return "text-purple-700 bg-purple-100";
    case "delivered":
      return "text-green-700 bg-green-100";
    case "cancelled":
      return "text-red-700 bg-red-100";
    case "refunded":
      return "text-gray-700 bg-gray-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export default {
  formatDate,
  formatDateTime,
  getStockStatus,
  getOrderStatusColor,
  truncateText,
};
