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

    const product = products.find((p) => p.id === id);
    const isWishlisted = wishlist.some((item) => item?.id === product?.id);

    const [quantity, setQuantity] = useState(1);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'reviews' | 'shipping'

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
                <h2 className="text-2xl font-bold text-[#0F172A]">Product Not Found</h2>
                <p className="text-sm text-slate-500">The product with ID "{id}" could not be located in our catalog.</p>
                <Button onClick={() => navigate('/')} className="bg-[#5E6AD2] text-white">
                    Return to Store Front
                </Button>
            </div>
        );
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

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
                
                {/* Left Column: Image Viewer */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-4/3 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden group">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.isNew && (
                                <Badge className="bg-[#5E6AD2] text-white text-xs font-extrabold uppercase tracking-wider">
                                    Flagship Release
                                </Badge>
                            )}
                            {product.originalPrice > product.price && (
                                <Badge variant="success" className="text-xs font-extrabold uppercase tracking-wider">
                                    Save ${(product.originalPrice - product.price).toFixed(0)}
                                </Badge>
                            )}
                        </div>
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
                        
                        <h1 className="text-3xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
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

                        {/* Stock Urgency Bar */}
                        {product.stock <= 10 && (
                            <div className="pt-2 border-t border-slate-100 space-y-1">
                                <div className="flex justify-between text-xs text-amber-700 font-bold">
                                    <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Low Stock Alert</span>
                                    <span>Only {product.stock} items left!</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(product.stock / 20) * 100}%` }} />
                                </div>
                            </div>
                        )}
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
                                className="flex-1 bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white font-extrabold text-sm h-11 rounded-lg gap-2 shadow-sm cursor-pointer"
                            >
                                {addedSuccess ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-emerald-300" />
                                        <span>Added to Bag!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Add to Bag — ${(product.price * quantity).toFixed(2)}</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 text-xs text-slate-500 pt-3 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-[#5E6AD2]" />
                                <span>Free Dispatch</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#5E6AD2]" />
                                <span>2-Year Warranty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 text-[#5E6AD2]" />
                                <span>30-Day Returns</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* TABBED DETAILS & SPECIFICATIONS SECTION */}
            <div className="border-t border-[#E5E7EB] pt-10 space-y-6">
                <div className="flex items-center gap-2 border-b border-[#E5E7EB]">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'overview'
                                ? 'border-[#5E6AD2] text-[#5E6AD2]'
                                : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Overview & Features
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'specs'
                                ? 'border-[#5E6AD2] text-[#5E6AD2]'
                                : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Technical Specifications
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'reviews'
                                ? 'border-[#5E6AD2] text-[#5E6AD2]'
                                : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Customer Reviews ({product.reviewsCount})
                    </button>
                </div>

                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                    <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
                        <h3 className="text-base font-bold text-[#0F172A]">Detailed Overview</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                    </div>
                )}

                {/* Tab 2: Tech Specs */}
                {activeTab === 'specs' && (
                    <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
                        <h3 className="text-base font-bold text-[#0F172A]">Specifications Table</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                            {product.specs?.map((spec, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-[#F4F5F8] rounded-xl border border-[#E5E7EB]">
                                    <span className="font-semibold text-slate-500">Spec #{idx + 1}</span>
                                    <span className="font-bold text-slate-900">{spec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 3: Customer Reviews */}
                {activeTab === 'reviews' && (
                    <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                            <div className="text-center px-4">
                                <span className="text-4xl font-extrabold text-[#0F172A]">{product.rating}</span>
                                <span className="text-xs text-slate-400 block font-medium">out of 5.0</span>
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                    <span>5 Stars</span>
                                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-amber-400 h-full w-[90%]" />
                                    </div>
                                    <span className="text-slate-400 font-mono">90%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Related Products Carousel Grid */}
            {relatedProducts.length > 0 && (
                <div className="border-t border-[#E5E7EB] pt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#0F172A]">Related Items in {product.category}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((rel) => (
                            <ProductCard key={rel.id} product={rel} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
