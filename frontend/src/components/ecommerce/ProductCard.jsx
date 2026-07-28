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
        <Card className="group relative bg-[#0C0C12] border border-white/10 rounded-2xl overflow-hidden glimmer-card flex flex-col justify-between shadow-xl">
            <div>
                {/* Image Container -> Navigates to Product Page URL */}
                <div 
                    className="relative aspect-4/3 overflow-hidden bg-black/40 cursor-pointer p-4"
                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Right Wishlist Heart Toggle Button */}
                    <button
                        onClick={handleWishlistClick}
                        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-black/70 border border-white/10 text-slate-400 hover:text-rose-500 hover:scale-110 transition-all shadow-xs"
                    >
                        <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    
                    {/* Top Left Badges Overlay */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {(product.originalPrice || product.wholesale_mrp) > product.price && (
                            <Badge className="bg-[#F27E24] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 shadow-md">
                                Discount Active
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span className="font-semibold text-slate-400">{product.category || 'Hardware'}</span>
                    </div>

                    <Link 
                        to={`/product/${product._id || product.id}`}
                        className="font-black text-white text-base leading-tight hover:text-[#F27E24] transition-colors line-clamp-1 block font-heading"
                    >
                        {product.name}
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {product.subtitle || product.short_description || product.description}
                    </p>
                </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-white/10 mt-2">
                <div>
                    <span className="text-base font-black text-white font-mono">${product.price?.toFixed(2)}</span>
                    {(product.originalPrice || product.wholesale_mrp) > product.price && (
                        <span className="text-[11px] text-slate-500 line-through font-mono block">
                            ${(product.originalPrice || product.wholesale_mrp)?.toFixed(2)}
                        </span>
                    )}
                </div>
                <Button
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart(product));
                    }}
                    className="gradient-btn-orange font-bold text-white text-xs px-3.5 h-9 rounded-xl gap-1.5"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                </Button>
            </div>
        </Card>
    );
}
