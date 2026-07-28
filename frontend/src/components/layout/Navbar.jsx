import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCartDrawer } from '@/store/slices/cartSlice';
import { Send, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const sectionIds = [
            { id: 'product-overview', name: 'overview' },
            { id: 'wholesale-section', name: 'wholesale' },
            { id: 'gallery-section', name: 'gallery' },
            { id: 'tech-specs-section', name: 'specs' },
            { id: 'inquiry-form-section', name: 'inquiry' },
        ];

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 140;
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const el = document.getElementById(sectionIds[i].id);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPosition >= top) {
                        setActiveSection(sectionIds[i].name);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const NAV_ITEMS = [
        { label: 'Overview', id: 'product-overview', name: 'overview' },
        { label: 'Wholesale Tiers', id: 'wholesale-section', name: 'wholesale' },
        { label: 'Features & Gallery', id: 'gallery-section', name: 'gallery' },
        { label: 'Technical Specs', id: 'tech-specs-section', name: 'specs' },
        { label: 'Get a Quote', id: 'inquiry-form-section', name: 'inquiry' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full glass-header transition-all duration-300">
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

                {/* Quick Section Navigation Links with Minimalist White Active Effect */}
                <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#08080C]/80 border border-white/10 backdrop-blur-xl">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.id)}
                                className={`px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                                    isActive
                                        ? 'bg-white/10 text-white border border-white/20 font-bold shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
                                }`}
                            >
                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
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
