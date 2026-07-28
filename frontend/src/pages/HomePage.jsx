import React, { useEffect, useState } from 'react';
import apiClient from '@/services/apiClient';
import HeroBanner from '@/components/ecommerce/HeroBanner';
import BrandStrip from '@/components/ecommerce/BrandStrip';
import DealsCarousel from '@/components/ecommerce/DealsCarousel';
import AcousticFeatures from '@/components/ecommerce/AcousticFeatures';
import TechSpecsTable from '@/components/ecommerce/TechSpecsTable';
import InquiryForm from '@/components/ecommerce/InquiryForm';
import { Loader2 } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050507] flex items-center justify-center gap-3 text-slate-400 py-32">
                <Loader2 className="w-6 h-6 animate-spin text-[#F27E24]" />
                <span className="text-base font-bold font-heading tracking-wide">Loading ShopGround Era…</span>
            </div>
        );
    }

    return (
        <div className="bg-[#050507] space-y-6 pb-20 text-[#F8FAFC]">
            {/* 1. Flagship Hero Banner with Sliding Photos Marketing Carousel */}
            <div id="product-overview">
                <HeroBanner />
            </div>

            {/* 2. Startup Metrics & Live Trust Strip */}
            <BrandStrip />

            {/* 3. Limited Time Flash Offers Sliding Deals Carousel */}
            <DealsCarousel />

            {/* 4. Driver & Acoustic Innovation Section */}
            <AcousticFeatures product={product} />

            {/* 5. Full Technical Specs Datasheet */}
            <TechSpecsTable product={product} />

            {/* 6. Distribution & Pre-Order Inquiry Lead Form */}
            <InquiryForm productId={product?._id || '66a87f12bc09a123456789ab'} productName={product?.name} />
        </div>
    );
}
