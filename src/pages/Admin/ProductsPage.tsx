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
  description: string;
  price: number;
  currency: string;
  image_url: string | null;
  images_gallery: string[] | null;
  stripe_price_id: string | null;
  stock_quantity: number | null;
  category_id: string | null;
  category_name: string | null;
  rating: number | null;
  reviews_count: number | null;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const AdminProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
    loadProducts();
  }, [searchTerm, selectedCategory, statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("admin_get_products", {
        p_search: searchTerm || undefined,
        p_category_id: selectedCategory || undefined,
        p_is_active:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
            ? false
            : undefined,
        p_limit: 100,
        p_offset: 0,
      });

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
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleDeleteProduct = async (product: AdminProduct) => {
    try {
      const { error } = await supabase.rpc("admin_delete_product", {
        product_id: product.id,
      });

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

  if (loading) {
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
          <p className="text-neutral-600">Manage your product catalog</p>
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

      {/* Filters */}
      <Card variant="outlined" className="border-neutral-200 mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={20} />}
              fullWidth
            />
            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="All Categories"
              fullWidth
            />
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
              fullWidth
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {products.length === 0 ? (
        <Card variant="outlined" className="border-neutral-200">
          <CardContent>
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No products found
              </h3>
              <p className="text-neutral-600 mb-6">
                Get started by creating your first product
              </p>
              <Button
                as={Link}
                to="/admin/products/new"
                variant="primary"
                leftIcon={<Plus size={20} />}
              >
                Add Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock_quantity);

            return (
              <Card
                key={product.id}
                variant="outlined"
                className="border-neutral-200"
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
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-medium text-neutral-900">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.category_name && (
                              <Badge variant="minimal" size="sm">
                                {product.category_name}
                              </Badge>
                            )}
                            <Badge variant={stockStatus.variant} size="sm">
                              {stockStatus.label}
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
                            className="text-red-600 hover:text-red-700"
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
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertTriangle size={20} />
            <p className="text-sm font-medium">This action cannot be undone</p>
          </div>

          <p className="text-sm text-neutral-600">
            Are you sure you want to delete "
            <strong>{deleteModal.product?.name}</strong>"? This will permanently
            remove the product and all associated data.
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
              className="bg-red-600 hover:bg-red-700"
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
