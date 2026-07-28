import React from 'react';

/**
 * AmazonBuyButton — Premium, production-grade "Buy on Amazon" CTA.
 * Uses official Amazon brand colors and wordmark SVG.
 *
 * Variants:
 *   "pill"  — compact, for navbars / inline usage
 *   "card"  — full-width card with subtitle + arrow
 *   "ghost" — minimal outline style for secondary placement
 */
const AMAZON_URL = 'https://www.amazon.com/dp/B0H915VTB1';

// Official Amazon logotype SVG (wordmark + smile arrow)
const AmazonWordmark = ({ className = 'h-4' }) => (
  <svg
    viewBox="0 0 102 31"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Amazon"
    fill="currentColor"
  >
    {/* amazon wordmark */}
    <path d="M5.87 12.06c0 .55.06 1 .17 1.35.13.35.3.73.54 1.14.09.14.12.28.12.41 0 .18-.11.36-.34.54l-1.13.75c-.16.11-.32.16-.47.16-.18 0-.36-.09-.54-.26a5.57 5.57 0 0 1-.65-.85 13.9 13.9 0 0 1-.56-1.07C1.83 15.61.9 16.3-.2 16.3c-.78 0-1.4-.22-1.86-.65-.46-.43-.7-1.01-.7-1.73 0-.76.27-1.38.82-1.86.55-.48 1.28-.72 2.2-.72.31 0 .63.02.97.07.34.05.69.13 1.06.22v-.67c0-.7-.15-1.19-.44-1.48-.3-.29-.81-.43-1.54-.43-.33 0-.67.04-1.02.13-.35.09-.69.2-1.02.35-.15.07-.27.11-.34.13a.6.6 0 0 1-.16.03c-.14 0-.21-.1-.21-.31V8.6c0-.16.02-.28.07-.35.05-.07.15-.14.31-.21a6.3 6.3 0 0 1 1.25-.36 6.3 6.3 0 0 1 1.54-.18c1.17 0 2.03.27 2.58.8.54.53.82 1.34.82 2.42v3.34zm-3.14 1.18c.3 0 .61-.05.94-.16.33-.11.62-.31.87-.59.15-.17.26-.36.32-.58.06-.22.1-.48.1-.79v-.38a7.53 7.53 0 0 0-.84-.16 7.04 7.04 0 0 0-.85-.05c-.6 0-1.04.12-1.33.36-.29.24-.43.58-.43 1.03 0 .42.11.74.32.96.21.22.51.36.9.36zm7.16.97c-.18 0-.3-.03-.38-.1-.08-.07-.15-.21-.21-.41L7.54 8.38a1.9 1.9 0 0 1-.1-.44c0-.17.09-.27.26-.27h1.06c.19 0 .32.03.39.1.08.07.14.21.19.41l1.29 5.09 1.2-5.09c.05-.21.1-.34.18-.41.08-.07.22-.1.4-.1h.87c.19 0 .32.03.4.1.08.07.14.21.18.41l1.21 5.15 1.33-5.15c.05-.21.12-.34.19-.41.08-.07.21-.1.39-.1h1.01c.17 0 .26.09.26.27 0 .05-.01.1-.02.16-.02.06-.04.14-.08.27l-1.88 5.32c-.05.21-.12.34-.2.41-.08.07-.21.1-.39.1h-.93c-.19 0-.32-.03-.4-.1-.08-.07-.14-.21-.19-.43l-1.19-4.97-1.18 4.96c-.06.21-.12.35-.19.43-.08.07-.22.1-.4.1h-.94zm10.29.19c-.56 0-1.12-.06-1.66-.19-.54-.13-.96-.27-1.24-.43-.18-.1-.3-.21-.34-.31a.79.79 0 0 1-.06-.31v-.52c0-.21.08-.32.23-.32.06 0 .12.01.18.03.06.02.15.06.25.1.34.15.71.27 1.1.35.4.08.79.12 1.19.12.63 0 1.12-.11 1.46-.34.34-.23.52-.56.52-.99 0-.29-.09-.53-.28-.72-.19-.19-.54-.36-1.06-.52l-1.52-.47c-.77-.24-1.34-.59-1.7-1.06a2.58 2.58 0 0 1-.54-1.58c0-.46.1-.86.3-1.21.2-.35.47-.65.81-.89.34-.25.72-.43 1.17-.56.45-.13.92-.19 1.42-.19.25 0 .51.01.76.05.26.03.5.08.73.13.22.05.43.11.63.18.2.07.35.14.46.21.16.1.27.2.33.31.06.11.09.25.09.43v.48c0 .21-.08.32-.23.32-.08 0-.21-.04-.38-.13a4.6 4.6 0 0 0-1.94-.4c-.57 0-1.02.09-1.33.28-.31.19-.47.48-.47.89 0 .29.1.53.31.73.21.2.6.4 1.16.57l1.49.47c.76.24 1.31.57 1.65 1.01.34.44.5.94.5 1.51 0 .47-.1.89-.29 1.26-.19.37-.46.69-.8.96-.34.27-.74.47-1.21.61-.49.15-1 .22-1.54.22zm3.86 2.81c-3.5 2.58-8.57 3.95-12.94 3.95-6.12 0-11.63-2.26-15.8-6.02-.33-.3-.04-.7.36-.47 4.49 2.61 10.05 4.19 15.8 4.19 3.87 0 8.13-.8 12.04-2.47.59-.25 1.08.39.54.82zm1.54-1.76c-.44-.57-2.94-.27-4.06-.13-.34.04-.39-.25-.09-.47 1.99-1.4 5.25-.99 5.63-.53.38.47-.1 3.74-1.96 5.3-.29.24-.56.11-.43-.2.42-1.04 1.35-3.39.91-3.97z"/>
  </svg>
);

