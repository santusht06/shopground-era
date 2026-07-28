import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/apiClient';
import { ArrowRight, Send, ChevronLeft, ChevronRight, ShoppingBag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSkeleton } from '@/components/ui/skeleton';

const FALLBACK_SLIDES = [
    {
        url: "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_main.png",
        caption: "Frontal Acoustic Isolation",
        tag: "HERO EDITION",
    },
    {
        url: "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_angle.png",
        caption: "Honeycomb Grip Surface",
        tag: "MICRO-TEXTURE",
    },
    {
        url: "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_case.png",
        caption: "Stackable Leveling Assembly",
        tag: "MODULAR DESIGN",
    },
    {
        url: "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_banner1.png",
        caption: "Full Appliance Integration",
        tag: "800 LB RATED",
    },
];

const HeroBanner = memo(function HeroBanner() {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                const res = await apiClient.get('/products/66a87f12bc09a123456789ab');
                if (isMounted) setProduct(res.data);
            } catch (err) {
                console.error('HeroBanner: failed to load product', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => { isMounted = false; };
    }, []);

    const slides = useMemo(() => {
        return product?.images?.length
            ? product.images.map((url, i) => ({ ...FALLBACK_SLIDES[i] || FALLBACK_SLIDES[0], url }))
            : FALLBACK_SLIDES;
    }, [product?.images]);

    const goTo = useCallback((indexFn) => {
        setTransitioning(true);
        setTimeout(() => {
            setActiveSlideIndex(typeof indexFn === 'function' ? indexFn : () => indexFn);
            setTransitioning(false);
        }, 220);
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        const t = setInterval(() => goTo((prev) => (prev + 1) % slides.length), 5000);
        return () => clearInterval(t);
    }, [slides.length, goTo]);

    const handleInquire = useCallback(() => {
        document.getElementById('inquiry-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleDetail = useCallback(() => {
        navigate(`/product/${product?._id || '66a87f12bc09a123456789ab'}`);
    }, [navigate, product?._id]);

    if (loading) {
        return <HeroSkeleton />;
    }

    const currentSlide = slides[activeSlideIndex];

    return (
        <section id="product-overview" className="relative bg-[#050507] pt-4 pb-8 overflow-hidden">
            <div className="absolute inset-0 dot-mesh-bg opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="relative bg-[#0C0C12] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
                    <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#F27E24]/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#F5984A]/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[540px]">
                        {/* LEFT: COPY */}
                        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F27E24] bg-[#F27E24]/10 border border-[#F27E24]/25 px-4 py-1.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F27E24] animate-pulse" />
                                    New Release — 2026 Edition
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-[-0.03em] font-heading">
                                    {product?.name || 'GroundEra Anti-Vibration Pads'}
                                </h1>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-[#F27E24] to-transparent" />
                                    <span className="text-[#F27E24] text-xs font-black uppercase tracking-widest">
                                        {product?.brand || 'GroundEra'} Hardware
                                    </span>
                                </div>
                            </div>

                            <p className="text-base text-slate-300 leading-relaxed max-w-lg">
                                {product?.short_description || product?.long_description || 'Industrial elastomer pads that silence your washing machine and stop it from walking.'}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {['800 LB Rated', '99.4% Damping', 'Ships in 24h', '2-yr Warranty'].map((p, i) => (
                                    <span key={i} className="text-xs font-bold text-slate-200 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">
                                        ✓ {p}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    href="https://www.amazon.com/dp/B0H915VTB1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-slate-950 font-black text-sm h-13 px-7 rounded-xl transition-all cursor-pointer shadow-[0_0_25px_rgba(255,153,0,0.35)]"
                                >
                                    <ShoppingBag className="w-4 h-4 fill-slate-950" />
                                    <span>Buy on Amazon</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                                </a>

                                <Button
                                    onClick={handleInquire}
                                    className="gradient-btn-orange font-black text-sm h-13 px-7 rounded-xl gap-2 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    Get OEM Quote — ${product?.price || '249.99'}
                                </Button>
                                <Button
                                    onClick={handleDetail}
                                    variant="ghost"
                                    className="text-slate-300 hover:text-white text-sm font-bold h-13 px-4 gap-2 cursor-pointer"
                                >
                                    Specs
                                    <ArrowRight className="w-4 h-4 text-[#F27E24]" />
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT: PHOTO CAROUSEL */}
                        <div className="relative flex flex-col">
                            <div className="flex-1 relative overflow-hidden bg-black/40 min-h-[360px] lg:min-h-0">
                                <img
                                    src={currentSlide.url}
                                    alt={currentSlide.caption}
                                    className={`absolute inset-0 w-full h-full object-contain p-8 transition-all duration-500 ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                                />

                                <button
                                    onClick={() => goTo((p) => (p === 0 ? slides.length - 1 : p - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/15 text-white flex items-center justify-center hover:bg-[#F27E24] hover:border-[#F27E24] transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => goTo((p) => (p + 1) % slides.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/15 text-white flex items-center justify-center hover:bg-[#F27E24] hover:border-[#F27E24] transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                <div className="absolute top-4 right-4 bg-[#F27E24] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    {currentSlide.tag}
                                </div>

                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent pt-12 pb-4 px-5">
                                    <p className="text-sm font-bold text-white">{currentSlide.caption}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                        {activeSlideIndex + 1} / {slides.length}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 p-4 bg-black/50 border-t border-white/10">
                                {slides.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`flex-1 aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                            i === activeSlideIndex
                                                ? 'border-[#F27E24] shadow-[0_0_10px_rgba(242,126,36,0.5)]'
                                                : 'border-transparent opacity-50 hover:opacity-80'
                                        }`}
                                    >
                                        <img src={s.url} alt={s.caption} className="w-full h-full object-contain bg-black/60 p-1" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 border-t border-white/10 bg-black/40 px-8 sm:px-12 lg:px-16 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-6">
                            <span>SKU: <strong className="text-white">{product?.model_number || 'APEX-ANC-2026'}</strong></span>
                            <span className="hidden sm:inline">Category: <strong className="text-white">Anti-Vibration Hardware</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-[#F27E24] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#F27E24] animate-pulse" />
                            In Stock · 1,500+ units ready for dispatch
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default HeroBanner;
