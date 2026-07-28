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
        rating: 4.9,
        reviewsCount: 128,
        image: '/images/product/main.png',
        images: [
            '/images/product/main.png',
            '/images/product/angle.png',
            '/images/product/feature.png',
            '/images/product/banner1.png',
            '/images/product/banner2.png'
        ],
        description: 'High-fidelity audio engineered with active noise cancellation, custom acoustic drivers, 30-hour playback battery life, and plush memory foam ear cushions (ASIN: B0H915VTB1).',
        specs: ['Bluetooth 5.3', '30-Hour Battery Life', 'Active Noise Cancellation (ANC)', 'Custom Acoustic Drivers', 'ASIN: B0H915VTB1'],
        isFeatured: true,
        isNew: true,
        stock: 24,
    }
];

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: initialProducts,
        searchQuery: '',
        selectedCategory: 'All',
        sortBy: 'featured',
        selectedProduct: null,
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
    },
});

export const { setSearchQuery, setSelectedCategory, setSortBy, setSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
