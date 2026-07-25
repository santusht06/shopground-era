import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setSelectedCategory } from '@/store/slices/productsSlice';
import { toggleCartDrawer } from '@/store/slices/cartSlice';
import { Search, ShoppingBag, Sparkles, Package, User, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Navbar() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);
    const searchQuery = useSelector((state) => state.products.searchQuery);
    const products = useSelector((state) => state.products.items);
    const cartItems = useSelector((state) => state.cart.items);
    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const isStoreActive = location.pathname === '/';
    const isOrdersActive = location.pathname === '/orders';
    const isProfileActive = location.pathname === '/profile';

    // Live search results preview
    const searchPreviewResults = searchQuery.trim()
        ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
        : [];

    const handleSearchChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleProductSelect = (id) => {
        setIsSearchFocused(false);
        dispatch(setSearchQuery(''));
        navigate(`/product/${id}`);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md transition-all">
            {/* Top Announcement Bar */}
            <div className="bg-[#0F172A] text-xs text-white py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 laser-glow-horizontal">
                <Sparkles className="w-3.5 h-3.5 text-[#5E6AD2] animate-pulse" />
                <span>ShopGround Era — Light Theme Experience. Use Code <strong>LOREM10</strong> for 10% Off</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-lg bg-[#5E6AD2] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                        S
                    </div>
                    <div>
                        <span className="text-lg font-bold tracking-tight text-[#0F172A]">ShopGround</span>
                        <span className="text-xs font-semibold text-[#5E6AD2] block -mt-1 tracking-wider uppercase">ERA</span>
                    </div>
                </Link>

                {/* Search Bar with Live Preview Popup */}
                <div className="flex-1 max-w-md hidden md:block relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search products, categories, specs..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            className="pl-9 pr-8 bg-[#F4F5F8] border-[#E5E7EB] focus:bg-white text-sm"
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

                    {/* Instant Search Results Dropdown Preview */}
                    {isSearchFocused && searchPreviewResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
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

                {/* Navigation Links & Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        onClick={() => dispatch(setSelectedCategory('All'))}
                        className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                            isStoreActive ? 'text-[#5E6AD2] bg-[#F4F5F8]' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Store Front
                    </Link>

                    <Link
                        to="/orders"
                        className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                            isOrdersActive ? 'text-[#5E6AD2] bg-[#F4F5F8]' : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        <span className="hidden sm:inline">My Orders</span>
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
                        className="relative border-[#E5E7EB] bg-white hover:bg-[#F4F5F8] text-[#0F172A] gap-2 font-medium"
                    >
                        <ShoppingBag className="w-4 h-4 text-[#5E6AD2]" />
                        <span className="hidden sm:inline">Cart</span>
                        {totalCartCount > 0 && (
                            <Badge variant="default" className="bg-[#5E6AD2] text-white text-xs h-5 min-w-[20px] px-1.5 rounded-full justify-center animate-bounce">
                                {totalCartCount}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>
        </header>
    );
}
