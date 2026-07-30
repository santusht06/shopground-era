import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { cachedGet } from '@/services/apiClient';
import InquiryForm from '@/components/ecommerce/InquiryForm';
import TechSpecsTable from '@/components/ecommerce/TechSpecsTable';
import { ProductDetailSkeleton } from '@/components/ui/skeleton';
import { AmazonCardButton } from '@/components/ui/AmazonBuyButton';
import MarketingVideoShowcase from '@/components/ecommerce/MarketingVideoShowcase';
import applySEO from '@/hooks/useSEO';
import {
    Star, Check, ChevronRight, Share2, Shield, Truck,
    RotateCcw, Zap, Headphones, Building, Send, ExternalLink,
    ShoppingBag, Layers, VolumeX, CheckCircle2, Sliders, ArrowRight, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Hardcoded Flagship Product Fallback (Guarantees zero downtime / zero error screen)
const FALLBACK_FLAGSHIP_PRODUCT = {
    _id: "66a87f12bc09a123456789ab",
    id: "66a87f12bc09a123456789ab",
    name: "GroundEra Anti-Vibration Pads with Leveling Shim & Mini Level",
    model_number: "GE-PADS-800",
    manufacturer: "GroundEra Hardware Corp.",
    subtitle: "The Ultimate Stability Solution — Stackable Heavy-Duty Appliance Isolators",
    short_description: "Heavy-duty anti-vibration pads featuring an innovative stackable design, high-traction honeycomb grip texture, 800 lb load rating, and precision leveling shims with a mini bubble level.",
    long_description: "Engineered to eliminate appliance walking, floor scuffs, and loud structural vibration. GroundEra Anti-Vibration Pads feature an innovative stackable modular system allowing custom height adjustments for perfect appliance balance. Constructed with a heavy-duty impact-resistant polymer compound and high-grip honeycomb surface texture rated for up to 800 lbs. Includes precision leveling shims and a keychain mini spirit level tool for easy, accurate installation.",
    price: 29.99,
    wholesale_mrp: 39.99,
    discount_percent: 25.0,
    moq: 10,
    category: "Home & Appliance Hardware",
    brand: "GroundEra",
    stock: 2500,
    rating: 4.9,
    reviewsCount: 482,
    image: "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png",
    images: [
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png",
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_angle.png",
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_banner1.png",
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_banner2.png"
    ],
    tech_specs: {
        "Load Rating": "800 lbs Weight Capacity",
        "Design System": "Innovative Stackable Height System",
        "Surface Grip Texture": "High-Density Honeycomb Anti-Slip Structure",
        "Leveling Tools Included": "Precision Leveling Shim & Keychain Mini Spirit Level",
        "Noise & Vibration Reduction": "Heavy-Duty Acoustic Dampening Elastomer",
        "Appliance Compatibility": "Washing Machines, Dryers, Ovens, Treadmills, Heavy Furniture",
        "Floor Protection": "Tile, Hardwood, Vinyl, Concrete, Laminate",
        "Dimensions": "4.3 x 4.3 x 1.5 inches per pad",
        "Warranty": "Lifetime Manufacturer Warranty"
    },
    box_contents: [
        "4x GroundEra Stackable Heavy-Duty Anti-Vibration Pads",
        "1x Precision Fine-Tuning Leveling Shim",
        "1x Portable Keychain Mini Spirit Level Tool",
        "1x Installation & Height Adjustment Guide"
    ],
    key_highlights: [
        "Innovative Stackable Modular Design for Customizable Height",
        "800 LB Load Capacity for Heavy Commercial Washers & Dryers",
        "High-Traction Honeycomb Pattern Prevents Appliance Walking & Slipping",
        "Includes Precision Leveling Shim & Mini Spirit Level Tool",
        "Lifetime Manufacturer Warranty & All-Surface Floor Protection"
    ],
    variants: [
        { sku: "GE-PADS-4PK", color: "Industrial Grey / Black", stock: 1500, price: 29.99 },
        { sku: "GE-PADS-8PK", color: "Industrial Grey / Black (8-Pack)", stock: 1000, price: 49.99 }
    ]
};

export default function ProductDetailPage({ onOpenPolicy }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ── Pull any already-cached product from Redux before firing a fetch ─────
    const reduxProduct = useSelector(state => state.products.selectedProduct);
    const isSameProduct = reduxProduct &&
        (reduxProduct._id === (id || '66a87f12bc09a123456789ab') ||
         reduxProduct.id  === (id || '66a87f12bc09a123456789ab'));

    // If Redux already has this product — pre-populate immediately (no skeleton)
    const [product, setProduct] = useState(isSameProduct ? reduxProduct : null);
    const [selectedImage, setSelectedImage] = useState(
        isSameProduct
            ? (reduxProduct.images?.[0] || reduxProduct.image || FALLBACK_FLAGSHIP_PRODUCT.image)
            : null
    );
    const [copiedLink, setCopiedLink] = useState(false);
    // fetching=false from the start if we already have data
    const [fetching, setFetching] = useState(!isSameProduct);
    const hasFetched = useRef(false);

    // E-Commerce Quantity & Tab State
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('mechanics'); // 'mechanics' | 'installation' | 'compatibility' | 'reviews'
    const [addedFeedback, setAddedFeedback] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const targetId = id || '66a87f12bc09a123456789ab';

        // If we already pre-populated from Redux — skip skeleton, do background refresh
        if (isSameProduct && !hasFetched.current) {
            hasFetched.current = true;
            // Silent background revalidation (no skeleton, no loading)
            cachedGet(`/products/${targetId}`)
                .then(data => {
                    if (data) {
                        setProduct(data);
                        setSelectedImage(data?.images?.[0] || data?.image || FALLBACK_FLAGSHIP_PRODUCT.image);
                    }
                })
                .catch(() => {}); // Keep showing stale cached data on error
            return;
        }

        // No cached data — show skeleton and fetch
        const fetchProductData = async () => {
            setFetching(true);
            try {
                // cachedGet: checks memory → sessionStorage → network
                const data = await cachedGet(`/products/${targetId}`);
                setProduct(data);
                setSelectedImage(data?.images?.[0] || data?.image || FALLBACK_FLAGSHIP_PRODUCT.image);
            } catch (err) {
                console.warn(`Failed to fetch product '${targetId}', attempting flagship fallback cache...`, err);
                try {
                    const fallbackData = await cachedGet('/products/66a87f12bc09a123456789ab');
                    setProduct(fallbackData);
                    setSelectedImage(fallbackData?.images?.[0] || fallbackData?.image || FALLBACK_FLAGSHIP_PRODUCT.image);
                } catch (fallbackErr) {
                    console.warn('All cache layers missed, using hardcoded fallback:', fallbackErr);
                    setProduct(FALLBACK_FLAGSHIP_PRODUCT);
                    setSelectedImage(FALLBACK_FLAGSHIP_PRODUCT.image);
                }
            } finally {
                setFetching(false);
                hasFetched.current = true;
            }
        };

        fetchProductData();
    }, [id]);

    // ─── Dynamic SEO: inject rich structured data per product ───────────────────
    useEffect(() => {
        if (!product && fetching) return;
        const prod = product || FALLBACK_FLAGSHIP_PRODUCT;
        const productUrl = `https://shopgroundera.com/product/${prod._id || '66a87f12bc09a123456789ab'}`;
        const mainImage = prod.images?.[0] || prod.image || 'https://shopgroundera.com/logo.png';

        applySEO({
            title: `${prod.name} | Anti Vibration Pads for Washing Machine — ShopGround Era`,
            description: `Buy GroundEra ${prod.name} — 800 LB rated heavy-duty anti-vibration pads for front & top load washing machines, dryers, treadmills & HVAC. Stackable height leveling shims, honeycomb grip, 99.4% noise reduction. Ships in 48 hrs.`,
            keywords: 'Anti Vibration Pads for Washing Machine, Front Load Washer Vibration Stopper, Top Load Washing Machine Anti Skid Feet, Heavy Duty Shock Absorbing Rubber Pads, Dryer Stabilizer Rubber Legs, HVAC Compressor Rubber Mounts, Treadmill Vibration Dampening Pads, 800 LB Load Rating Anti Vibration, Noise Reduction Appliance Feet, Stackable Leveling Shim for Washing Machine, GroundEra, ShopGround Era, shopgroundera.com',
            canonical: productUrl,
            image: mainImage,
            type: 'product',
            schemas: [
                {
                    id: 'breadcrumb',
                    schema: {
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', 'position': 1, 'name': 'ShopGround Era', 'item': 'https://shopgroundera.com' },
                            { '@type': 'ListItem', 'position': 2, 'name': 'Anti Vibration Pads', 'item': 'https://shopgroundera.com/product/66a87f12bc09a123456789ab' },
                            { '@type': 'ListItem', 'position': 3, 'name': prod.name, 'item': productUrl },
                        ]
                    }
                },
                {
                    id: 'product-rich',
                    schema: {
                        '@context': 'https://schema.org/',
                        '@type': 'Product',
                        'name': prod.name,
                        'description': prod.long_description || prod.short_description,
                        'image': prod.images || [mainImage],
                        'sku': prod.model_number || 'GE-PADS-800',
                        'mpn': 'GE-PADS-2026',
                        'brand': { '@type': 'Brand', 'name': 'GroundEra', 'logo': 'https://shopgroundera.com/logo.png' },
                        'manufacturer': { '@type': 'Organization', 'name': 'ShopGround Era', 'url': 'https://shopgroundera.com', 'logo': 'https://shopgroundera.com/logo.png' },
                        'aggregateRating': {
                            '@type': 'AggregateRating',
                            'ratingValue': prod.rating || 4.9,
                            'reviewCount': prod.reviewsCount || 482,
                            'bestRating': 5,
                            'worstRating': 1
                        },
                        'offers': [
                            {
                                '@type': 'Offer',
                                'url': productUrl,
                                'priceCurrency': 'USD',
                                'price': (prod.price || 29.99).toFixed(2),
                                'priceValidUntil': '2027-12-31',
                                'itemCondition': 'https://schema.org/NewCondition',
                                'availability': 'https://schema.org/InStock',
                                'hasMerchantReturnPolicy': {
                                    '@type': 'MerchantReturnPolicy',
                                    'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
                                    'merchantReturnDays': 30,
                                    'returnMethod': 'https://schema.org/ReturnByMail',
                                    'returnFees': 'https://schema.org/FreeReturn'
                                },
                                'shippingDetails': {
                                    '@type': 'OfferShippingDetails',
                                    'shippingRate': { '@type': 'MonetaryAmount', 'value': '0', 'currency': 'USD' },
                                    'shippingDestination': { '@type': 'DefinedRegion', 'addressCountry': 'US' },
                                    'deliveryTime': {
                                        '@type': 'ShippingDeliveryTime',
                                        'handlingTime': { '@type': 'QuantitativeValue', 'minValue': 0, 'maxValue': 1, 'unitCode': 'DAY' },
                                        'transitTime': { '@type': 'QuantitativeValue', 'minValue': 1, 'maxValue': 3, 'unitCode': 'DAY' }
                                    }
                                },
                                'seller': { '@type': 'Organization', 'name': 'ShopGround Era', 'url': 'https://shopgroundera.com' }
                            },
                            {
                                '@type': 'Offer',
                                'url': 'https://www.amazon.com/dp/B0H915VTB1',
                                'priceCurrency': 'USD',
                                'price': (prod.price || 29.99).toFixed(2),
                                'priceValidUntil': '2027-12-31',
                                'itemCondition': 'https://schema.org/NewCondition',
                                'availability': 'https://schema.org/InStock',
                                'seller': { '@type': 'Organization', 'name': 'Amazon' }
                            }
                        ]
                    }
                },
                {
                    id: 'video-object',
                    schema: {
                        '@context': 'https://schema.org',
                        '@type': 'VideoObject',
                        'name': 'GroundEra Anti Vibration Pads — Stop Washing Machine Walking & Noise',
                        'description': 'See how GroundEra heavy-duty anti vibration pads instantly stop washing machine walking, sliding, and loud spin-cycle vibration noise on tile, hardwood, and concrete floors.',
                        'thumbnailUrl': mainImage,
                        'uploadDate': '2026-07-01T00:00:00Z',
                        'duration': 'PT2M30S',
                        'contentUrl': 'https://shopgroundera.com/videos/marketing.mp4',
                        'embedUrl': 'https://shopgroundera.com/product/66a87f12bc09a123456789ab#video-showcase',
                        'publisher': { '@type': 'Organization', 'name': 'ShopGround Era', 'logo': { '@type': 'ImageObject', 'url': 'https://shopgroundera.com/logo.png' } }
                    }
                },
                {
                    id: 'speakable',
                    schema: {
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        'name': prod.name,
                        'speakable': {
                            '@type': 'SpeakableSpecification',
                            'cssSelector': ['h1', '.product-speakable-summary']
                        },
                        'url': productUrl
                    }
                }
            ]
        });
    }, [product, fetching]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleAddToCart = () => {
        const prod = product || FALLBACK_FLAGSHIP_PRODUCT;
        const mongoId = prod._id || prod.id || '66a87f12bc09a123456789ab';
        dispatch(addToCart({
            id: mongoId,
            name: prod.name,
            price: prod.price || 29.99,
            quantity: quantity,
            image: selectedImage || prod.image || FALLBACK_FLAGSHIP_PRODUCT.image,
            category: 'Anti-Vibration Hardware',
        }));
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2500);
    };

    // Only show skeleton on true first load — never on cached re-visits
    if (fetching && !product) {
        return <ProductDetailSkeleton />;
    }

    const currentProduct = product || FALLBACK_FLAGSHIP_PRODUCT;
    const galleryImages = currentProduct.images?.length ? currentProduct.images : FALLBACK_FLAGSHIP_PRODUCT.images;
    const originalPrice = currentProduct.originalPrice || currentProduct.original_price || currentProduct.wholesale_mrp || 39.99;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-[#050507] text-[#F8FAFC]">

            {/* Breadcrumb & Share Bar — BreadcrumbList visible for SEO */}
            <nav aria-label="Breadcrumb" className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-4 gap-3">
                <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap list-none m-0 p-0" itemScope itemType="https://schema.org/BreadcrumbList">
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link to="/" itemProp="item" className="hover:text-[#F27E24] font-medium text-slate-300">
                            <span itemProp="name">Home</span>
                        </Link>
                        <meta itemProp="position" content="1" />
                    </li>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <Link to="/" itemProp="item" className="hover:text-[#F27E24] font-medium text-slate-300">
                            <span itemProp="name">Anti Vibration Pads</span>
                        </Link>
                        <meta itemProp="position" content="2" />
                    </li>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                        <span itemProp="name" className="font-bold text-white truncate max-w-xs">{currentProduct.name}</span>
                        <meta itemProp="position" content="3" />
                    </li>
                </ol>

                <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 border-white/10 bg-[#0C0C12] text-slate-200 hover:border-white/20 h-8"
                >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#F27E24]" /> : <Share2 className="w-3.5 h-3.5 text-[#F27E24]" />}
                    {copiedLink ? 'Copied!' : 'Share'}
                </Button>
            </nav>

            {/* Main Product Split Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* Left: Product Media Gallery */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-4/3 bg-[#0C0C12] rounded-3xl border border-white/10 overflow-hidden group shadow-2xl orange-glow-border">
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt={currentProduct.name}
                                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                            />
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {galleryImages.length > 1 && (
                        <div className="grid grid-cols-5 gap-3">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-2xl border-2 overflow-hidden bg-[#0C0C12] p-2 transition-all cursor-pointer ${
                                        selectedImage === img
                                            ? 'border-[#F27E24] shadow-[0_0_12px_rgba(242,126,36,0.6)] scale-105'
                                            : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                                    }`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Detailed Specification Summary & E-Commerce Order Box */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] text-[11px] font-black uppercase tracking-wider">
                                {currentProduct.category || "Appliance Damping"}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">SKU: {currentProduct.model_number || "GE-PADS-800"}</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
                            {currentProduct.name}
                        </h1>

                    </div>

                    {/* SpeakableSpecification target — Google Assistant reads this summary */}
                    <p className="product-speakable-summary text-slate-300 text-sm leading-relaxed font-normal">
                        {currentProduct.long_description || currentProduct.description || "Industrial-grade elastomer acoustic isolation engineered with high-traction honeycomb grips, stackable leveling shims, and an 800 LB load capacity."}
                    </p>

                    {/* Price Box */}
                    <div className="p-5 bg-[#0C0C12] border border-white/10 rounded-2xl shadow-xl space-y-3 orange-glow-border">
                        <span className="text-xs text-slate-400 block font-medium">Sample / Direct Order Price</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white font-mono">
                                ${currentProduct.price?.toFixed(2)}
                            </span>
                            {originalPrice > currentProduct.price && (
                                <span className="text-sm text-slate-500 line-through font-normal font-mono">
                                    ${originalPrice?.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quantity Selector & Add To Cart CTAs */}
                    <div className="space-y-3 pt-1">
                        {/* Amazon Direct Purchase — card variant */}
                        <AmazonCardButton />

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-[#0C0C12] border border-white/10 rounded-2xl p-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-bold cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center font-mono font-bold text-white text-sm">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-bold cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 h-12 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl transition-all gap-2 border border-white/15 cursor-pointer"
                            >
                                <ShoppingBag className="w-4 h-4 text-[#F27E24]" />
                                {addedFeedback ? 'Added to Bag!' : `Add to Cart — $${((currentProduct.price || 29.99) * quantity).toFixed(2)}`}
                            </Button>
                        </div>
                    </div>

                    {/* Trust Badges — Prominently featuring 30-Day Free Returns */}
                    <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-slate-300 font-medium border-t border-white/10 pt-5">
                        <div className="p-3 rounded-2xl bg-[#0C0C12] border border-white/10 flex flex-col items-center gap-1.5 justify-center">
                            <Truck className="w-4.5 h-4.5 text-[#F27E24]" />
                            <span className="font-semibold text-slate-200">Express Shipping</span>
                        </div>
                        <button
                            onClick={() => onOpenPolicy?.('refund')}
                            className="p-3 rounded-2xl bg-[#0C0C12] border border-[#F27E24]/30 hover:border-[#F27E24] flex flex-col items-center gap-1.5 justify-center cursor-pointer hover:bg-white/5 transition-all group text-left"
                            title="Click to view Refund & Return Policy"
                        >
                            <RotateCcw className="w-4.5 h-4.5 text-[#F27E24] group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-white text-center leading-tight">Free returns within 30 days</span>
                        </button>
                        <div className="p-3 rounded-2xl bg-[#0C0C12] border border-white/10 flex flex-col items-center gap-1.5 justify-center">
                            <Shield className="w-4.5 h-4.5 text-[#F27E24]" />
                            <span className="font-semibold text-slate-200">Lifetime Warranty</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Marketing Demo Section */}
            <MarketingVideoShowcase onInquireClick={() => {
                document.getElementById('inquiry-form-section')?.scrollIntoView({ behavior: 'smooth' });
            }} />

            {/* DEEP PRODUCT DESCRIPTION & TECHNICAL BREAKDOWN TABS */}
            <div className="bg-[#0C0C12] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-[0_10px_30px_rgba(0,0,0,0.8)] orange-glow-border">
                
                {/* Tab Controls */}
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('mechanics')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === 'mechanics'
                                ? 'bg-[#F27E24] text-white shadow-[0_0_15px_rgba(242,126,36,0.5)]'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                        <Activity className="w-4 h-4" /> Acoustic Damping Mechanics
                    </button>

                    <button
                        onClick={() => setActiveTab('installation')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === 'installation'
                                ? 'bg-[#F27E24] text-white shadow-[0_0_15px_rgba(242,126,36,0.5)]'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                        <Sliders className="w-4 h-4" /> Height & Shim Installation
                    </button>

                    <button
                        onClick={() => setActiveTab('compatibility')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === 'compatibility'
                                ? 'bg-[#F27E24] text-white shadow-[0_0_15px_rgba(242,126,36,0.5)]'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                        <Layers className="w-4 h-4" /> Appliance & Floor Fit
                    </button>

                    <button
                        onClick={() => setActiveTab('box')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === 'box'
                                ? 'bg-[#F27E24] text-white shadow-[0_0_15px_rgba(242,126,36,0.5)]'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Box Contents
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'mechanics' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-white font-heading">High-Damping Elastomer Polymer Engineering</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Ordinary rubber pads flatten over time under high-load spin cycles. GroundEra Anti-Vibration Pads are molded from a proprietary high-density cross-linked polymer compound rated to withstand up to 800 lbs per 4-pad set without permanent deformation.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-1">
                                    <h4 className="text-sm font-bold text-white">99.4% Kinetic Absorption</h4>
                                    <p className="text-xs text-slate-400">Neutralizes high-frequency structural vibration before it transfers into joists and floorboards.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#050507] border border-white/10 space-y-1">
                                    <h4 className="text-sm font-bold text-white">Honeycomb Vacuum Tread</h4>
                                    <p className="text-xs text-slate-400">Micro-suction tread pattern prevents appliance walking on smooth tile, laminate, or hardwood.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'installation' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-white font-heading">Stackable Modular Height Adjustment</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Uneven floor surfaces cause washing machines to rock and walk during high-speed spin cycles. GroundEra pads interlock together for customizable height correction, paired with fine-tuning leveling shims and a spirit level.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                                <li>Lift each appliance foot and slide the GroundEra pad underneath.</li>
                                <li>Stack multiple pads together for elevated drainage or leveling on sloped floors.</li>
                                <li>Use the included precision shim to eliminate sub-millimeter wobble.</li>
                                <li>Verify level positioning with the included keychain spirit level tool.</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'compatibility' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-white font-heading">Universal Fit Across Residential & Commercial Equipment</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Universal recess cup fits standard appliance feet up to 1.85 inches in diameter.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
                                <div className="p-3 rounded-xl bg-[#050507] border border-white/10 text-white font-bold">Front-Load Washers</div>
                                <div className="p-3 rounded-xl bg-[#050507] border border-white/10 text-white font-bold">Top-Load Washers</div>
                                <div className="p-3 rounded-xl bg-[#050507] border border-white/10 text-white font-bold">Tumble Dryers</div>
                                <div className="p-3 rounded-xl bg-[#050507] border border-white/10 text-white font-bold">Commercial Treadmills</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'box' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-white font-heading">What's Included in the Package</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {(currentProduct.box_contents || FALLBACK_FLAGSHIP_PRODUCT.box_contents).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#050507] border border-white/10 text-xs text-slate-200 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-[#F27E24] shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Technical Datasheet Table */}
            <TechSpecsTable product={currentProduct} />

            {/* OEM Inquiry Lead Form */}
            <div id="inquiry-form-section">
                <InquiryForm productId={currentProduct._id || '66a87f12bc09a123456789ab'} productName={currentProduct.name} />
            </div>
        </div>
    );
}
