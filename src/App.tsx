import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/providers/CartProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout/Layout";
import { AdminLayout, ProtectedRoute } from "@/components/Admin";

// Public pages
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import SuccessPage from "@/pages/SuccessPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import FAQPage from "@/pages/FAQPage";
import LegalPage from "@/pages/LegalPage";
import SizeGuidePage from "@/pages/SizeGuidePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Admin pages
import { AdminLoginPage } from "@/pages/Admin/LoginPage";
import { AdminDashboardPage } from "@/pages/Admin/DashboardPage";
import { AdminProductsPage } from "@/pages/Admin/ProductsPage";
import { ProductFormPage } from "@/pages/Admin/ProductFormPage";
import { AdminOrdersPage } from "@/pages/Admin/OrdersPage";

import { ScrollToTop } from "./components/ScrollToTop";
import { ToastRenderer } from "./components/UI";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout>
                <ProductsPage />
              </Layout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <Layout>
                <ProductDetailPage />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <CartPage />
              </Layout>
            }
          />
          <Route
            path="/checkout"
            element={
              <Layout>
                <CheckoutPage />
              </Layout>
            }
          />
          <Route
            path="/success"
            element={
              <Layout>
                <SuccessPage />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/faq"
            element={
              <Layout>
                <FAQPage />
              </Layout>
            }
          />
          <Route
            path="/size-guide"
            element={
              <Layout>
                <SizeGuidePage />
              </Layout>
            }
          />
          <Route
            path="/privacy"
            element={
              <Layout>
                <LegalPage />
              </Layout>
            }
          />
          <Route
            path="/terms"
            element={
              <Layout>
                <LegalPage />
              </Layout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFoundPage />
              </Layout>
            }
          />
        </Routes>
        <ToastRenderer position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
