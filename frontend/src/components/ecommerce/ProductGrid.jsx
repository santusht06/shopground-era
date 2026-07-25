import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import CategoryPills from './CategoryPills';
import { PackageX } from 'lucide-react';

export default function ProductGrid() {
    const { items, searchQuery, selectedCategory, sortBy } = useSelector((state) => state.products);

    // Filter Logic
    let filteredItems = items.filter((product) => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort Logic
    if (sortBy === 'price-low') {
        filteredItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredItems.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        filteredItems.sort((a, b) => b.rating - a.rating);
    }

    return (
        <section id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <CategoryPills />

            {/* Grid Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#0F172A]">Curated Product Catalog</h2>
                    <p className="text-xs text-slate-500">
                        Showing {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-[#E5E7EB] rounded-xl p-8 max-w-md mx-auto">
                    <PackageX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0F172A]">No Products Found</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search criteria or selecting a different category filter.
                    </p>
                </div>
            )}
        </section>
    );
}
