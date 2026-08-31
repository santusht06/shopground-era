import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Menu, X, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCartDrawer, selectCartTotalQuantity } from '@/store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalQty = useSelector(selectCartTotalQuantity);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            const sections = ['product-overview', 'wholesale-section', 'gallery-section', 'tech-specs-section', 'inquiry-form-section'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.replace('-section', '').replace('product-', ''));
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
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#050507]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
                    : 'bg-gradient-to-b from-[#050507]/90 to-transparent py-4'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    
                    {/* Brand Logo & Tag */}
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all">
                            <img src="/logo.png" alt="ShopGround Era Logo" className="w-9 h-9 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-[#F27E24] transition-colors">
                                    SHOPGROUND
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24]">
                                    ERA
                                </span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase">
                                GroundEra™ Official Store
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-[#0C0C12]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeSection === item.name;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#F27E24] text-white shadow-[0_0_15px_rgba(242,126,36,0.5)]'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Actions: Warranty Portal & Cart Drawer Button */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/warranty"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-slate-200 text-xs font-bold hover:border-[#F27E24] hover:text-[#F27E24] transition-all"
                        >
                            <ShieldCheck className="w-4 h-4 text-[#F27E24]" />
                            <span>Warranty Portal</span>
                        </Link>

                        <button
                            onClick={() => dispatch(toggleCartDrawer())}
                            className="relative p-2.5 rounded-xl bg-[#0C0C12] border border-white/10 hover:border-[#F27E24]/50 text-white transition-all cursor-pointer group shadow-md"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingBag className="w-5 h-5 text-slate-300 group-hover:text-[#F27E24] transition-colors" />
                            {true && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F27E24] text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-[#050507]">
                                    {totalQty}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-[#0C0C12] border border-white/10 text-white cursor-pointer"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0C0C12] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 mt-3 animate-fade-in">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setMobileMenuOpen(false);
                                scrollToSection(item.id);
                            }}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 flex items-center justify-between"
                        >
                            <span>{item.label}</span>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                    ))}
                    <Link
                        to="/warranty"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-[#F27E24] bg-[#F27E24]/10 border border-[#F27E24]/30 flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Lifetime Warranty Portal
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#F27E24]" />
                    </Link>
                </div>
            )}
        </header>
    );
}
