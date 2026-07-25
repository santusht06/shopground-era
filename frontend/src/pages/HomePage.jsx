import React, { useEffect } from 'react';
import HeroBanner from '@/components/ecommerce/HeroBanner';
import CategoryGridCards from '@/components/ecommerce/CategoryGridCards';
import DealsCarousel from '@/components/ecommerce/DealsCarousel';
import BrandStrip from '@/components/ecommerce/BrandStrip';
import ProductGrid from '@/components/ecommerce/ProductGrid';
import ProductDetailModal from '@/components/ecommerce/ProductDetailModal';

export default function HomePage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="space-y-4 pb-16">
            {/* 1. Festival Sale Hero Banner */}
            <HeroBanner />

            {/* 2. Amazon-Style 2x2 Category Showcase Cards */}
            <CategoryGridCards />

            {/* 3. Flipkart-Style Deal of the Day Horizontal Carousel */}
            <DealsCarousel />

            {/* 4. Brand Value Props & Guarantees Strip */}
            <BrandStrip />

            {/* 5. Main Product Catalog & Filters */}
            <div id="product-catalog" className="pt-4">
                <ProductGrid />
            </div>

            {/* Quick View Modal */}
            <ProductDetailModal />
        </div>
    );
}
