import React, { useRef, useEffect, useState } from 'react';

// Simple fade-in-up on scroll
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
}

export default function AcousticFeatures({ product }) {
    const cdnAngle = product?.images?.[1] || "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_angle.png";
    const cdnBanner = product?.images?.[3] || "https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_1200/shopground/products/apex_pro_banner1.png";

    const [headerRef, headerVisible] = useReveal();
    const [card1Ref, card1Visible] = useReveal();
    const [card2Ref, card2Visible] = useReveal();
    const [card3Ref, card3Visible] = useReveal();

    return (
        <section id="gallery-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">

            {/* ─── SECTION HEADER ─── */}
            <div
                ref={headerRef}
                className={`text-center space-y-4 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#F27E24]">
                    What's Inside
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-heading leading-[1]">
                    Built to Last.<br />
                    <span className="text-[#F27E24]">Engineered to Silence.</span>
                </h2>
                <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                    Every pad is precision-molded from industrial elastomer rubber and tested to absorb motor spin vibration before it hits your floor.
                </p>
            </div>

            {/* ─── BENTO GRID ─── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* CARD 1 — BIG IMAGE, stacks left (7 cols) */}
                <div
                    ref={card1Ref}
                    className={`md:col-span-7 group relative rounded-3xl overflow-hidden bg-[#0C0C12] border border-white/10 min-h-[460px] transition-all duration-700 ${card1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                >
                    {/* Photo fills the entire card */}
                    <img
                        src={cdnAngle}
                        alt="Honeycomb grip surface"
                        className="absolute inset-0 w-full h-full object-contain p-10 group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient overlay from bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#050507] via-[#050507]/70 to-transparent" />

                    {/* Content sits bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-7 space-y-3">
                        <div className="inline-block bg-[#F27E24] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                            Micro-Honeycomb Surface
                        </div>
                        <h3 className="text-2xl font-black text-white font-heading leading-tight">
                            Grips the floor.<br />Never walks again.
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                            Thousands of microscopic vacuum cups form an active seal against tile, hardwood, and concrete — stopping machine walk completely.
                        </p>
                        <div className="flex gap-4 pt-1 text-xs font-bold text-slate-300">
                            <span className="text-[#F27E24] font-black">99.4%</span> vibration reduction ·
                            <span className="text-[#F27E24] font-black">800 LB</span> load rated
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (5 cols) — two stacked cards */}
                <div className="md:col-span-5 flex flex-col gap-4">

                    {/* CARD 2 — Stackable Leveling */}
                    <div
                        ref={card2Ref}
                        className={`group relative rounded-3xl overflow-hidden bg-[#0C0C12] border border-white/10 flex-1 min-h-[210px] transition-all duration-700 delay-150 ${card2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        <img
                            src={cdnBanner}
                            alt="Stackable leveling shims"
                            className="absolute inset-0 w-full h-full object-contain p-8 group-hover:scale-108 transition-transform duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#F27E24]">Stackable Design</span>
                            <h3 className="text-base font-black text-white font-heading">Leveling shims included</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Interlock pads to custom heights. Bubble level tool packed in the box.</p>
                        </div>
                    </div>

                    {/* CARD 3 — Pure stat call-out, no image, typographic */}
                    <div
                        ref={card3Ref}
                        className={`group relative rounded-3xl bg-gradient-to-br from-[#F27E24] to-[#C95B0C] p-7 flex flex-col justify-between min-h-[210px] transition-all duration-700 delay-300 overflow-hidden ${card3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    >
                        {/* Decorative blob */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                        <div>
                            <span className="text-orange-200 text-[10px] font-black uppercase tracking-widest">Load Capacity</span>
                            <div className="text-6xl font-black text-white leading-none mt-1 tracking-[-0.04em]">
                                800<span className="text-3xl font-black text-orange-200"> LB</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white font-black text-sm font-heading">Per 4-pad set.</p>
                            <p className="text-orange-200 text-xs leading-relaxed">Supports front-loaders, top-loaders, dryers, treadmills & commercial HVAC units.</p>
                        </div>

                        {/* Bottom checklist */}
                        <div className="flex flex-col gap-1 pt-2 border-t border-white/20">
                            {['Washers & Dryers', 'Gym Treadmills', 'Commercial HVAC'].map((item, i) => (
                                <span key={i} className="text-[11px] font-bold text-orange-100 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-white/60" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ─── BOTTOM STRIP: THREE TEXT CALLOUTS ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/10">
                {[
                    { n: '01', title: 'No Tools Required', body: 'Just slide under each appliance foot. Takes under 2 minutes per machine.' },
                    { n: '02', title: 'Works on Any Floor', body: 'Tile, hardwood, concrete, vinyl, laminate — the grip adapts to the surface.' },
                    { n: '03', title: 'Silent from Day One', body: 'The first spin cycle will feel completely different. No thumps, no movement.' },
                ].map((item) => (
                    <div key={item.n} className="bg-[#0C0C12] px-7 py-8 space-y-2 group hover:bg-[#0F0F18] transition-colors">
                        <span className="text-[10px] font-black text-[#F27E24] tracking-[0.3em] uppercase font-mono">{item.n}</span>
                        <h4 className="text-base font-black text-white font-heading">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
                    </div>
                ))}
            </div>

        </section>
    );
}
