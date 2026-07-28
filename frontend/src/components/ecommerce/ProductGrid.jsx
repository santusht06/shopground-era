import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '@/store/slices/productsSlice';
import ProductCard from './ProductCard';
import CategoryPills from './CategoryPills';
import { PackageX, Loader2 } from 'lucide-react';

export default function ProductGrid() {
    const dispatch = useDispatch();
    const { items, searchQuery, selectedCategory, sortBy, loading, error } = useSelector(
        (state) => state.products
    );

    // Fetch from backend API on mount and whenever filters change
    useEffect(() => {
        dispatch(fetchProducts({ category: selectedCategory, search: searchQuery }));
    }, [dispatch, selectedCategory, searchQuery]);

    // Client-side sort (API already filters)
    let displayItems = [...items];
    if (sortBy === 'price-low') displayItems.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') displayItems.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') displayItems.sort((a, b) => b.rating - a.rating);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin text-[#5E6AD2]" />
                    <span className="text-sm font-medium">Loading products from database…</span>
                </div>
            </section>
        );
    }

    return (
        <section id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <CategoryPills />

            {/* Grid Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#0F172A]">Product Catalog</h2>
                    <p className="text-xs text-slate-500">
                        {error
                            ? <span className="text-rose-500">⚠ {error}</span>
                            : `Showing ${displayItems.length} ${displayItems.length === 1 ? 'result' : 'results'}`
                        }
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            {displayItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayItems.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            ) : !error ? (
                <div className="text-center py-16 bg-white border border-[#E5E7EB] rounded-xl p-8 max-w-md mx-auto">
                    <PackageX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0F172A]">No Products Found</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search criteria or selecting a different category.
                    </p>
                </div>
            ) : null}
        </section>
    );
}
