import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '@/store/slices/productsSlice';
import HeroBanner from '@/components/ecommerce/HeroBanner';
import BrandStrip from '@/components/ecommerce/BrandStrip';
import WholesaleTiers from '@/components/ecommerce/WholesaleTiers';
import AcousticFeatures from '@/components/ecommerce/AcousticFeatures';
import TechSpecsTable from '@/components/ecommerce/TechSpecsTable';
import InquiryForm from '@/components/ecommerce/InquiryForm';
import MarketingVideoShowcase from '@/components/ecommerce/MarketingVideoShowcase';
import { HeroSkeleton } from '@/components/ui/skeleton';
import applySEO from '@/hooks/useSEO';

const FLAGSHIP_ID = '66a87f12bc09a123456789ab';

export default function HomePage() {
    const dispatch = useDispatch();

    // ── Pull product from Redux cache ─────────────────────────────────────────
    const reduxProduct = useSelector(state => state.products.selectedProduct);
    const reduxLoading = useSelector(state => state.products.loading);

    // Only show skeleton if we have NO cached data at all (first ever load).
    // If we have stale-but-valid Redux data, render immediately and refresh silently.
    const hasData = Boolean(reduxProduct);
    const [localProduct, setLocalProduct] = useState(reduxProduct);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Dispatch cache-aware thunk — returns instantly from cache if fresh
        dispatch(fetchProductById(FLAGSHIP_ID))
            .unwrap()
            .then(payload => {
                const prod = payload?.product || payload;
                if (prod && prod.name) setLocalProduct(prod);
            })
            .catch(() => {
                // API unavailable — keep whatever we have (could be stale cache or null)
            });
    }, [dispatch]);

    // Sync local product when Redux updates
    useEffect(() => {
        if (reduxProduct) setLocalProduct(reduxProduct);
    }, [reduxProduct]);

    // ─── Dynamic SEO ──────────────────────────────────────────────────────────
    useEffect(() => {
        applySEO({
            title: 'Anti Vibration Pads for Washing Machine — ShopGround Era | 800 LB Heavy-Duty Shock Absorbing Rubber Feet',
            description: 'ShopGround Era (shopgroundera.com) — factory-direct GroundEra Anti Vibration Pads. 800 LB load rating. Stackable height leveling shims. Honeycomb anti-skid grip. 99.4% noise reduction. Ships in 48 hours. For front & top load washers, dryers, treadmills & HVAC.',
            keywords: 'Anti Vibration Pads for Washing Machine, Front Load Washer Vibration Stopper Rubber Legs, Top Load Washing Machine Anti Skid Stand, Heavy Duty Shock Absorbing Noise Reduction Rubber Pads, Dryer Stabilizer Rubber Legs, HVAC Compressor Anti Vibration Rubber Mounts, Treadmill Anti Vibration Foot Pads, 800 LB Load Rating Rubber Isolation Pads, Stackable Height Adjustable Washing Machine Stand, Honeycomb Anti-Skid Rubber Appliance Feet, GroundEra Anti Vibration Pads, ShopGround Era, shopgroundera.com',
            canonical: 'https://shopgroundera.com/',
            image: 'https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png',
            type: 'website',
            schemas: [
                {
                    id: 'homepage-website',
                    schema: {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        'name': 'ShopGround Era',
                        'alternateName': ['shopgroundera', 'shopgroundera.com', 'GroundEra Anti Vibration Pads', 'GroundEra'],
                        'url': 'https://shopgroundera.com',
                        'description': 'ShopGround Era manufactures GroundEra Anti Vibration Pads — heavy-duty 800 LB rated rubber shock absorbers and stackable leveling feet for washing machines, dryers, treadmills, and HVAC equipment.',
                        'potentialAction': {
                            '@type': 'SearchAction',
                            'target': { '@type': 'EntryPoint', 'urlTemplate': 'https://shopgroundera.com/?q={search_term_string}' },
                            'query-input': 'required name=search_term_string'
                        }
                    }
                },
                {
                    id: 'homepage-org',
                    schema: {
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        'name': 'ShopGround Era',
                        'alternateName': 'GroundEra',
                        'url': 'https://shopgroundera.com',
                        'logo': {
                            '@type': 'ImageObject',
                            'url': 'https://shopgroundera.com/logo.png',
                            'width': '512',
                            'height': '512'
                        },
                        'image': 'https://shopgroundera.com/logo.png',
                        'description': 'Factory-direct manufacturer of GroundEra Anti Vibration Pads — industrial-grade rubber shock absorbers with 800 LB load capacity, honeycomb grip, and stackable height leveling for washers, dryers, treadmills, and heavy machinery.',
                        'email': 'info@shopgroundera.com',
                        'contactPoint': {
                            '@type': 'ContactPoint',
                            'email': 'info@shopgroundera.com',
                            'contactType': 'customer support',
                            'availableLanguage': 'English'
                        },
                        'sameAs': ['https://www.amazon.com/dp/B0H915VTB1']
                    }
                },
                {
                    id: 'homepage-product-list',
                    schema: {
                        '@context': 'https://schema.org',
                        '@type': 'ItemList',
                        'name': 'GroundEra Anti Vibration Pads — Product Variants',
                        'description': 'Heavy-duty anti vibration pads for washing machines, dryers, treadmills, and HVAC systems',
                        'itemListElement': [
                            {
                                '@type': 'ListItem',
                                'position': 1,
                                'url': 'https://shopgroundera.com/product/66a87f12bc09a123456789ab',
                                'name': 'GroundEra Anti Vibration Pads 4-Pack (GE-PADS-800)',
                                'image': 'https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png'
                            },
                            {
                                '@type': 'ListItem',
                                'position': 2,
                                'url': 'https://www.amazon.com/dp/B0H915VTB1',
                                'name': 'GroundEra Anti Vibration Pads on Amazon',
                                'image': 'https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png'
                            }
                        ]
                    }
                },
                {
                    id: 'homepage-faq',
                    schema: {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        'mainEntity': [
                            {
                                '@type': 'Question',
                                'name': 'Do anti vibration pads actually work for washing machines?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Yes. GroundEra heavy-duty anti vibration pads are clinically tested to absorb up to 99.4% of kinetic spin energy. The high-density elastomer polymer compound stops washing machines from walking, sliding, or creating loud floor vibration noise during spin cycles.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'What is the purpose of anti vibration pads for washing machines?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Anti vibration pads are placed under appliance feet to absorb and isolate the vibration energy created by high-speed spin cycles. They prevent the machine from "walking" across the floor, reduce noise, protect flooring, and extend appliance lifespan by reducing stress on internal components.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Are GroundEra anti vibration pads compatible with front load and top load washers?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Yes. GroundEra anti vibration pads feature a universal cup recess that fits standard appliance feet up to 1.85 inches in diameter. Compatible with Samsung, LG, Whirlpool, Bosch, Maytag, GE, Electrolux, Miele, and all other major brands for both front-load and top-load models.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'What is the load capacity of GroundEra anti vibration pads?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'GroundEra anti vibration pads support up to 800 LBS per 4-pad set, making them suitable for commercial front-load washers, heavy dryers, treadmills, refrigerators, and HVAC compressor units.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Can anti vibration pads be used for heavy machinery and HVAC?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Yes. GroundEra pads are rated for industrial and commercial applications including HVAC compressors, industrial treadmills, commercial laundry equipment, and heavy-duty machinery up to 800 LBS per set.'
                                }
                            }
                        ]
                    }
                }
            ]
        });
    }, []);

    const scrollToInquiry = () => {
        const el = document.getElementById('inquiry-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // ── Show skeleton ONLY on the very first load (no cached data anywhere) ──
    if (!hasData && reduxLoading) {
        return <HeroSkeleton />;
    }

    const product = localProduct;

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
                <InquiryForm
                    productId={product?._id || FLAGSHIP_ID}
                    productName={product?.name}
                />
            </div>
        </div>
    );
}
