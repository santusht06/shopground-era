import React, { useEffect, useState, useMemo, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/apiClient';
import { ArrowRight, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSkeleton } from '@/components/ui/skeleton';
import { AmazonHeroButton } from '@/components/ui/AmazonBuyButton';

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
    const timeoutRef = useRef(null);

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
        return () => {
            isMounted = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const slides = useMemo(() => {
        return product?.images?.length
            ? product.images.map((url, i) => ({ ...FALLBACK_SLIDES[i] || FALLBACK_SLIDES[0], url }))
            : FALLBACK_SLIDES;
    }, [product?.images]);

    const goTo = useCallback((indexFn) => {
        setTransitioning(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setActiveSlideIndex(typeof indexFn === 'function' ? indexFn : () => indexFn);
            setTransitioning(false);
        }, 220);
    }, []);

    // Auto-advance carousel with memory-safe interval
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
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] text-xs font-black tracking-wider uppercase">
                                    <span className="w-2 h-2 rounded-full bg-[#F27E24] animate-pulse" />
                                    <span>INDUSTRIAL HEAVY-DUTY ISOLATOR</span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-heading leading-tight">
                                    {product?.name || "GroundEra Anti-Vibration Pads"}
                                </h1>
                                <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                                    {product?.description || "Heavy-duty anti-vibration pads featuring an innovative stackable design, high-traction honeycomb grip texture, 800 lb load rating, and precision leveling shims."}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3 border-y border-white/10 py-5 my-2">
                                <div>
                                    <span className="text-xl sm:text-2xl font-black text-white font-mono block">800 LBS</span>
                                    <span className="text-[11px] text-slate-400 font-medium">Load Rating</span>
                                </div>
                                <div className="border-x border-white/10 px-3">
                                    <span className="text-xl sm:text-2xl font-black text-[#F27E24] font-mono block">99.4%</span>
                                    <span className="text-[11px] text-slate-400 font-medium">Vibration Damping</span>
                                </div>
                                <div className="pl-3">
                                    <span className="text-xl sm:text-2xl font-black text-white font-mono block">48 HRS</span>
                                    <span className="text-[11px] text-slate-400 font-medium">Factory Express</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <AmazonHeroButton />

                                <Button
                                    onClick={handleInquire}
                                    className="gradient-btn-orange font-black text-sm h-13 px-7 rounded-xl gap-2 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    Get OEM Quote
                                </Button>
                                <Button
                                    onClick={handleDetail}
                                    variant="ghost"
                                    className="text-slate-300 hover:text-white text-sm font-bold h-13 px-4 gap-2 cursor-pointer"
                                >
                                    Full Specs
                                    <ArrowRight className="w-4 h-4 text-[#F27E24]" />
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT: INTERACTIVE CAROUSEL DISPLAY */}
                        <div className="relative flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-[#12121B] to-[#0A0A10]">
                            <div className="flex items-center justify-between z-10">
                                <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-[11px] font-bold text-[#F27E24] tracking-widest uppercase">
                                    {currentSlide.tag}
                                </span>
                                <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => goTo(i)}
                                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                                i === activeSlideIndex ? 'w-6 bg-[#F27E24]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                                            }`}
                                            aria-label={`Slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="relative my-auto py-8 flex items-center justify-center min-h-[300px]">
                                <img
                                    src={currentSlide.url}
                                    alt={currentSlide.caption}
                                    className={`max-h-[340px] w-auto object-contain transition-all duration-300 transform ${
                                        transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                                    }`}
                                />
                            </div>

                            <div className="flex items-center justify-between z-10 border-t border-white/10 pt-4 mt-2">
                                <div>
                                    <span className="text-xs text-slate-400 block font-medium">Model Visualization</span>
                                    <span className="text-sm font-bold text-white">{currentSlide.caption}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => goTo((prev) => (prev - 1 + slides.length) % slides.length)}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-[#F27E24] hover:border-transparent text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                        aria-label="Previous Slide"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => goTo((prev) => (prev + 1) % slides.length)}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-[#F27E24] hover:border-transparent text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                        aria-label="Next Slide"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default HeroBanner;
