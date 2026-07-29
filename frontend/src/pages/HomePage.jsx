import React, { useEffect, useState } from 'react';
import apiClient from '@/services/apiClient';
import HeroBanner from '@/components/ecommerce/HeroBanner';
import BrandStrip from '@/components/ecommerce/BrandStrip';
import WholesaleTiers from '@/components/ecommerce/WholesaleTiers';
import AcousticFeatures from '@/components/ecommerce/AcousticFeatures';
import TechSpecsTable from '@/components/ecommerce/TechSpecsTable';
import InquiryForm from '@/components/ecommerce/InquiryForm';
import MarketingVideoShowcase from '@/components/ecommerce/MarketingVideoShowcase';
import { HeroSkeleton } from '@/components/ui/skeleton';

export default function HomePage() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                // Fetch flagship single product directly from MongoDB backend
                const res = await apiClient.get('/products/66a87f12bc09a123456789ab');
                setProduct(res.data);
            } catch (err) {
                console.error('Failed to fetch flagship product for home page:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, []);

    const scrollToInquiry = () => {
        const el = document.getElementById('inquiry-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) {
        return <HeroSkeleton />;
    }

    return (
        <div className="bg-[#050507] space-y-6 pb-20 text-[#F8FAFC]">
            {/* 1. Flagship Hero Banner with Sliding Photos Marketing Carousel */}
            <div id="product-overview">
                <HeroBanner />
            </div>

            {/* 2. Startup Metrics & Live Trust Strip */}
            <BrandStrip />

            {/* 3. Marketing Video Showcase (Streaming Chunked Video Demo) */}
            <MarketingVideoShowcase onInquireClick={scrollToInquiry} />

            {/* 4. Direct Factory Supply & Wholesale Volume Tiers */}
            <div id="wholesale-section">
                <WholesaleTiers />
            </div>

            {/* 5. Driver & Acoustic Innovation Section */}
            <AcousticFeatures product={product} />

            {/* 6. Full Technical Specs Datasheet */}
            <TechSpecsTable product={product} />

            {/* 7. Distribution & Pre-Order Inquiry Lead Form */}
            <div id="inquiry-section">
                <InquiryForm productId={product?._id || '66a87f12bc09a123456789ab'} productName={product?.name} />
            </div>
        </div>
    );
}
