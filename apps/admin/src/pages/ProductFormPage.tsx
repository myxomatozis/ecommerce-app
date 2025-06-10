import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Dropdown,
  Checkbox,
  Spinner,
  toast,
} from "@thefolk/ui";
import AdminAPI from "@thefolk/utils/admin";

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
}

const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== "new";

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    currency: "GBP",
    image_url: "",
    images_gallery: [],
    stripe_price_id: "",
    stock_quantity: "",
    category_id: "",
    is_active: true,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [isEditing, id]);

  const loadCategories = async () => {
    try {
      const data = await AdminAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setInitialLoading(true);
      const products = await AdminAPI.getAllProducts({ limit: 1 });
      const product = products.find((p) => p.id === productId);

      if (!product) {
        toast.error("Product not found");
        navigate("/products");
        return;
      }

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        currency: product.currency || "GBP",
        image_url: product.image_url || "",
        images_gallery: product.images_gallery || [],
        stripe_price_id: product.stripe_price_id || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        category_id: product.category_id || "",
        is_active: product.is_active ?? true,
      });
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
      navigate("/products");
    } finally {
      setInitialLoading(false);
    }
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        currency: formData.currency,
        image_url: formData.image_url || undefined,
        images_gallery:
          formData.images_gallery.length > 0
            ? formData.images_gallery
            : undefined,
        stripe_price_id: formData.stripe_price_id || undefined,
        stock_quantity: formData.stock_quantity
          ? parseInt(formData.stock_quantity)
          : undefined,
        category_id: formData.category_id || undefined,
        is_active: formData.is_active,
      };

      if (isEditing && id) {
        await AdminAPI.updateProduct(id, productData);
        toast.success("Product updated successfully");
      } else {
        await AdminAPI.createProduct(productData);
        toast.success("Product created successfully");
      }

      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const currencyOptions = [
    { value: "GBP", label: "GBP (£)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
  ];

  if (initialLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit Product" : "Add New Product"}
        description={
          isEditing
            ? "Update product information"
            : "Create a new product in your catalog"
        }
      >
        <Button
          as={Link}
          to="/products"
          variant="ghost"
          leftIcon={<ArrowLeft size={20} />}
        >
          Back to Products
        </Button>
      </PageHeader>

      <div className="p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Product Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                    fullWidth
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-4 py-3 text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                <Input
                  label="Price *"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  fullWidth
                />

                <Dropdown
                  label="Currency"
                  options={currencyOptions}
                  value={formData.currency}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
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
                  fullWidth
                />

                <Dropdown
                  label="Category"
                  options={categoryOptions}
                  value={formData.category_id}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, category_id: value }))
                  }
                  fullWidth
                />

                <div className="md:col-span-2">
                  <Input
                    label="Stripe Price ID"
                    name="stripe_price_id"
                    value={formData.stripe_price_id}
                    onChange={handleInputChange}
                    placeholder="price_xxxxx"
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
                    label="Product is active and visible in store"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                label="Main Image URL"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                fullWidth
              />
              <p className="text-xs text-neutral-500 mt-1">
                Note: Advanced image upload functionality will be implemented
                with Supabase Storage
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
            <Button as={Link} to="/products" variant="ghost">
              Cancel
            </Button>

            <Button type="submit" variant="primary" isLoading={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
