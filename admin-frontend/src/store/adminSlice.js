import { createSlice } from '@reduxjs/toolkit';

const initialProducts = [
    {
        id: 'B0H915VTB1',
        name: 'Apex Pro Wireless Active Noise Cancelling Headphones',
        subtitle: 'ASIN: B0H915VTB1 — Premium Studio Grade Audio',
        price: 249.99,
        originalPrice: 299.99,
        category: 'Electronics',
        brand: 'Apex Audio',
        stock: 24,
        image: '/images/product/main.png',
        images: [
            '/images/product/main.png',
            '/images/product/angle.png',
            '/images/product/feature.png',
            '/images/product/banner1.png',
            '/images/product/banner2.png'
        ],
        status: 'Active',
        variants: [
            { sku: 'B0H915VTB1-BLK', color: 'Midnight Black', stock: 14, price: 249.99 },
            { sku: 'B0H915VTB1-SLV', color: 'Silver Alum', stock: 10, price: 249.99 }
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
        items: ['Apex Pro Headphones (1x)'],
        shippingAddress: '124 Lorem Avenue, San Francisco, CA',
    }
];

const initialCustomers = [
    { id: 'usr-001', name: 'Lorem Customer', email: 'customer@shopground.era', role: 'VIP Customer', ordersCount: 1, totalSpent: 249.99 }
];

const initialCampaigns = [
    {
        id: 'cmp-1',
        name: 'Amazon Prime & Big Billion Days Flash Sale',
        discountPercent: 16.67,
        code: 'APEX16',
        startDate: '2026-07-25',
        endDate: '2026-07-30',
        status: 'Active',
        bannerText: '🔥 Amazon Prime Special: Get $50 Off Apex Pro Headphones (ASIN: B0H915VTB1)',
    }
];

const initialReturnRequests = [
    {
        id: 'RET-101',
        orderId: 'ORD-89241',
        customer: 'Lorem Customer',
        reason: 'Size/Color Exchange Request',
        status: 'Pending Review',
        amount: 249.99,
    }
];

const initialAuditLogs = [
    {
        id: 'log-1',
        user: 'Super Admin',
        action: 'Imported Amazon Product (ASIN: B0H915VTB1) & High-Res Images',
        timestamp: 'Just now',
        ip: '192.168.1.1',
    }
];

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        currentRole: 'Super Admin',
        availableRoles: ['Super Admin', 'Store Manager', 'Catalog Specialist', 'Fulfillment Agent', 'Support Agent'],
        products: initialProducts,
        orders: initialOrders,
        customers: initialCustomers,
        campaigns: initialCampaigns,
        returnRequests: initialReturnRequests,
        auditLogs: initialAuditLogs,
        activeTab: 'dashboard',
        apiEndpoint: 'http://localhost:8000/api/v1',
        backendCorsDomain: 'admin.myapp.com',
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setCurrentRole: (state, action) => {
            state.currentRole = action.payload;
        },
        addProduct: (state, action) => {
            state.products.unshift(action.payload);
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter((p) => p.id !== action.payload);
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find((o) => o.id === orderId);
            if (order) {
                order.status = status;
            }
        },
        addCampaign: (state, action) => {
            state.campaigns.unshift(action.payload);
        },
        deleteCampaign: (state, action) => {
            state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
        },
        toggleCampaignStatus: (state, action) => {
            const campaign = state.campaigns.find((c) => c.id === action.payload);
            if (campaign) {
                campaign.status = campaign.status === 'Active' ? 'Paused' : 'Active';
            }
        },
        processReturnRequest: (state, action) => {
            const { returnId, status } = action.payload;
            const ret = state.returnRequests.find((r) => r.id === returnId);
            if (ret) {
                ret.status = status;
            }
        },
        updateReturnStatus: (state, action) => {
            const { returnId, status } = action.payload;
            const ret = state.returnRequests.find((r) => r.id === returnId);
            if (ret) {
                ret.status = status;
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
    deleteCampaign,
    toggleCampaignStatus,
    processReturnRequest,
    updateReturnStatus,
} = adminSlice.actions;

export default adminSlice.reducer;
