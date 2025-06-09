import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/providers/CartProvider";
import Layout from "@/components/Layout/Layout";
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
import { ScrollToTop } from "./components/ScrollToTop";
import { ToastRenderer } from "@thefolk/ui";

function App() {
  return (
    <CartProvider>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastRenderer position="top-right" maxToasts={4} />
      </Layout>
    </CartProvider>
  );
}

export default App;
