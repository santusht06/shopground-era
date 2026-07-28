import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/authSlice';
import {
    Star,
    ShoppingBag,
    CheckCircle,
    ArrowLeft,
    Truck,
    Shield,
    RotateCcw,
    Share2,
    Check,
    ChevronRight,
    Heart,
    Flame,
    FileText,
    MessageSquare,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ecommerce/ProductCard';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.items);
    const wishlist = useSelector((state) => state.auth.wishlist);

    const product = products.find((p) => p.id === id) || products[0];
    const isWishlisted = wishlist.some((item) => item?.id === product?.id);

    const galleryImages = product.images && product.images.length > 0 ? product.images : [
        '/images/product/main.png',
        '/images/product/angle.png',
        '/images/product/feature.png',
        '/images/product/banner1.png',
        '/images/product/banner2.png'
    ];

    const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
    const [quantity, setQuantity] = useState(1);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (galleryImages && galleryImages.length > 0) {
            setSelectedImage(galleryImages[0]);
        }
    }, [id]);

    if (!product) return null;

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2000);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            
            {/* Breadcrumb Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                    <Link to="/" className="hover:text-[#5E6AD2] font-medium transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <Link to="/" className="hover:text-[#5E6AD2] font-medium transition-colors">
                        {product.category}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
                        {product.name}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => dispatch(toggleWishlist(product))}
                        variant="outline"
                        size="sm"
                        className={`text-xs gap-1.5 border-[#E5E7EB] bg-white ${isWishlisted ? 'text-rose-500' : 'text-slate-700'}`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                        <span>{isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
                    </Button>

                    <Button
                        onClick={handleShare}
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 border-[#E5E7EB] bg-white text-slate-700 hover:bg-[#F4F5F8]"
                    >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Link Copied!' : 'Share Page'}</span>
                    </Button>
                </div>
            </div>

            {/* Main Product Display Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Column: Multi-Angle High-Res Gallery */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-4/3 bg-slate-900/5 rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden group">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <Badge className="bg-[#5E6AD2] text-white text-xs font-extrabold uppercase tracking-wider">
                                Amazon ASIN: B0H915VTB1
                            </Badge>
                            {product.originalPrice > product.price && (
                                <Badge variant="success" className="text-xs font-extrabold uppercase tracking-wider">
                                    Save ${(product.originalPrice - product.price).toFixed(0)}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Image Thumbnails Carousel */}
                    <div className="grid grid-cols-5 gap-3">
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`relative aspect-square rounded-xl border-2 overflow-hidden bg-white p-1 transition-all cursor-pointer ${
                                    selectedImage === img ? 'border-[#5E6AD2] ring-2 ring-[#5E6AD2]/20 scale-105' : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Buy Box & Product Info */}
                <div className="lg:col-span-5 space-y-6">
                    <div>
                        <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-xs mb-2">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400 font-normal">({product.reviewsCount} verified customer reviews)</span>
                        </div>
                        
                        <h1 className="text-3xl font-extrabold text-[#0F172A] leading-tight tracking-tight font-heading">
                            {product.name}
                        </h1>

                        <p className="text-sm font-semibold text-[#5E6AD2] mt-1">{product.subtitle}</p>
                    </div>

                    {/* Price Card & Stock Urgency */}
                    <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">Special Online Price</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-[#0F172A]">${product.price.toFixed(2)}</span>
                                    {product.originalPrice > product.price && (
                                        <span className="text-sm text-slate-400 line-through font-medium">${product.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-xs px-2.5 py-1 font-bold">
                                In Stock ({product.stock} units)
                            </Badge>
                        </div>
                    </div>

                    {/* Actions & Quantity Selector */}
                    <div className="border-t border-[#E5E7EB] pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-white h-11">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3.5 py-1 text-base font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3.5 py-1 text-base font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="gradient-btn-primary font-bold text-sm h-11 flex-1 rounded-xl gap-2 cursor-pointer shadow-md"
                            >
                                {addedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
                                <span>{addedSuccess ? 'Added to Cart!' : 'Add to Shopping Cart'}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-slate-600 font-medium border-t border-[#E5E7EB]">
                        <div className="p-2 rounded-xl bg-[#FAFAFC] border border-slate-100 flex flex-col items-center gap-1">
                            <Truck className="w-4 h-4 text-[#5E6AD2]" />
                            <span>Express Delivery</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#FAFAFC] border border-slate-100 flex flex-col items-center gap-1">
                            <Shield className="w-4 h-4 text-[#5E6AD2]" />
                            <span>1 Year Warranty</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#FAFAFC] border border-slate-100 flex flex-col items-center gap-1">
                            <RotateCcw className="w-4 h-4 text-[#5E6AD2]" />
                            <span>30 Days Return</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Specifications & Features Tabs */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex border-b border-slate-200 gap-6 text-sm font-bold text-slate-500">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'overview' ? 'border-[#5E6AD2] text-[#5E6AD2]' : 'border-transparent hover:text-slate-800'
                        }`}
                    >
                        Product Description & Features
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'specs' ? 'border-[#5E6AD2] text-[#5E6AD2]' : 'border-transparent hover:text-slate-800'
                        }`}
                    >
                        Technical Specifications
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                        <p>{product.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {product.specs?.map((spec, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-800">
                                    <Zap className="w-4 h-4 text-[#5E6AD2]" />
                                    <span>{spec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'specs' && (
                    <table className="w-full text-xs text-left text-slate-600">
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="py-2.5 font-bold text-slate-900 w-1/3">Amazon ASIN</td>
                                <td className="py-2.5 font-mono text-[#5E6AD2]">B0H915VTB1</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 font-bold text-slate-900">Active Noise Cancellation</td>
                                <td className="py-2.5">Hybrid Active ANC (up to 38dB reduction)</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 font-bold text-slate-900">Battery Playtime</td>
                                <td className="py-2.5">30 Hours (ANC On) / 45 Hours (ANC Off)</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 font-bold text-slate-900">Connectivity</td>
                                <td className="py-2.5">Bluetooth 5.3 + 3.5mm Aux Cable</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}
