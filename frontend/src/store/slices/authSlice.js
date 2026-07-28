import { createSlice } from '@reduxjs/toolkit';

const initialAddresses = [
    {
        id: 'addr-1',
        tag: 'Home',
        street: '124 Market Street, Suite 400',
        city: 'San Francisco',
        zip: '94107',
        country: 'United States',
        isDefault: true,
    },
    {
        id: 'addr-2',
        tag: 'Work',
        street: '500 Market Street, Floor 12',
        city: 'San Francisco',
        zip: '94105',
        country: 'United States',
        isDefault: false,
    }
];

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {
            id: 'usr-001',
            name: 'Guest User',
            email: 'customer@shopground.era',
            phone: '+1 (555) 234-5678',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            role: 'VIP Customer',
            memberSince: 'January 2025',
        },
        addresses: initialAddresses,
        wishlist: [
            {
                id: 'prod-102',
                name: 'Ipsum Minimalist Chronograph',
                price: 189.00,
                originalPrice: 220.00,
                category: 'Accessories',
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
            }
        ],
        preferences: {
            emailNotifications: true,
            smsAlerts: false,
            marketingEmails: true,
        },
        isAuthenticated: true,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        updateProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        addAddress: (state, action) => {
            const newAddr = {
                id: `addr-${Date.now()}`,
                ...action.payload,
            };
            if (newAddr.isDefault) {
                state.addresses.forEach(a => a.isDefault = false);
            }
            state.addresses.push(newAddr);
        },
        deleteAddress: (state, action) => {
            state.addresses = state.addresses.filter(a => a.id !== action.payload);
        },
        setDefaultAddress: (state, action) => {
            state.addresses.forEach(a => {
                a.isDefault = (a.id === action.payload);
            });
        },
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const exists = state.wishlist.some(item => item.id === product.id);
            if (exists) {
                state.wishlist = state.wishlist.filter(item => item.id !== product.id);
            } else {
                state.wishlist.push(product);
            }
        },
        updatePreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
    },
});

export const {
    login,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    toggleWishlist,
    updatePreferences,
} = authSlice.actions;

export default authSlice.reducer;
