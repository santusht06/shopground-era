import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        isDrawerOpen: false,
        couponCode: '',
        discountPercent: 0,
    },
    reducers: {
        toggleCartDrawer: (state, action) => {
            state.isDrawerOpen = action.payload !== undefined ? action.payload : !state.isDrawerOpen;
        },
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += product.quantity || 1;
            } else {
                state.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity || 1,
                    image: product.image,
                    category: product.category,
                });
            }
            state.isDrawerOpen = true;
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== id);
                } else {
                    item.quantity = quantity;
                }
            }
        },
        applyCoupon: (state, action) => {
            const code = action.payload.toUpperCase().trim();
            if (code === 'APEX16') {
                state.couponCode = code;
                state.discountPercent = 10;
            } else if (code === 'SHAREX20') {
                state.couponCode = code;
                state.discountPercent = 20;
            } else {
                state.couponCode = '';
                state.discountPercent = 0;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.couponCode = '';
            state.discountPercent = 0;
        },
    },
});

export const {
    toggleCartDrawer,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
} = cartSlice.actions;

export const selectCartTotalQuantity = (state) =>
    state.cart ? state.cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

export default cartSlice.reducer;
