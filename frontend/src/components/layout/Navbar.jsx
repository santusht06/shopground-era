import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setSelectedCategory } from '@/store/slices/productsSlice';
import { toggleCartDrawer } from '@/store/slices/cartSlice';
import {
    Search,
    ShoppingBag,
    Sparkles,
    Package,
    User,
    ChevronRight,
    X,
    MapPin,
    Heart,
    Headphones,
    Shirt,
    Armchair,
    Watch,
    Utensils,
    Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Navbar() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);
    const wishlist = useSelector((state) => state.auth.wishlist);
    const searchQuery = useSelector((state) => state.products.searchQuery);
    const selectedCategory = useSelector((state) => state.products.selectedCategory);
    const products = useSelector((state) => state.products.items);
    const cartItems = useSelector((state) => state.cart.items);
    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedCatFilter, setSelectedCatFilter] = useState('All');

    const isStoreActive = location.pathname === '/';
    const isOrdersActive = location.pathname === '/orders';
    const isProfileActive = location.pathname === '/profile';

    // Mega Nav Categories
    const megaCategories = [
        { id: 'All', label: 'All Items', icon: Package },
        { id: 'Electronics', label: 'Electronics', icon: Headphones },
        { id: 'Fashion', label: 'Fashion', icon: Shirt },
        { id: 'Furniture', label: 'Furniture', icon: Armchair },
        { id: 'Accessories', label: 'Accessories', icon: Watch },
        { id: 'Home & Kitchen', label: 'Home & Kitchen', icon: Utensils },
    ];

    // Live search results preview
    const searchPreviewResults = searchQuery.trim()
        ? products.filter(p => {
            const matchesCat = selectedCatFilter === 'All' || p.category === selectedCatFilter;
            const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesQuery;
        }).slice(0, 5)
        : [];

    const handleSearchChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleProductSelect = (id) => {
        setIsSearchFocused(false);
        dispatch(setSearchQuery(''));
        navigate(`/product/${id}`);
    };

    const handleMegaCatClick = (catId) => {
        dispatch(setSelectedCategory(catId));
        if (location.pathname !== '/') {
            navigate('/');
        }
        setTimeout(() => {
            document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md transition-all shadow-2xs">
            
            {/* Top Delivery Location Bar */}
            <div className="bg-[#0F172A] text-xs text-slate-300 py-1.5 px-4 flex items-center justify-between font-medium border-b border-slate-800">
                <div className="flex items-center gap-2 max-w-7xl mx-auto w-full px-2">
                    <MapPin className="w-3.5 h-3.5 text-[#5E6AD2]" />
                    <span>Deliver to <strong className="text-white font-bold">San Francisco 94107</strong></span>
                    <span className="text-slate-500 font-normal hidden sm:inline">— Express 24h Shipping Available</span>
                </div>

                <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
                    <Link to="/orders" className="hover:text-white transition-colors">Returns & Orders</Link>
                    <span>|</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Code LOREM10 (10% Off)
                    </span>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-[#5E6AD2] text-white flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
                        S
                    </div>
                    <div>
                        <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">ShopGround</span>
                        <span className="text-[10px] font-extrabold text-[#5E6AD2] block -mt-1 tracking-wider uppercase">STORE</span>
                    </div>
                </Link>

                {/* Integrated Category Dropdown Search Bar */}
                <div className="flex-1 max-w-xl hidden md:block relative">
                    <div className="flex items-center border border-[#E5E7EB] rounded-xl bg-[#F4F5F8] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#5E6AD2] transition-all overflow-hidden shadow-2xs">
                        <select
                            value={selectedCatFilter}
                            onChange={(e) => setSelectedCatFilter(e.target.value)}
                            className="bg-transparent text-xs font-semibold text-slate-700 px-3 py-2 border-r border-[#E5E7EB] focus:outline-none cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                        </select>

                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search products, brands, specs..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                className="pl-3 pr-8 bg-transparent border-none text-xs focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => dispatch(setSearchQuery(''))}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <button className="bg-[#5E6AD2] text-white px-4 h-9 flex items-center justify-center hover:bg-[#4f5bc4] transition-colors cursor-pointer">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Instant Search Results Dropdown Preview */}
                    {isSearchFocused && searchPreviewResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                                Matching Products ({searchPreviewResults.length})
                            </div>
                            <div className="space-y-1">
                                {searchPreviewResults.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleProductSelect(item.id)}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F4F5F8] cursor-pointer transition-colors"
                                    >
                                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md bg-slate-100" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                                            <p className="text-[11px] text-[#5E6AD2] font-semibold">${item.price.toFixed(2)}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Wishlist Link */}
                    <Link
                        to="/profile"
                        className="relative p-2 rounded-lg text-slate-600 hover:bg-[#F4F5F8] transition-colors hidden sm:flex items-center gap-1"
                    >
                        <Heart className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-semibold text-slate-700 hidden lg:inline">Wishlist</span>
                        {wishlist.length > 0 && (
                            <Badge variant="default" className="bg-rose-500 text-white text-[10px] h-4 min-w-[16px] px-1 rounded-full justify-center">
                                {wishlist.length}
                            </Badge>
                        )}
                    </Link>

                    {/* Profile Link */}
                    <Link
                        to="/profile"
                        className={`flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border transition-colors ${
                            isProfileActive
                                ? 'border-[#5E6AD2] bg-[#F4F5F8] text-[#5E6AD2]'
                                : 'border-[#E5E7EB] bg-white text-slate-700 hover:bg-[#F4F5F8]'
                        }`}
                    >
                        <img
                            src={user?.avatar}
                            alt={user?.name}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold hidden md:inline">{user?.name?.split(' ')[0]}</span>
                    </Link>

                    {/* Cart Trigger */}
                    <Button
                        onClick={() => dispatch(toggleCartDrawer(true))}
                        variant="outline"
                        size="sm"
                        className="relative border-[#E5E7EB] bg-white hover:bg-[#F4F5F8] text-[#0F172A] gap-2 font-semibold shadow-2xs"
                    >
                        <ShoppingBag className="w-4 h-4 text-[#5E6AD2]" />
                        <span className="hidden sm:inline">Bag</span>
                        {totalCartCount > 0 && (
                            <Badge variant="default" className="bg-[#5E6AD2] text-white text-xs h-5 min-w-[20px] px-1.5 rounded-full justify-center animate-bounce">
                                {totalCartCount}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>

            {/* Mega Category Navigation Bar */}
            <div className="bg-[#F4F5F8] border-t border-[#E5E7EB] overflow-x-auto scrollbar-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5">
                    {megaCategories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleMegaCatClick(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                                    isSelected
                                        ? 'bg-white text-[#5E6AD2] shadow-2xs border border-[#E5E7EB]'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

        </header>
    );
}
