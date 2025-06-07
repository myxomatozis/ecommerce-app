// src/pages/Admin/ProductFormPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import {
  Button,
  Input,
  Dropdown,
  Card,
  CardContent,
  Checkbox,
  Spinner,
} from "@/components/UI";
import { supabase } from "@/lib/supabase";
import { toast } from "@/utils/toast";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  currency: string;
  image_url: string;
  images_gallery: string[];
  stripe_price_id: string;
  stock_quantity: string;
  category_id: string;
  is_active: boolean;
  metadata: any;
}

interface Category {
  id: string;
  name: string;
}

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== "new" && Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    image_url: "",
    images_gallery: [],
    stripe_price_id: "",
    stock_quantity: "",
    category_id: "",
    is_active: true,
    metadata: {},
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [uploadingImages, setUploadingImages] = useState<
    Record<string, boolean>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [isEditing, id]);

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
      toast.error("Failed to load categories");
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Product not found");

      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        currency: data.currency || "USD",
        image_url: data.image_url || "",
        images_gallery: data.images_gallery || [],
        stripe_price_id: data.stripe_price_id || "",
        stock_quantity: data.stock_quantity?.toString() || "",
        category_id: data.category_id || "",
        is_active: data.is_active ?? true,
        metadata: data.metadata || {},
      });
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
      navigate("/admin/products");
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDropdownChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be less than 10MB");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const allowedTypes = ["jpg", "jpeg", "png", "webp"];

    if (!fileExt || !allowedTypes.includes(fileExt)) {
      throw new Error("Only JPG, PNG, and WebP files are allowed");
    }

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImages((prev) => ({ ...prev, main: true }));
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      toast.success("Main image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setUploadingImages((prev) => ({ ...prev, main: false }));
    }
  };

  const handleGalleryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingImages((prev) => ({ ...prev, gallery: true }));

      const uploadPromises = files.map((file) => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images_gallery: [...prev.images_gallery, ...imageUrls],
      }));

      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload images"
      );
    } finally {
      setUploadingImages((prev) => ({ ...prev, gallery: false }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images_gallery: prev.images_gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        currency: formData.currency,
        image_url: formData.image_url || null,
        images_gallery:
          formData.images_gallery.length > 0 ? formData.images_gallery : null,
        stripe_price_id: formData.stripe_price_id.trim() || null,
        stock_quantity: formData.stock_quantity
          ? parseInt(formData.stock_quantity)
          : null,
        category_id: formData.category_id || null,
        is_active: formData.is_active,
        metadata: formData.metadata,
      };

      if (isEditing && id) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
      }

      toast.success(
        isEditing
          ? "Product updated successfully"
          : "Product created successfully"
      );
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "", label: "Select Category (Optional)" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
  ];

  if (initialLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Spinner size="lg" text="Loading product..." />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          as={Link}
          to="/admin/products"
          variant="ghost"
          leftIcon={<ArrowLeft size={20} />}
        >
          Back to Products
        </Button>
        <div>
          <h1 className="text-2xl font-light text-neutral-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-neutral-600">
            {isEditing
              ? "Update product information"
              : "Create a new product in your catalog"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card variant="outlined" className="border-neutral-200">
          <CardContent>
            <h2 className="text-lg font-medium text-neutral-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                  fullWidth
                  error={errors.name}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  className={`w-full px-4 py-3 text-neutral-900 bg-white border rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.description ? "border-red-300" : "border-neutral-300"
                  }`}
                  required
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle size={16} className="mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                fullWidth
                error={errors.price}
              />

              <Dropdown
                label="Currency"
                options={currencyOptions}
                value={formData.currency}
                onChange={handleDropdownChange("currency")}
                fullWidth
              />

              <Input
                label="Stock Quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="0"
                helperText="Leave empty for unlimited stock"
                fullWidth
              />

              <Dropdown
                label="Category"
                options={categoryOptions}
                value={formData.category_id}
                onChange={handleDropdownChange("category_id")}
                fullWidth
                helperText="Optional - categorize your product"
              />

              <div className="md:col-span-2">
                <Input
                  label="Stripe Price ID"
                  name="stripe_price_id"
                  value={formData.stripe_price_id}
                  onChange={handleInputChange}
                  placeholder="price_xxxxx"
                  helperText="Optional: Stripe price ID for recurring products"
                  fullWidth
                />
              </div>

              <div className="md:col-span-2">
                <Checkbox
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  label="Active Product"
                  description="Product will be visible in the store when active"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card variant="outlined" className="border-neutral-200">
          <CardContent>
            <h2 className="text-lg font-medium text-neutral-900 mb-6">
              Product Images
            </h2>

            {/* Main Image */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-700 mb-4">
                Main Image
              </label>

              <div className="flex items-start space-x-6">
                {formData.image_url && (
                  <div className="w-32 h-32 bg-neutral-100 rounded-lg overflow-hidden relative">
                    <img
                      src={formData.image_url}
                      alt="Main product image"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image_url: "" }))
                      }
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                <div className="flex-1">
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      id="main-image-upload"
                      disabled={uploadingImages.main}
                    />
                    <label
                      htmlFor="main-image-upload"
                      className="cursor-pointer block"
                    >
                      {uploadingImages.main ? (
                        <Spinner size="sm" text="Uploading..." />
                      ) : (
                        <>
                          <Upload
                            size={32}
                            className="mx-auto text-neutral-400 mb-2"
                          />
                          <p className="text-sm text-neutral-600">
                            Click to upload main product image
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            JPG, PNG, WebP up to 10MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-4">
                Additional Images ({formData.images_gallery.length})
              </label>

              {formData.images_gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {formData.images_gallery.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <div className="w-full aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImageUpload}
                  className="hidden"
                  id="gallery-images-upload"
                  disabled={uploadingImages.gallery}
                />
                <label
                  htmlFor="gallery-images-upload"
                  className="cursor-pointer block"
                >
                  {uploadingImages.gallery ? (
                    <Spinner size="sm" text="Uploading..." />
                  ) : (
                    <>
                      <ImageIcon
                        size={32}
                        className="mx-auto text-neutral-400 mb-2"
                      />
                      <p className="text-sm text-neutral-600">
                        Click to upload additional images
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Select multiple images. JPG, PNG, WebP up to 10MB each
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
          <Button as={Link} to="/admin/products" variant="ghost">
            Cancel
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              disabled={loading}
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
