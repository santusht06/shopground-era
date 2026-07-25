import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
    {
        id: 'prod-101',
        name: 'Lorem Apex Headphones',
        subtitle: 'Wireless Active Noise Cancelling Audio',
        price: 249.99,
        originalPrice: 299.99,
        category: 'Electronics',
        brand: 'Apex Audio',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        status: 'Active',
        variants: [
            { sku: 'HD-BLK', color: 'Midnight Black', stock: 10, price: 249.99 },
            { sku: 'HD-SLV', color: 'Silver Chrome', stock: 8, price: 259.99 },
        ]
    },
    {
        id: 'prod-102',
        name: 'Ipsum Minimalist Chronograph',
        subtitle: 'Brushed Stainless Steel Timepiece',
        price: 189.00,
        originalPrice: 220.00,
        category: 'Accessories',
        brand: 'Chrono Craft',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        status: 'Active',
        variants: [
            { sku: 'CH-LEATH', color: 'Brown Leather', stock: 12, price: 189.00 }
        ]
    },
    {
        id: 'prod-103',
        name: 'Dolor Smart Ergonomics Chair',
        subtitle: 'Lumbar Support Executive Desk Seat',
        price: 450.00,
        originalPrice: 520.00,
        category: 'Furniture',
        brand: 'ErgoDesign',
        stock: 8,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d85d5?auto=format&fit=crop&w=600&q=80',
        status: 'Active',
        variants: [
            { sku: 'CH-GRY', color: 'Charcoal Mesh', stock: 8, price: 450.00 }
        ]
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
        courier: 'FedEx Express',
        awbNumber: 'AWB-99824102',
        warehouse: 'Warehouse Alpha (US-West)',
        items: ['Lorem Apex Headphones (1x)'],
        shippingAddress: '124 Lorem Avenue, San Francisco, CA',
    },
    {
        id: 'ORD-78190',
        customer: 'Jane Doe',
        email: 'jane@shopground.era',
        date: '2026-07-24',
        total: 135.50,
        status: 'Delivered',
        courier: 'DHL Express',
        awbNumber: 'AWB-44129810',
        warehouse: 'Warehouse Beta (US-East)',
        items: ['Sit Amet Mechanical Keyboard (1x)'],
        shippingAddress: '500 Market Street, San Francisco, CA',
    }
];

const initialCampaigns = [
    {
        id: 'cmp-1',
        name: 'Big Billion Days Flash Sale',
        discountPercent: 20,
        code: 'SHAREX20',
        startDate: '2026-07-25',
        endDate: '2026-07-30',
        status: 'Active',
        bannerText: '🔥 Mega Flash Sale: Get 20% Off All Electronics & Fashion',
    },
    {
        id: 'cmp-2',
        name: 'Summer Clearance Sale',
        discountPercent: 10,
        code: 'LOREM10',
        startDate: '2026-08-01',
        endDate: '2026-08-15',
        status: 'Scheduled',
        bannerText: '☀️ Summer Sale: Extra 10% Off Sitewide',
    }
];

const initialReturnRequests = [
    {
        id: 'RET-101',
        orderId: 'ORD-78190',
        customer: 'Jane Doe',
        product: 'Sit Amet Mechanical Keyboard',
        reason: 'Wrong switch type ordered',
        date: '2026-07-25',
        status: 'Pending Approval',
        refundAmount: 135.50
    }
];

const initialAuditLogs = [
    { id: 'log-1', timestamp: '2026-07-25 02:25:10', user: 'admin@myapp.com', role: 'Super Admin', action: 'Created Flash Sale Campaign', details: 'Added Big Billion Days Flash Sale (20% Off)' },
    { id: 'log-2', timestamp: '2026-07-25 02:10:44', user: 'manager@myapp.com', role: 'Store Manager', action: 'Updated Order Status', details: 'Marked ORD-89241 as Processing' },
];

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        currentRole: 'Super Admin',
        availableRoles: ['Super Admin', 'Store Manager', 'Catalog Specialist', 'Fulfillment Agent', 'Support Agent'],
        products: initialProducts,
        orders: initialOrders,
        campaigns: initialCampaigns,
        returnRequests: initialReturnRequests,
        auditLogs: initialAuditLogs,
        activeTab: 'dashboard', // 'dashboard' | 'products' | 'orders' | 'scheduling' | 'logistics' | 'rbac' | 'analytics' | 'settings'
        apiEndpoint: 'http://localhost:8000/api/v1',
        backendCorsDomain: 'admin.myapp.com',
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setCurrentRole: (state, action) => {
            state.currentRole = action.payload;
            state.auditLogs.unshift({
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                user: 'admin@myapp.com',
                role: action.payload,
                action: 'Switched Active Role',
                details: `Changed role view to ${action.payload}`
            });
        },
        addProduct: (state, action) => {
            state.products.unshift(action.payload);
            state.auditLogs.unshift({
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                user: 'admin@myapp.com',
                role: state.currentRole,
                action: 'Created Product',
                details: `Added new product "${action.payload.name}" (SKU: ${action.payload.id})`
            });
        },
        deleteProduct: (state, action) => {
            const prod = state.products.find(p => p.id === action.payload);
            state.products = state.products.filter(p => p.id !== action.payload);
            state.auditLogs.unshift({
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                user: 'admin@myapp.com',
                role: state.currentRole,
                action: 'Deleted Product',
                details: `Removed product "${prod?.name || action.payload}" from catalog`
            });
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status, courier, awbNumber } = action.payload;
            const order = state.orders.find(o => o.id === orderId);
            if (order) {
                order.status = status;
                if (courier) order.courier = courier;
                if (awbNumber) order.awbNumber = awbNumber;

                state.auditLogs.unshift({
                    id: `log-${Date.now()}`,
                    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                    user: 'admin@myapp.com',
                    role: state.currentRole,
                    action: 'Updated Order Status',
                    details: `Updated ${orderId} status to "${status}"`
                });
            }
        },
        addCampaign: (state, action) => {
            state.campaigns.unshift(action.payload);
            state.auditLogs.unshift({
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                user: 'admin@myapp.com',
                role: state.currentRole,
                action: 'Created Sale Campaign',
                details: `Scheduled campaign "${action.payload.name}" (${action.payload.discountPercent}% Off)`
            });
        },
        toggleCampaignStatus: (state, action) => {
            const cmp = state.campaigns.find(c => c.id === action.payload);
            if (cmp) {
                cmp.status = cmp.status === 'Active' ? 'Paused' : 'Active';
                state.auditLogs.unshift({
                    id: `log-${Date.now()}`,
                    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                    user: 'admin@myapp.com',
                    role: state.currentRole,
                    action: 'Toggled Campaign Status',
                    details: `Set campaign "${cmp.name}" to ${cmp.status}`
                });
            }
        },
        processReturnRequest: (state, action) => {
            const { requestId, status } = action.payload;
            const ret = state.returnRequests.find(r => r.id === requestId);
            if (ret) {
                ret.status = status;
                state.auditLogs.unshift({
                    id: `log-${Date.now()}`,
                    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                    user: 'admin@myapp.com',
                    role: state.currentRole,
                    action: 'Processed Return Request',
                    details: `Set return ${requestId} to ${status}`
                });
            }
        },
    },
});

export const {
    setActiveTab,
    setCurrentRole,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    addCampaign,
    toggleCampaignStatus,
    processReturnRequest,
} = adminSlice.actions;

export default adminSlice.reducer;
