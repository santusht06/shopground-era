import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import HomePage from '@/pages/HomePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import PolicyPage from '@/pages/PolicyPage';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import CheckoutModal from '@/components/ecommerce/CheckoutModal';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#050507] text-[#F8FAFC]">
        {/* Single Product Portfolio Navbar */}
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/refund-policy" element={<PolicyPage defaultTab="refund" />} />
            <Route path="/privacy-policy" element={<PolicyPage defaultTab="privacy" />} />
            <Route path="/terms" element={<PolicyPage defaultTab="terms" />} />
            <Route path="/sample" element={<PolicyPage defaultTab="sample" />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Cart Drawer & Inquiry Checkout Modal */}
        <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
