import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { X, Star, ShoppingBag, CheckCircle, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailModal() {
    const dispatch = useDispatch();
    const product = useSelector((state) => state.products.selectedProduct);
    const [quantity, setQuantity] = useState(1);
    const [addedSuccess, setAddedSuccess] = useState(false);

    if (!product) return null;

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
                
                {/* Close Button */}
                <button
                    onClick={() => dispatch(setSelectedProduct(null))}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Left Image Section */}
                <div className="md:w-1/2 bg-slate-50 p-6 flex items-center justify-center relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto max-h-[350px] object-cover rounded-xl shadow-sm"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge variant="default" className="bg-[#5E6AD2] text-white text-xs">
                            {product.category}
                        </Badge>
                    </div>
                </div>

                {/* Right Details Section */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs mb-1">
                                <Star className="w-4 h-4 fill-amber-400" />
                                <span>{product.rating}</span>
                                <span className="text-slate-400 font-normal">({product.reviewsCount} customer reviews)</span>
                            </div>
                            <h2 className="text-2xl font-bold text-[#0F172A] leading-tight">{product.name}</h2>
                            <p className="text-xs text-[#5E6AD2] font-semibold mt-0.5">{product.subtitle}</p>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-[#0F172A]">${product.price.toFixed(2)}</span>
                            {product.originalPrice > product.price && (
                                <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>

                        {/* Specs List */}
                        {product.specs && (
                            <div className="border-t border-[#E5E7EB] pt-3">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Specifications</h4>
                                <ul className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
                                    {product.specs.map((spec, idx) => (
                                        <li key={idx} className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2]" />
                                            <span>{spec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Actions & Quantity */}
                    <div className="border-t border-[#E5E7EB] pt-4 mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-[#F4F5F8]">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-slate-900"
                                >
                                    -
                                </button>
                                <span className="px-3 text-sm font-semibold text-slate-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-slate-900"
                                >
                                    +
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white font-semibold text-sm gap-2 h-10 rounded-lg shadow-sm"
                            >
                                {addedSuccess ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                                        <span>Added to Bag!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Add to Cart — ${(product.price * quantity).toFixed(2)}</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Extra Trust Icons */}
                        <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-[#5E6AD2]" />
                                <span>Express Dispatch</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-[#5E6AD2]" />
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <RotateCcw className="w-3.5 h-3.5 text-[#5E6AD2]" />
                                <span>Free Returns</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
