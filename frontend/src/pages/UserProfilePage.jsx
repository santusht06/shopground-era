import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    toggleWishlist,
    updatePreferences,
} from '@/store/slices/authSlice';
import { addToCart } from '@/store/slices/cartSlice';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Heart,
    Package,
    Shield,
    Plus,
    Trash2,
    ShoppingBag,
    Camera,
    CheckCircle,
    Truck,
    Clock,
    RefreshCw,
    ExternalLink,
    ChevronRight,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

export default function UserProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, addresses, wishlist, preferences } = useSelector((state) => state.auth);
    const orders = useSelector((state) => state.orders.list);

    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'personal' | 'addresses' | 'wishlist' | 'settings'
    const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'Processing' | 'Delivered'

    // Personal Info Form State
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || '',
    });
    const [saveSuccess, setSaveSuccess] = useState(false);

    // New Address Form State
    const [showAddrModal, setShowAddrModal] = useState(false);
    const [newAddr, setNewAddr] = useState({
        tag: 'Home',
        street: '',
        city: '',
        zip: '',
        country: 'United States',
        isDefault: false,
    });

    const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

    const filteredOrders = orders.filter((order) => {
        if (orderFilter === 'all') return true;
        return order.status === orderFilter;
    });

    const handleSaveProfile = (e) => {
        e.preventDefault();
        dispatch(updateProfile(profileForm));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
    };

    const handleAddAddressSubmit = (e) => {
        e.preventDefault();
        if (!newAddr.street || !newAddr.city) return;
        dispatch(addAddress(newAddr));
        setShowAddrModal(false);
        setNewAddr({ tag: 'Home', street: '', city: '', zip: '', country: 'United States', isDefault: false });
    };

    const handleReorder = (order) => {
        order.items.forEach(item => {
            dispatch(addToCart({
                id: `reorder-${Date.now()}-${Math.random()}`,
                name: item.name,
                price: item.price,
                quantity: item.qty,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
                category: 'Reorder'
            }));
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            
            {/* Profile Banner / E-Commerce Account Header */}
            <div className="relative bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs overflow-hidden linear-shimmer-card">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                    
                    {/* Left User Details */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <div className="relative group">
                            <img
                                src={user?.avatar}
                                alt={user?.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-[#F4F5F8] shadow-md"
                            />
                            <div className="absolute bottom-0 right-0 p-1.5 bg-[#5E6AD2] text-white rounded-full shadow-xs cursor-pointer hover:scale-110 transition-transform">
                                <Camera className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h1 className="text-2xl font-extrabold text-[#0F172A]">{user?.name}</h1>
                                <Badge className="bg-[#5E6AD2] text-white text-xs">{user?.role}</Badge>
                            </div>
                            <p className="text-xs text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#5E6AD2]" /> {user?.email}</span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#5E6AD2]" /> {user?.phone}</span>
                            </p>
                            <p className="text-[11px] text-slate-400">Member since {user?.memberSince}</p>
                        </div>
                    </div>

                    {/* Right E-Commerce Account Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-[#E5E7EB] pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                        <div className="bg-[#F4F5F8] p-3 rounded-xl text-center">
                            <span className="text-xs text-slate-400 font-medium block">Total Orders</span>
                            <span className="text-xl font-extrabold text-[#0F172A]">{orders.length}</span>
                        </div>
                        <div className="bg-[#F4F5F8] p-3 rounded-xl text-center">
                            <span className="text-xs text-slate-400 font-medium block">Total Spent</span>
                            <span className="text-xl font-extrabold text-[#5E6AD2]">${totalSpent.toFixed(2)}</span>
                        </div>
                        <div className="bg-[#F4F5F8] p-3 rounded-xl text-center">
                            <span className="text-xs text-slate-400 font-medium block">Saved Items</span>
                            <span className="text-xl font-extrabold text-[#0F172A]">{wishlist.length}</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] overflow-x-auto pb-1 scrollbar-none">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === 'orders'
                            ? 'bg-[#5E6AD2] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                >
                    <Package className="w-4 h-4" /> My Orders & E-Commerce ({orders.length})
                </button>

                <button
                    onClick={() => setActiveTab('personal')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === 'personal'
                            ? 'bg-[#5E6AD2] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                >
                    <User className="w-4 h-4" /> Personal Profile
                </button>

                <button
                    onClick={() => setActiveTab('addresses')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === 'addresses'
                            ? 'bg-[#5E6AD2] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                >
                    <MapPin className="w-4 h-4" /> Saved Addresses ({addresses.length})
                </button>

                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === 'wishlist'
                            ? 'bg-[#5E6AD2] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                >
                    <Heart className="w-4 h-4 fill-current" /> Wishlist ({wishlist.length})
                </button>

                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === 'settings'
                            ? 'bg-[#5E6AD2] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                >
                    <Shield className="w-4 h-4" /> Settings & Security
                </button>
            </div>

            {/* TAB CONTENT */}

            {/* TAB 1: E-Commerce Orders & Purchase History */}
            {activeTab === 'orders' && (
                <div className="space-y-6">
                    {/* Orders Status Sub-Filter */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#0F172A]">Order History & Tracking</h2>
                            <p className="text-xs text-slate-500">Track shipments, view receipts, and re-order previous purchases.</p>
                        </div>

                        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#E5E7EB]">
                            <button
                                onClick={() => setOrderFilter('all')}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    orderFilter === 'all' ? 'bg-[#5E6AD2] text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                All Orders ({orders.length})
                            </button>
                            <button
                                onClick={() => setOrderFilter('Processing')}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    orderFilter === 'Processing' ? 'bg-[#5E6AD2] text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Processing
                            </button>
                            <button
                                onClick={() => setOrderFilter('Delivered')}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                    orderFilter === 'Delivered' ? 'bg-[#5E6AD2] text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Delivered
                            </button>
                        </div>
                    </div>

                    {/* Orders List Cards */}
                    {filteredOrders.length > 0 ? (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <Card key={order.id} className="bg-white border-[#E5E7EB] shadow-xs overflow-hidden">
                                    {/* Order Top Bar */}
                                    <div className="bg-[#F4F5F8] border-b border-[#E5E7EB] py-3.5 px-6 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <span className="text-[11px] text-slate-400 font-medium">Order ID</span>
                                                <p className="text-sm font-bold text-[#0F172A]">{order.id}</p>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-slate-400 font-medium">Date Placed</span>
                                                <p className="text-xs font-semibold text-slate-700">{order.date}</p>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-slate-400 font-medium">Ship To</span>
                                                <p className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={order.status === 'Delivered' ? 'success' : 'default'}
                                                className={order.status === 'Processing' ? 'bg-[#5E6AD2] text-white' : ''}
                                            >
                                                {order.status}
                                            </Badge>
                                            <span className="text-base font-extrabold text-[#5E6AD2]">
                                                ${order.total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items & Actions */}
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded bg-[#F4F5F8] text-[#5E6AD2] font-bold flex items-center justify-center text-[10px]">
                                                            {item.qty}x
                                                        </span>
                                                        <span className="font-bold text-[#0F172A]">{item.name}</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-700">${(item.price * item.qty).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tracking Timeline Indicator */}
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Truck className="w-4 h-4 text-[#5E6AD2]" />
                                                <span>
                                                    Status: <strong>{order.status}</strong> — Est. Delivery: 2-3 Business Days
                                                </span>
                                            </div>
                                            
                                            <Button
                                                onClick={() => handleReorder(order)}
                                                size="sm"
                                                variant="outline"
                                                className="text-xs h-8 gap-1.5 border-[#E5E7EB] bg-white text-[#5E6AD2] hover:bg-[#F4F5F8]"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" /> Re-Order Items
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white border border-[#E5E7EB] rounded-xl p-6">
                            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-slate-600">No orders found for this filter</p>
                            <Button onClick={() => navigate('/')} className="mt-4 bg-[#5E6AD2] text-white text-xs">
                                Start Shopping
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: Personal Information */}
            {activeTab === 'personal' && (
                <Card className="bg-white border-[#E5E7EB]">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-[#0F172A]">Edit Personal Profile</CardTitle>
                        <CardDescription className="text-xs">
                            Update your personal account details and contact information.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                            <div>
                                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                                <Input
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                                <Input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                                <Input
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">Avatar Image URL</label>
                                <Input
                                    value={profileForm.avatar}
                                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div className="pt-2 flex items-center gap-3">
                                <Button type="submit" className="bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white text-xs font-semibold px-6 py-2">
                                    Save Changes
                                </Button>
                                {saveSuccess && (
                                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        Profile Updated Successfully!
                                    </span>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* TAB 3: Saved Addresses */}
            {activeTab === 'addresses' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#0F172A]">Delivery Addresses</h2>
                            <p className="text-xs text-slate-500">Manage your default and saved shipping locations.</p>
                        </div>
                        <Button
                            onClick={() => setShowAddrModal(true)}
                            size="sm"
                            className="bg-[#5E6AD2] text-white text-xs font-semibold gap-1.5"
                        >
                            <Plus className="w-4 h-4" /> Add Address
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                            <Card key={addr.id} className="bg-white border-[#E5E7EB] p-5 relative space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-slate-800 border-slate-300 text-xs font-bold">
                                            {addr.tag}
                                        </Badge>
                                        {addr.isDefault && (
                                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                                                Default Delivery
                                            </Badge>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => dispatch(deleteAddress(addr.id))}
                                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="text-xs text-slate-600 space-y-1">
                                    <p className="font-semibold text-slate-900">{user?.name}</p>
                                    <p>{addr.street}</p>
                                    <p>{addr.city}, {addr.zip}</p>
                                    <p>{addr.country}</p>
                                </div>

                                {!addr.isDefault && (
                                    <Button
                                        onClick={() => dispatch(setDefaultAddress(addr.id))}
                                        variant="outline"
                                        size="sm"
                                        className="text-[11px] h-7 border-[#E5E7EB] text-slate-700"
                                    >
                                        Set as Default
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Add Address Modal */}
                    {showAddrModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 w-full max-w-md space-y-4">
                                <h3 className="text-base font-bold text-[#0F172A]">Add New Address</h3>
                                <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
                                    <div>
                                        <label className="font-semibold text-slate-700">Label Tag</label>
                                        <Input
                                            placeholder="e.g. Home, Office"
                                            value={newAddr.tag}
                                            onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                                            className="text-xs mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="font-semibold text-slate-700">Street Address</label>
                                        <Input
                                            placeholder="123 Main Street"
                                            value={newAddr.street}
                                            onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                                            className="text-xs mt-1"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="font-semibold text-slate-700">City</label>
                                            <Input
                                                placeholder="San Francisco"
                                                value={newAddr.city}
                                                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                                                className="text-xs mt-1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="font-semibold text-slate-700">Postal Code</label>
                                            <Input
                                                placeholder="94107"
                                                value={newAddr.zip}
                                                onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                                                className="text-xs mt-1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-3 flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowAddrModal(false)}
                                            className="text-xs"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-[#5E6AD2] text-white text-xs font-semibold">
                                            Save Location
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: Wishlist */}
            {activeTab === 'wishlist' && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#0F172A]">Saved Wishlist ({wishlist.length})</h2>
                        <p className="text-xs text-slate-500">Products saved for later review.</p>
                    </div>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {wishlist.map((item) => (
                                <Card key={item.id} className="bg-white border-[#E5E7EB] p-4 flex gap-4 items-center">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-slate-100" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-[#0F172A] truncate">{item.name}</h4>
                                        <p className="text-xs font-extrabold text-[#5E6AD2]">${item.price.toFixed(2)}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                size="sm"
                                                onClick={() => dispatch(addToCart(item))}
                                                className="bg-[#5E6AD2] text-white text-[11px] h-7 px-2.5 gap-1"
                                            >
                                                <ShoppingBag className="w-3 h-3" /> Add to Cart
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => dispatch(toggleWishlist(item))}
                                                className="text-slate-400 hover:text-rose-500 text-[11px] h-7 px-2"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white border border-[#E5E7EB] rounded-xl p-6">
                            <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-slate-600">Your wishlist is currently empty</p>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 5: Settings & Security */}
            {activeTab === 'settings' && (
                <Card className="bg-white border-[#E5E7EB]">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-[#0F172A]">Notification & Account Preferences</CardTitle>
                        <CardDescription className="text-xs">Configure security and communications preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 max-w-xl">
                        <div className="space-y-4 border-b border-slate-100 pb-6">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Email Communications</h4>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-800">Order Updates & Tracking</p>
                                    <p className="text-[11px] text-slate-400">Receive dispatch emails when items ship.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.emailNotifications}
                                    onChange={(e) => dispatch(updatePreferences({ emailNotifications: e.target.checked }))}
                                    className="w-4 h-4 accent-[#5E6AD2]"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-800">Promotions & Coupons</p>
                                    <p className="text-[11px] text-slate-400">Receive special discounts and sale announcements.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.marketingEmails}
                                    onChange={(e) => dispatch(updatePreferences({ marketingEmails: e.target.checked }))}
                                    className="w-4 h-4 accent-[#5E6AD2]"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Security</h4>
                            <div className="flex justify-between items-center bg-[#F4F5F8] p-3 rounded-lg border border-[#E5E7EB]">
                                <div>
                                    <p className="text-xs font-semibold text-slate-800">Password</p>
                                    <p className="text-[11px] text-slate-400">Last changed 30 days ago</p>
                                </div>
                                <Button variant="outline" size="sm" className="text-xs border-[#E5E7EB] bg-white">
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
