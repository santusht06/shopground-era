import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCartDrawer } from '@/store/slices/cartSlice';
import { ShieldCheck, Sparkles, Send, FileText, Image as ImageIcon, Layers, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const scrollToSection = (id) => {
        const handleScroll = () => {
            const elem = document.getElementById(id);
            if (elem) {
                const yOffset = -70;
                const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        };

        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(handleScroll, 120);
        } else {
            handleScroll();
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-header">
            {/* Main Navigation Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center group shrink-0">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-11 sm:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Quick Section Navigation Links */}
                <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
                    <button
                        onClick={() => scrollToSection('product-overview')}
                        className="hover:text-[#F27E24] transition-colors cursor-pointer text-slate-300 hover:scale-105 transform"
                    >
                        Explore
                    </button>
                    <button
                        onClick={() => scrollToSection('product-overview')}
                        className="hover:text-[#F27E24] transition-colors cursor-pointer text-slate-300 hover:scale-105 transform"
                    >
                        Product Overview
                    </button>
                    <button
                        onClick={() => scrollToSection('gallery-section')}
                        className="hover:text-[#F27E24] transition-colors cursor-pointer text-slate-300 hover:scale-105 transform"
                    >
                        Features & Gallery
                    </button>
                    <button
                        onClick={() => scrollToSection('tech-specs-section')}
                        className="hover:text-[#F27E24] transition-colors cursor-pointer text-slate-300 hover:scale-105 transform"
                    >
                        Technical Specs
                    </button>
                    <button
                        onClick={() => scrollToSection('inquiry-form-section')}
                        className="hover:text-[#F27E24] transition-colors cursor-pointer text-slate-300 hover:scale-105 transform"
                    >
                        Get a Quote
                    </button>
                </nav>

                {/* Right Action: Shopping Bag & Direct Inquiry CTAs */}
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => dispatch(toggleCartDrawer(true))}
                        variant="outline"
                        className="relative bg-white/5 hover:bg-white/10 border-white/15 text-white h-10 px-3.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4 text-[#F27E24]" />
                        <span className="text-xs font-bold hidden sm:inline">Cart</span>
                        {totalCartCount > 0 && (
                            <span className="bg-[#F27E24] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center -mr-1 shadow-[0_0_10px_rgba(242,126,36,0.6)]">
                                {totalCartCount}
                            </span>
                        )}
                    </Button>

                    <Button
                        onClick={() => scrollToSection('inquiry-form-section')}
                        className="gradient-btn-orange text-xs font-extrabold h-10 px-4 rounded-xl gap-2 cursor-pointer shadow-lg"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>Get a Quote</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
