import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory, setSortBy } from '@/store/slices/productsSlice';
import { SlidersHorizontal } from 'lucide-react';

const categories = ['All', 'Audio Gear', 'Electronics', 'Active Noise Cancelling', 'Wireless Audio'];

export default function CategoryPills() {
    const dispatch = useDispatch();
    const selectedCategory = useSelector((state) => state.products.selectedCategory);
    const sortBy = useSelector((state) => state.products.sortBy);

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB] mb-8">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => dispatch(setSelectedCategory(category))}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            selectedCategory === category
                                ? 'bg-[#5E6AD2] text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-[#E5E7EB] hover:border-slate-300 hover:text-slate-900'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 self-end sm:self-auto">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Sort by:</span>
                <select
                    value={sortBy}
                    onChange={(e) => dispatch(setSortBy(e.target.value))}
                    className="bg-white border border-[#E5E7EB] text-slate-800 rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-[#5E6AD2]"
                >
                    <option value="featured">Featured Audio Items</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                </select>
            </div>
        </div>
    );
}