// Arrow icon for card variant
const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10M9 4l4 4-4 4"/>
  </svg>
);

// ─── PILL ────────────────────────────────────────────────────────────────────
// Compact button for Navbar — amber outline pill that fills on hover
export function AmazonPill() {
  return (
    <a
      href={AMAZON_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#FF9900]/40 bg-[#FF9900]/8 hover:bg-[#FF9900] text-[#FF9900] hover:text-[#0F1111] transition-all duration-200 cursor-pointer group"
      aria-label="Buy on Amazon"
    >
      {/* Amazon logo shifts color with group */}
      <span className="text-[#FF9900] group-hover:text-[#0F1111] transition-colors">
        <AmazonWordmark className="h-3.5 w-auto" />
      </span>
      <span className="text-xs font-black tracking-tight whitespace-nowrap">Buy Now</span>
    </a>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
// Solid amber "Buy on amazon" block for Hero Banner
export function AmazonHeroButton() {
  return (
    <a
      href={AMAZON_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 h-13 px-7 rounded-xl bg-[#FF9900] hover:bg-[#E59400] active:bg-[#CC8400] text-[#0F1111] font-black text-sm transition-all duration-200 cursor-pointer shadow-[0_0_28px_rgba(255,153,0,0.45)] hover:shadow-[0_0_40px_rgba(255,153,0,0.65)] group select-none"
      aria-label="Buy on Amazon"
    >
      <AmazonWordmark className="h-4 w-auto text-[#0F1111]" />
      <span className="opacity-40">|</span>
      <span className="whitespace-nowrap">Buy Now</span>
      <ArrowIcon />
    </a>
  );
}

// ─── CARD ────────────────────────────────────────────────────────────────────
// Full-width card for Product Detail Page — premium dark card with Amazon badge
export function AmazonCardButton() {
  return (
    <a
      href={AMAZON_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-[#FF9900]/12 via-[#FF9900]/8 to-transparent border border-[#FF9900]/30 hover:border-[#FF9900]/70 hover:from-[#FF9900]/20 hover:via-[#FF9900]/12 transition-all duration-250 cursor-pointer group"
      aria-label="Buy on Amazon"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          {/* Amazon logo in amber */}
          <span className="text-[#FF9900]">
            <AmazonWordmark className="h-5 w-auto" />
          </span>
          <span className="h-4 w-px bg-white/20" />
          <span className="text-white font-black text-sm tracking-tight">Buy Now</span>
        </div>
        <p className="text-slate-400 text-[11px] font-medium">
          Prime delivery available · Sold &amp; fulfilled by Amazon
        </p>
      </div>
      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FF9900]/15 border border-[#FF9900]/30 group-hover:bg-[#FF9900] group-hover:border-transparent text-[#FF9900] group-hover:text-[#0F1111] transition-all duration-200">
        <ArrowIcon />
      </span>
    </a>
  );
}
