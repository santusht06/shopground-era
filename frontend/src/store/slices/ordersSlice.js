import { createSlice } from '@reduxjs/toolkit';

const initialOrders = [
    {
        id: 'ORD-89241',
        date: '2026-07-24',
        total: 249.99,
        status: 'Processing',
        itemsCount: 1,
        items: [
            { name: 'Lorem Apex Headphones', qty: 1, price: 249.99 }
        ],
        shippingAddress: '124 Lorem Avenue, Suite 400, San Francisco, CA',
    },
    {
        id: 'ORD-78190',
        date: '2026-07-18',
        total: 135.50,
        status: 'Delivered',
        itemsCount: 1,
        items: [
            { name: 'Sit Amet Mechanical Keyboard', qty: 1, price: 135.50 }
        ],
        shippingAddress: '124 Lorem Avenue, Suite 400, San Francisco, CA',
    }
];

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        list: initialOrders,
        activeTab: 'all',
    },
    reducers: {
        addOrder: (state, action) => {
            state.list.unshift(action.payload);
        },
        setActiveOrderTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { addOrder, setActiveOrderTab } = ordersSlice.actions;
export default ordersSlice.reducer;
