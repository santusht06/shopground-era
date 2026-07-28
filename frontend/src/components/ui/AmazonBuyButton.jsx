import React from 'react';

const AMAZON_URL = 'https://www.amazon.com/dp/B0H915VTB1';

const ExternalArrow = () => (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
);

// 1. NAVBAR PILL — compact amber outline pill
export function AmazonPill() {
    return (
        <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2.5 h-10 px-3.5 rounded-xl border border-[#FF9900]/40 bg-[#FF9900]/10 hover:bg-[#FF9900] transition-all duration-200 cursor-pointer group"
            aria-label="Buy on Amazon"
        >
            <img
                src="/amazon-logo.svg"
                alt="Amazon"
                className="h-4 w-auto brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-200"
            />
            <ExternalArrow />
        </a>
    );
}

// 2. HERO BUTTON — solid amber with white logo
export function AmazonHeroButton() {
    return (
        <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 h-13 px-7 rounded-xl bg-[#FF9900] hover:bg-[#E59400] active:bg-[#CC8400] transition-all duration-200 cursor-pointer shadow-[0_0_28px_rgba(255,153,0,0.45)] hover:shadow-[0_0_40px_rgba(255,153,0,0.65)] select-none"
            aria-label="Buy on Amazon"
        >
            {/* On amber bg, logo should be dark (#0F1111) — remove invert */}
            <img
                src="/amazon-logo.svg"
                alt="Amazon"
                className="h-5 w-auto brightness-0"
            />
            <span className="h-4 w-px bg-black/25" />
            <span className="font-black text-[#0F1111] text-xs uppercase tracking-wide whitespace-nowrap">Buy Now</span>
            <span className="text-[#0F1111]">
                <ExternalArrow />
            </span>
        </a>
    );
}

// 3. PRODUCT DETAIL CARD — dark glass card with logo
export function AmazonCardButton() {
    return (
        <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-[#FF9900]/15 via-[#FF9900]/8 to-transparent border border-[#FF9900]/35 hover:border-[#FF9900]/80 hover:from-[#FF9900]/25 hover:via-[#FF9900]/15 transition-all duration-250 cursor-pointer group"
            aria-label="Buy on Amazon"
        >
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                    {/* White logo on dark bg */}
                    <img
                        src="/amazon-logo.svg"
                        alt="Amazon"
                        className="h-5 w-auto brightness-0 invert"
                    />
                    <span className="h-4 w-px bg-white/20" />
                    <span className="text-white font-black text-sm tracking-wide uppercase">Official Store</span>
                </div>
                <p className="text-slate-400 text-[11px] font-medium">
                    Fast Prime Shipping · Official Manufacturer Direct Listing
                </p>
            </div>
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF9900]/20 border border-[#FF9900]/40 group-hover:bg-[#FF9900] group-hover:border-transparent text-[#FF9900] group-hover:text-[#0F1111] transition-all duration-200">
                <ExternalArrow />
            </span>
        </a>
    );
}
