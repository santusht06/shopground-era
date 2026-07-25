import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        orders: ordersReducer,
        auth: authReducer,
    },
});

export default store;
