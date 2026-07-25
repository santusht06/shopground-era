import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
    {
        id: 'prod-101',
        name: 'Lorem Apex Headphones',
        subtitle: 'Wireless Active Noise Cancelling Audio',
        price: 249.99,
        originalPrice: 299.99,
        category: 'Electronics',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        status: 'Active',
    },
    {
        id: 'prod-102',
        name: 'Ipsum Minimalist Chronograph',
        subtitle: 'Brushed Stainless Steel Timepiece',
        price: 189.00,
        originalPrice: 220.00,
        category: 'Accessories',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        status: 'Active',
    },
    {
        id: 'prod-103',
        name: 'Dolor Smart Ergonomics Chair',
        subtitle: 'Lumbar Support Executive Desk Seat',
        price: 450.00,
        originalPrice: 520.00,
        category: 'Furniture',
        stock: 8,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d85d5?auto=format&fit=crop&w=600&q=80',
        status: 'Active',
    }
];

const initialOrders = [
    {
        id: 'ORD-89241',
        customer: 'Lorem Customer',
        email: 'customer@shopground.era',
        date: '2026-07-25',
        total: 249.99,
        status: 'Processing',
        itemsCount: 1,
        items: ['Lorem Apex Headphones'],
        shippingAddress: '124 Lorem Avenue, San Francisco, CA',
    },
    {
        id: 'ORD-78190',
        customer: 'Jane Doe',
        email: 'jane@shopground.era',
        date: '2026-07-24',
        total: 135.50,
        status: 'Delivered',
        itemsCount: 1,
        items: ['Sit Amet Mechanical Keyboard'],
        shippingAddress: '500 Market Street, San Francisco, CA',
    }
];

const initialCustomers = [
    { id: 'usr-001', name: 'Lorem Customer', email: 'customer@shopground.era', role: 'VIP Customer', ordersCount: 2, totalSpent: 385.49 },
    { id: 'usr-002', name: 'Jane Doe', email: 'jane@shopground.era', role: 'Customer', ordersCount: 1, totalSpent: 135.50 }
];

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        products: initialProducts,
        orders: initialOrders,
        customers: initialCustomers,
        activeTab: 'dashboard', // 'dashboard' | 'products' | 'orders' | 'customers' | 'settings'
        apiEndpoint: 'http://localhost:8000/api/v1',
        backendCorsDomain: 'admin.myapp.com',
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        addProduct: (state, action) => {
            state.products.unshift(action.payload);
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find(o => o.id === orderId);
            if (order) {
                order.status = status;
            }
        },
    },
});

export const { setActiveTab, addProduct, deleteProduct, updateOrderStatus } = adminSlice.actions;
export default adminSlice.reducer;
