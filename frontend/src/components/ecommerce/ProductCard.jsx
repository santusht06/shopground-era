import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { setSelectedProduct } from '@/store/slices/productsSlice';
import { toggleWishlist } from '@/store/slices/authSlice';
import { Star, ShoppingBag, Eye, Heart, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const wishlist = useSelector((state) => state.auth.wishlist);
    const isWishlisted = wishlist.some((item) => item.id === product.id);

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        dispatch(toggleWishlist(product));
    };

    return (
        <Card className="group relative bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden glimmer-card flex flex-col justify-between shadow-xs">
            <div>
                {/* Image Container -> Navigates to Product Page URL */}
                <div 
                    className="relative aspect-4/3 overflow-hidden bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Right Wishlist Heart Toggle Button */}
                    <button
                        onClick={handleWishlistClick}
                        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:scale-110 transition-all shadow-xs"
                    >
                        <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    
                    {/* Top Left Badges Overlay */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {product.isNew && (
                            <Badge variant="default" className="bg-[#5E6AD2] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 shadow-xs">
                                New Arrival
                            </Badge>
                        )}
                        {product.originalPrice > product.price && (
                            <Badge variant="success" className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 shadow-xs">
                                Save ${(product.originalPrice - product.price).toFixed(0)}
                            </Badge>
                        )}
                    </div>

                    {/* Hover Quick View Overlay */}
                    <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch(setSelectedProduct(product));
                            }}
                            className="bg-white/95 text-slate-900 hover:bg-white text-xs font-bold shadow-lg gap-1.5 backdrop-blur-md"
                        >
                            <Eye className="w-3.5 h-3.5 text-[#5E6AD2]" />
                            Quick View
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span className="font-semibold text-slate-500">{product.category}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                        </div>
                    </div>

                    <Link 
                        to={`/product/${product.id}`}
                        className="font-bold text-[#0F172A] text-base leading-tight hover:text-[#5E6AD2] transition-colors line-clamp-1 block"
                    >
                        {product.name}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                        {product.subtitle || product.description}
                    </p>
                </div>
            </div>

            {/* Footer with Price, Low Stock Urgency, and Add Button */}
            <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-[#0F172A]">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through font-medium">
                                ${product.originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    
                    {product.stock <= 10 ? (
                        <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-amber-500" /> Low Stock ({product.stock})
                        </span>
                    ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">In Stock</span>
                    )}
                </div>

                <Button
                    size="sm"
                    onClick={() => dispatch(addToCart(product))}
                    className="bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white text-xs font-bold px-3.5 py-1.5 gap-1.5 shadow-sm rounded-lg"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                </Button>
            </div>
        </Card>
    );
}
