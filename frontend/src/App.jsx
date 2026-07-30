import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import HomePage from '@/pages/HomePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import CheckoutModal from '@/components/ecommerce/CheckoutModal';
import RefundPolicyModal from '@/components/ecommerce/RefundPolicyModal';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRefundPolicyOpen, setIsRefundPolicyOpen] = useState(false);

  const openRefundPolicy = () => setIsRefundPolicyOpen(true);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#050507] text-[#F8FAFC]">
        {/* Single Product Portfolio Navbar */}
        <Navbar onOpenRefundPolicy={openRefundPolicy} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenRefundPolicy={openRefundPolicy} />} />
            <Route path="/product/:id" element={<ProductDetailPage onOpenRefundPolicy={openRefundPolicy} />} />
            <Route path="/refund-policy" element={<HomePage onOpenRefundPolicy={openRefundPolicy} autoOpenRefund={true} />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer onOpenRefundPolicy={openRefundPolicy} />

        {/* Global Cart Drawer, Inquiry Checkout & Refund Policy Modals */}
        <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        <RefundPolicyModal isOpen={isRefundPolicyOpen} onClose={() => setIsRefundPolicyOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
