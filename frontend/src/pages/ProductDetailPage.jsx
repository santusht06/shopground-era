import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import apiClient from '@/services/apiClient';
import InquiryForm from '@/components/ecommerce/InquiryForm';
import TechSpecsTable from '@/components/ecommerce/TechSpecsTable';
import { ProductDetailSkeleton } from '@/components/ui/skeleton';
import { AmazonCardButton } from '@/components/ui/AmazonBuyButton';
import {
    Star, Check, ChevronRight, Share2, Shield, Truck,
    RotateCcw, Zap, Headphones, Building, Send, Database, ExternalLink,
    ShoppingBag, Layers, VolumeX, CheckCircle2, Sliders, ArrowRight, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [copiedLink, setCopiedLink] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    // E-Commerce Quantity & Tab State
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('mechanics'); // 'mechanics' | 'installation' | 'compatibility' | 'reviews'
    const [addedFeedback, setAddedFeedback] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductData = async () => {
            setFetching(true);
            setError(null);
            try {
                // Fetch dynamically from MongoDB API by ID (e.g. 66a87f12bc09a123456789ab)
                const res = await apiClient.get(`/products/${id || '66a87f12bc09a123456789ab'}`);
                setProduct(res.data);
                if (res.data?.images?.length) {
                    setSelectedImage(res.data.images[0]);
                } else if (res.data?.image) {
                    setSelectedImage(res.data.image);
                }
            } catch (err) {
                console.error(`Failed to load product '${id}' from MongoDB:`, err);
                setError(err.response?.data?.detail || `Product ID '${id}' was not found in MongoDB database.`);
            } finally {
                setFetching(false);
            }
        };

        fetchProductData();
    }, [id]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleInquireScroll = () => {
        document.getElementById('inquiry-form-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAddToCart = () => {
        if (!product) return;
        const mongoId = product._id || product.id || '66a87f12bc09a123456789ab';
        dispatch(addToCart({
            id: mongoId,
            name: product.name,
            price: product.price || 249.99,
            quantity: quantity,
            image: selectedImage || product.image || "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png",
            category: 'Anti-Vibration Hardware',
        }));
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2500);
    };

    if (fetching) {
        return <ProductDetailSkeleton />;
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] flex items-center justify-center mx-auto">
                    <Database className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white font-heading">Product Not Found in Database</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto">{error || `No record found in MongoDB for ID "${id}".`}</p>
                <Button onClick={() => navigate('/')} className="gradient-btn-orange font-bold text-white">
                    Return to Main Portfolio
                </Button>
            </div>
        );
    }

    const galleryImages = product.images?.length ? product.images : [
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png",
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_angle.png",
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_case.png",
        "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_banner1.png"
    ];
    const mongoId = product._id || product.id || '66a87f12bc09a123456789ab';
    const originalPrice = product.originalPrice || product.original_price || product.wholesale_mrp || 299.99;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-[#050507] text-[#F8FAFC]">

            {/* Breadcrumb & Database Verification Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-4 gap-3">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                    <Link to="/" className="hover:text-[#F27E24] font-medium text-slate-300">All Products</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-bold text-white truncate max-w-xs">{product.name}</span>
                </div>

                <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 border-white/10 bg-[#0C0C12] text-slate-200 hover:border-white/20 h-8"
                >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#F27E24]" /> : <Share2 className="w-3.5 h-3.5 text-[#F27E24]" />}
                    {copiedLink ? 'Copied!' : 'Share'}
                </Button>
            </div>

            {/* Main Product Split Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* Left: Cloudinary High-Res Media Gallery */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-4/3 bg-[#0C0C12] rounded-3xl border border-white/10 overflow-hidden group shadow-2xl orange-glow-border">
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                            />
                        )}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <Badge className="bg-[#F27E24] text-white text-xs font-black uppercase tracking-wider shadow-lg">
                                Cloudinary CDN Media Verified
                            </Badge>
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {galleryImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
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
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight font-heading">
                            {product.name}
                        </h1>
                        <p className="text-sm font-bold text-[#F27E24] mt-1.5">{product.subtitle || "Heavy-Duty Acoustic Elastomer Anti-Vibration Pads"}</p>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                        {product.long_description || product.description || "Industrial-grade elastomer acoustic isolation engineered with high-traction honeycomb grips, stackable leveling shims, and an 800 LB load capacity."}
                    </p>

                    {/* Price & Stock Box */}
                    <div className="p-5 bg-[#0C0C12] border border-white/10 rounded-2xl shadow-xl space-y-3 orange-glow-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">Sample / Direct Order Price</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white font-mono">
                                        ${product.price?.toFixed(2)}
                                    </span>
                                    {originalPrice > product.price && (
                                        <span className="text-sm text-slate-500 line-through font-normal font-mono">
                                            ${originalPrice?.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Badge variant="outline" className="text-[#F27E24] bg-[#F27E24]/10 border-[#F27E24]/30 text-xs px-3 py-1 font-extrabold">
                                Stock: {product.stock || 1500} Units
                            </Badge>
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
                                    className="w-10 h-10 rounded-xl bg-black/60 text-white font-bold text-base hover:bg-[#F27E24] transition-colors cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center font-mono font-bold text-sm text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-xl bg-black/60 text-white font-bold text-base hover:bg-[#F27E24] transition-colors cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm h-12 rounded-2xl gap-2 cursor-pointer transition-all"
                            >
                                <ShoppingBag className="w-4 h-4 text-[#F27E24]" />
                                <span>{addedFeedback ? '✓ Added to Bag!' : 'Add to Inquiry Bag'}</span>
                            </Button>
                        </div>

                        <Button
                            onClick={handleInquireScroll}
                            className="gradient-btn-orange font-black text-sm h-13 rounded-2xl w-full gap-2 shadow-xl cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                            <span>Submit Direct Inquiry to Sales Representative</span>
                        </Button>
                        <p className="text-[11px] text-center text-slate-400">
                            Bulk OEM inquiries dispatch directly to <strong className="text-[#F27E24]">info@shopgroundera.com</strong>
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-slate-300 font-medium border-t border-white/10 pt-5">
                        <div className="p-3 rounded-2xl bg-[#0C0C12] border border-white/10 flex flex-col items-center gap-1.5">
                            <Truck className="w-4 h-4 text-[#F27E24]" />
                            <span>Express Shipping</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#0C0C12] border border-white/10 flex flex-col items-center gap-1.5">
                            <Shield className="w-4 h-4 text-[#F27E24]" />
                            <span>2 Year Warranty</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#0C0C12] border border-white/10 flex flex-col items-center gap-1.5">
                            <Building className="w-4 h-4 text-[#F27E24]" />
                            <span>OEM Support</span>
                        </div>
                    </div>
                </div>
            </div>

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
                        <Layers className="w-4 h-4" /> Stackable & Leveling Guide
                    </button>

                    <button
                        onClick={() => setActiveTab('compatibility')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === 'compatibility'
                                ? 'bg-[#F27E24] text-white shadow-[0_0_15px_rgba(242,126,36,0.5)]'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                        <Zap className="w-4 h-4" /> Universal Appliance Compatibility
                    </button>
                </div>

                {/* TAB 1: ACOUSTIC DAMPING MECHANICS */}
                {activeTab === 'mechanics' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                        <div className="bg-[#08080D] p-5 rounded-2xl border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F27E24]/10 text-[#F27E24] flex items-center justify-center font-bold">
                                <VolumeX className="w-5 h-5" />
                            </div>
                            <h4 className="text-base font-black text-white font-heading">High-Density Elastomer</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Formulated with industrial-grade thermoplastic rubber compound that dissipates low-frequency kinetic energy and motor vibration before it transfers to floor structures.
                            </p>
                        </div>

                        <div className="bg-[#08080D] p-5 rounded-2xl border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F27E24]/10 text-[#F27E24] flex items-center justify-center font-bold">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h4 className="text-base font-black text-white font-heading">Micro-Honeycomb Vacuum Grip</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Microscopic suction cups integrated into the bottom surface create an active vacuum seal against hardwood, tile, and concrete to stop appliance walking completely.
                            </p>
                        </div>

                        <div className="bg-[#08080D] p-5 rounded-2xl border border-white/10 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F27E24]/10 text-[#F27E24] flex items-center justify-center font-bold">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h4 className="text-base font-black text-white font-heading">800 LB Structural Limit</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Tested under extreme static compression to support up to 800 lbs across a 4-pad set without permanent deformation or cracking.
                            </p>
                        </div>
                    </div>
                )}

                {/* TAB 2: STACKABLE & LEVELING GUIDE */}
                {activeTab === 'installation' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <h3 className="text-lg font-black text-white font-heading">4-Step Precision Leveling Procedure</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#08080D] p-4 rounded-2xl border border-white/10 space-y-2">
                                <span className="text-xs font-mono font-bold text-[#F27E24]">STEP 01</span>
                                <h4 className="text-xs font-bold text-white">Clean Contact Surface</h4>
                                <p className="text-[11px] text-slate-400">Wipe clean dirt or moisture underneath appliance feet for maximum traction.</p>
                            </div>
                            <div className="bg-[#08080D] p-4 rounded-2xl border border-white/10 space-y-2">
                                <span className="text-xs font-mono font-bold text-[#F27E24]">STEP 02</span>
                                <h4 className="text-xs font-bold text-white">Position Main Elastomer Pad</h4>
                                <p className="text-[11px] text-slate-400">Slide each anti-vibration pad under all 4 corners of the washing machine or equipment.</p>
                            </div>
                            <div className="bg-[#08080D] p-4 rounded-2xl border border-white/10 space-y-2">
                                <span className="text-xs font-mono font-bold text-[#F27E24]">STEP 03</span>
                                <h4 className="text-xs font-bold text-white">Insert Modular Leveling Shim</h4>
                                <p className="text-[11px] text-slate-400">If the floor slope is uneven, interlock modular leveling shims to raise specific corners.</p>
                            </div>
                            <div className="bg-[#08080D] p-4 rounded-2xl border border-white/10 space-y-2">
                                <span className="text-xs font-mono font-bold text-[#F27E24]">STEP 04</span>
                                <h4 className="text-xs font-bold text-white">Verify Spirit Level Tool</h4>
                                <p className="text-[11px] text-slate-400">Place included pocket bubble level on top of appliance to confirm zero wobble.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: UNIVERSAL COMPATIBILITY GRID */}
                {activeTab === 'compatibility' && (
                    <div className="overflow-x-auto animate-in fade-in duration-300">
                        <table className="w-full text-xs text-left text-slate-300 border border-white/10 rounded-2xl overflow-hidden">
                            <thead className="bg-[#08080D] text-white font-heading uppercase text-[11px]">
                                <tr>
                                    <th className="py-3 px-4">Appliance / Equipment</th>
                                    <th className="py-3 px-4">Load Capacity</th>
                                    <th className="py-3 px-4">Walking Damping</th>
                                    <th className="py-3 px-4">Floor Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                <tr className="bg-[#111116]">
                                    <td className="py-3 px-4 font-bold text-white">Front-Load & Top-Load Washers</td>
                                    <td className="py-3 px-4">Up to 800 LBS</td>
                                    <td className="py-3 px-4 text-[#F27E24] font-bold">99.4% Reduction</td>
                                    <td className="py-3 px-4">Tile, Hardwood, Concrete</td>
                                </tr>
                                <tr className="bg-[#08080D]">
                                    <td className="py-3 px-4 font-bold text-white">Heavy-Duty Clothes Dryers</td>
                                    <td className="py-3 px-4">Up to 600 LBS</td>
                                    <td className="py-3 px-4 text-[#F27E24] font-bold">98.9% Reduction</td>
                                    <td className="py-3 px-4">Laminate, Tile, Vinyl</td>
                                </tr>
                                <tr className="bg-[#111116]">
                                    <td className="py-3 px-4 font-bold text-white">Fitness Treadmills & Gym Racks</td>
                                    <td className="py-3 px-4">Up to 850 LBS</td>
                                    <td className="py-3 px-4 text-[#F27E24] font-bold">97.5% Impact Noise Absorbed</td>
                                    <td className="py-3 px-4">Rubber, Wood, Tile</td>
                                </tr>
                                <tr className="bg-[#08080D]">
                                    <td className="py-3 px-4 font-bold text-white">Commercial HVAC & Subwoofers</td>
                                    <td className="py-3 px-4">Up to 800 LBS</td>
                                    <td className="py-3 px-4 text-[#F27E24] font-bold">Low-Frequency Isolation</td>
                                    <td className="py-3 px-4">All Surfaces</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {/* Amazon-Grade Technical Datasheet */}
            <TechSpecsTable product={product} />

            {/* Employee Inquiry Form */}
            <InquiryForm productId={mongoId} productName={product.name} />

        </div>
    );
}
