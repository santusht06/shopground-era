import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedCategory } from '@/store/slices/productsSlice';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CategoryGridCards() {
    const dispatch = useDispatch();

    const handleCategoryClick = (category) => {
        dispatch(setSelectedCategory(category));
        const catalogEl = document.getElementById('product-catalog');
        catalogEl?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Amazon Card 1: Electronics */}
                <Card className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs">
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3">Top Deals in Electronics</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div onClick={() => handleCategoryClick('Electronics')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" alt="Headphones" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Headphones</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$249.99</span>
                            </div>
                            <div onClick={() => handleCategoryClick('Electronics')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80" alt="Keyboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Keyboards</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$135.50</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCategoryClick('Electronics')}
                        className="text-xs font-bold text-[#5E6AD2] hover:underline flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                    >
                        <span>Explore All Electronics</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </Card>

                {/* Amazon Card 2: Workspace */}
                <Card className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs">
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3">Upgrade Your Living & Office</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div onClick={() => handleCategoryClick('Furniture')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1580481072645-022f9a6d85d5?auto=format&fit=crop&w=300&q=80" alt="Chair" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Ergo Chairs</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$450.00</span>
                            </div>
                            <div onClick={() => handleCategoryClick('Home & Kitchen')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80" alt="Coffee Set" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Coffee Sets</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$45.00</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCategoryClick('Furniture')}
                        className="text-xs font-bold text-[#5E6AD2] hover:underline flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                    >
                        <span>Explore Home & Furniture</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </Card>

                {/* Amazon Card 3: Fashion */}
                <Card className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs">
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3">Trending Fashion & Travel</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div onClick={() => handleCategoryClick('Fashion')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80" alt="Duffel Bag" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Travel Bags</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$98.00</span>
                            </div>
                            <div onClick={() => handleCategoryClick('Fashion')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=300&q=80" alt="Sweater" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Merino Wool</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$110.00</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCategoryClick('Fashion')}
                        className="text-xs font-bold text-[#5E6AD2] hover:underline flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                    >
                        <span>Explore Fashion Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </Card>

                {/* Amazon Card 4: Accessories */}
                <Card className="bg-white border-[#E5E7EB] p-5 space-y-4 glimmer-card flex flex-col justify-between shadow-xs">
                    <div>
                        <h3 className="text-base font-extrabold text-[#0F172A] mb-3">Premium Timepieces</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div onClick={() => handleCategoryClick('Accessories')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" alt="Watch" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Chronographs</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$189.00</span>
                            </div>
                            <div onClick={() => handleCategoryClick('Electronics')} className="cursor-pointer group">
                                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-1">
                                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" alt="Projector" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 block line-clamp-1">Projectors</span>
                                <span className="text-[10px] text-[#5E6AD2] font-semibold">$320.00</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCategoryClick('Accessories')}
                        className="text-xs font-bold text-[#5E6AD2] hover:underline flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                    >
                        <span>Explore Premium Accessories</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </Card>

            </div>
        </section>
    );
}
