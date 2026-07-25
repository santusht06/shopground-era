import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import HomePage from '@/pages/HomePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import UserProfilePage from '@/pages/UserProfilePage';
import OrdersView from '@/components/ecommerce/OrdersView';
import ProductDetailModal from '@/components/ecommerce/ProductDetailModal';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import CheckoutModal from '@/components/ecommerce/CheckoutModal';
import Footer from '@/components/layout/Footer';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F4F5F8] text-[#0F172A]">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/orders" element={<OrdersView />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Modals & Drawers */}
        <ProductDetailModal />
        <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}
