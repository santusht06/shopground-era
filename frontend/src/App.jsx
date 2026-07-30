import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import HomePage from '@/pages/HomePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import CheckoutModal from '@/components/ecommerce/CheckoutModal';
import PolicyModal from '@/components/ecommerce/PolicyModal';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState('refund');

  const openPolicy = (tab = 'refund') => {
    setActivePolicyTab(tab);
    setIsPolicyOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#050507] text-[#F8FAFC]">
        {/* Single Product Portfolio Navbar */}
        <Navbar onOpenPolicy={openPolicy} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenPolicy={openPolicy} />} />
            <Route path="/product/:id" element={<ProductDetailPage onOpenPolicy={openPolicy} />} />
            <Route path="/refund-policy" element={<HomePage onOpenPolicy={openPolicy} autoOpenPolicyTab="refund" />} />
            <Route path="/privacy-policy" element={<HomePage onOpenPolicy={openPolicy} autoOpenPolicyTab="privacy" />} />
            <Route path="/terms" element={<HomePage onOpenPolicy={openPolicy} autoOpenPolicyTab="terms" />} />
            <Route path="/sample" element={<HomePage onOpenPolicy={openPolicy} autoOpenPolicyTab="sample" />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer onOpenPolicy={openPolicy} />

        {/* Global Cart Drawer, Inquiry Checkout & Unified Policy Modals */}
        <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        <PolicyModal
          isOpen={isPolicyOpen}
          onClose={() => setIsPolicyOpen(false)}
          initialTab={activePolicyTab}
        />
      </div>
    </BrowserRouter>
  );
}
