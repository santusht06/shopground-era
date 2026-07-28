import React, { useEffect, useRef, useState } from 'react';

// Animated counting number hook
function useCountUp(target, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

const stats = [
    { value: 800, suffix: ' LB', label: 'Max Load Capacity', sub: 'Per 4-pad installation set' },
    { value: 99, suffix: '.4%', label: 'Vibration Damping', sub: 'Lab certified reduction rate' },
    { value: 3, suffix: ' IN', label: 'Height Adjustment', sub: 'Stackable modular interlock system' },
    { value: 2, suffix: '-Year', label: 'Direct Warranty', sub: 'Full factory replacement policy' },
];

const marqueeItems = [
    '⚡ 800 LB LOAD RATING',
    '🏭 GLOBAL OEM DISTRIBUTION',
    '🔇 99.4% VIBRATION DAMPING',
    '📦 24–48H EXPRESS DISPATCH',
    '🔧 STACKABLE LEVELING SHIMS',
    '🌍 SHIPS TO 40+ COUNTRIES',
    '🛡️ ISO FACTORY CERTIFIED',
];

export default function BrandStrip() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">

            {/* ANIMATED STAT COUNTERS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
                {stats.map((stat, i) => (
                    <StatCard key={i} stat={stat} visible={visible} delay={i * 150} />
                ))}
            </div>

            {/* SCROLLING MARQUEE TICKER */}
            <div className="overflow-hidden rounded-2xl bg-[#F27E24] py-3 relative">
                <div className="flex animate-marquee whitespace-nowrap gap-0 will-change-transform">
                    {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span key={i} className="inline-flex items-center text-white font-black text-xs tracking-widest uppercase px-8">
                            {item}
                            <span className="ml-8 text-white/40">|</span>
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .animate-marquee {
                    animation: marquee 28s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}

function StatCard({ stat, visible, delay }) {
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (visible) {
            const t = setTimeout(() => setStarted(true), delay);
            return () => clearTimeout(t);
        }
    }, [visible, delay]);

    const count = useCountUp(stat.value, 1600, started);
    const isDecimal = stat.suffix.startsWith('.');

    return (
        <div className="bg-[#0C0C12] px-6 py-8 flex flex-col gap-1 group hover:bg-[#0F0F18] transition-colors duration-300 relative overflow-hidden">
            {/* Ambient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F27E24]/0 to-[#F27E24]/0 group-hover:from-[#F27E24]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

            <div className="relative">
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-heading leading-none">
                    {started ? count.toLocaleString() : '0'}
                    <span className="text-[#F27E24]">{stat.suffix}</span>
                </div>
                <div className="text-xs font-black text-white uppercase tracking-widest mt-3 font-heading">
                    {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {stat.sub}
                </div>
            </div>

            {/* Bottom orange accent bar */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#F27E24] group-hover:w-full transition-all duration-500 ease-out" />
        </div>
    );
}
