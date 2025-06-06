// src/pages/Admin/ProductsPage.tsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Package,
  Filter,
  X,
} from "lucide-react";
import {
  Button,
  Input,
  Dropdown,
  Card,
  CardContent,
  Badge,
  Spinner,
  Modal,
} from "@/components/UI";
import { supabase } from "@/lib/supabase";
import { toast } from "@/utils/toast";

interface AdminProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string | null;
  image_url: string | null;
  images_gallery: string[] | null;
  stripe_price_id: string | null;
  stock_quantity: number | null;
  category_id: string | null;
  rating: number | null;
  reviews_count: number | null;
  is_active: boolean | null;
  metadata: any;
  created_at: string | null;
  updated_at: string | null;
  // Category join
  categories: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

export const AdminProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: AdminProduct | null;
  }>({
    isOpen: false,
    product: null,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (statusFilter) params.set("status", statusFilter);

    setSearchParams(params);

    // Debounce the search
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("products")
        .select(
          `
          *,
          categories (
            name
          )
        `
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      if (statusFilter === "active") {
        query = query.eq("is_active", true);
      } else if (statusFilter === "inactive") {
        query = query.eq("is_active", false);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleDeleteProduct = async (product: AdminProduct) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Product deleted successfully");
      setDeleteModal({ isOpen: false, product: null });
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const toggleProductStatus = async (product: AdminProduct) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id);

      if (error) throw error;

      toast.success(
        `Product ${
          product.is_active ? "deactivated" : "activated"
        } successfully`
      );
      loadProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setStatusFilter("");
    setShowFilters(false);
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const getStockStatus = (stock: number | null) => {
    if (!stock || stock === 0) {
      return { label: "Out of Stock", variant: "danger" as const };
    } else if (stock < 5) {
      return { label: "Low Stock", variant: "warning" as const };
    } else {
      return { label: "In Stock", variant: "success" as const };
    }
  };

  const hasActiveFilters = searchTerm || selectedCategory || statusFilter;

  if (loading && products.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Spinner size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-neutral-900">Products</h1>
          <p className="text-neutral-600">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
        <Button
          as={Link}
          to="/admin/products/new"
          variant="primary"
          leftIcon={<Plus size={20} />}
        >
          Add Product
        </Button>
      </div>

      {/* Filters Bar */}
      <Card variant="outlined" className="border-neutral-200 mb-6">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={20} />}
                  fullWidth
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter size={16} />}
                className={showFilters ? "bg-neutral-100" : ""}
              >
                Filters
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  leftIcon={<X size={16} />}
                  className="text-neutral-500"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown
                  label="Category"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  fullWidth
                />
                <Dropdown
                  label="Status"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge
                    variant="outline"
                    removable
                    onRemove={() => setSearchTerm("")}
                  >
                    Search: {searchTerm}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge
                    variant="outline"
                    removable
                    onRemove={() => setSelectedCategory("")}
                  >
                    Category:{" "}
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </Badge>
                )}
                {statusFilter && (
                  <Badge
                    variant="outline"
                    removable
                    onRemove={() => setStatusFilter("")}
                  >
                    Status:{" "}
                    {statusOptions.find((s) => s.value === statusFilter)?.label}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products List */}
      {products.length === 0 ? (
        <Card variant="outlined" className="border-neutral-200">
          <CardContent>
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {hasActiveFilters ? "No products found" : "No products yet"}
              </h3>
              <p className="text-neutral-600 mb-6">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first product"}
              </p>
              {!hasActiveFilters && (
                <Button
                  as={Link}
                  to="/admin/products/new"
                  variant="primary"
                  leftIcon={<Plus size={20} />}
                >
                  Add Product
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock_quantity);
            const categoryName = product.categories?.name;

            return (
              <Card
                key={product.id}
                variant="outlined"
                className="border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                <CardContent>
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-neutral-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-medium text-neutral-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                            {product.description || "No description"}
                          </p>
                          <div className="flex items-center space-x-4 mt-3">
                            <span className="text-lg font-medium text-neutral-900">
                              ${product.price.toFixed(2)}
                            </span>
                            {categoryName && (
                              <Badge variant="minimal" size="sm">
                                {categoryName}
                              </Badge>
                            )}
                            <Badge variant={stockStatus.variant} size="sm">
                              {stockStatus.label}
                              {product.stock_quantity &&
                                product.stock_quantity > 0 && (
                                  <span className="ml-1">
                                    ({product.stock_quantity})
                                  </span>
                                )}
                            </Badge>
                            <Badge
                              variant={
                                product.is_active ? "success" : "secondary"
                              }
                              size="sm"
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            as={Link}
                            to={`/products/${product.id}`}
                            variant="ghost"
                            size="sm"
                            leftIcon={<Eye size={16} />}
                          >
                            View
                          </Button>
                          <Button
                            as={Link}
                            to={`/admin/products/${product.id}/edit`}
                            variant="ghost"
                            size="sm"
                            leftIcon={<Edit size={16} />}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => toggleProductStatus(product)}
                            variant="ghost"
                            size="sm"
                            leftIcon={
                              product.is_active ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )
                            }
                          >
                            {product.is_active ? "Hide" : "Show"}
                          </Button>
                          <Button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, product })
                            }
                            variant="ghost"
                            size="sm"
                            leftIcon={<Trash2 size={16} />}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        title="Delete Product"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">This action cannot be undone</p>
          </div>

          <p className="text-sm text-neutral-600">
            Are you sure you want to delete{" "}
            <strong>"{deleteModal.product?.name}"</strong>? This will
            permanently remove the product and all associated data.
          </p>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              onClick={() => setDeleteModal({ isOpen: false, product: null })}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                deleteModal.product && handleDeleteProduct(deleteModal.product)
              }
              variant="primary"
              className="bg-red-600 hover:bg-red-700 border-red-600"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
