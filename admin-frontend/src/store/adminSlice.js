import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

// ── Cloudinary CDN helper ─────────────────────────────────────────────────────
const CDN = (publicId, w = 600) =>
    `https://res.cloudinary.com/dnay8iqz3/image/upload/f_auto,q_auto,w_${w}/shopground/products/${publicId}.png`;

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchAdminProducts = createAsyncThunk(
    'admin/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE}/products`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || 'Failed to fetch products');
        }
    }
);

export const fetchAdminOrders = createAsyncThunk(
    'admin/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_BASE}/orders`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.detail || 'Failed to fetch orders');
        }
    }
);

// ── Static seed data (campaigns, customers, returns, audit logs) ──────────────
// These will move to DB in a future sprint. Products & orders come from API.

const seedCampaigns = [
    {
        id: 'cmp-1',
        name: 'Studio Audio Flash Sale',
        discountPercent: 16.67,
        code: 'APEX16',
        startDate: '2026-07-25',
        endDate: '2026-07-30',
        status: 'Active',
        bannerText: '🔥 Special Audio Sale: Get $50 Off Apex Pro Headphones',
    },
];

const seedCustomers = [
    {
        id: 'usr-001',
        name: 'Alex Johnson',
        email: 'alex@shopground.era',
        role: 'VIP Customer',
        ordersCount: 1,
        totalSpent: 249.99,
    },
];

const seedReturnRequests = [
    {
        id: 'RET-101',
        orderId: 'ORD-89241',
        customer: 'Alex Johnson',
        reason: 'Size/Color Exchange Request',
        status: 'Pending Review',
        amount: 249.99,
    },
];

const seedAuditLogs = [
    {
        id: 'log-1',
        user: 'Super Admin',
        action: 'Seeded MongoDB with Cloudinary CDN image URLs',
        timestamp: 'Just now',
        ip: '127.0.0.1',
    },
];

// ── Slice ─────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        currentRole: 'Super Admin',
        availableRoles: [
            'Super Admin',
            'Store Manager',
            'Catalog Specialist',
            'Fulfillment Agent',
            'Support Agent',
        ],
        products: [],
        orders: [],
        customers: seedCustomers,
        campaigns: seedCampaigns,
        returnRequests: seedReturnRequests,
        auditLogs: seedAuditLogs,
        activeTab: 'dashboard',
        loading: false,
        error: null,
        apiEndpoint: API_BASE,
    },
    reducers: {
        setActiveTab: (state, action) => { state.activeTab = action.payload; },
        setCurrentRole: (state, action) => { state.currentRole = action.payload; },
        addProduct: (state, action) => { state.products.unshift(action.payload); },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(
                (p) => p._id !== action.payload && p.id !== action.payload
            );
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.orders.find((o) => o._id === orderId || o.id === orderId);
            if (order) order.status = status;
        },
        addCampaign: (state, action) => { state.campaigns.unshift(action.payload); },
        deleteCampaign: (state, action) => {
            state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
        },
        toggleCampaignStatus: (state, action) => {
            const campaign = state.campaigns.find((c) => c.id === action.payload);
            if (campaign) campaign.status = campaign.status === 'Active' ? 'Paused' : 'Active';
        },
        processReturnRequest: (state, action) => {
            const { returnId, status } = action.payload;
            const ret = state.returnRequests.find((r) => r.id === returnId);
            if (ret) ret.status = status;
        },
        updateReturnStatus: (state, action) => {
            const { returnId, status } = action.payload;
            const ret = state.returnRequests.find((r) => r.id === returnId);
            if (ret) ret.status = status;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAdminProducts
            .addCase(fetchAdminProducts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchAdminOrders
            .addCase(fetchAdminOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
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
