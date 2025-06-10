// apps/admin/src/App.tsx
// Rewritten to use shared @thefolk/ui components and new AdminAPI

import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/AdminLayout";

// Import shared UI components
import { ToastRenderer } from "@thefolk/ui";

// Admin-specific pages (built with shared UI)
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductFormPage from "@/pages/ProductFormPage";
import OrdersPage from "@/pages/OrdersPage";
import UsersPage from "@/pages/UsersPage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrdersPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Use shared toast renderer */}
      <ToastRenderer />
    </AuthProvider>
  );
}

export default App;
