import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProduct } from '@/store/adminSlice';
import { Plus, Trash2, Search, Filter, Package, Flame, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductManagement() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.admin.products);

    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('All');
    const [showModal, setShowModal] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: '',
        subtitle: '',
        price: '',
        originalPrice: '',
        category: 'Electronics',
        stock: '10',
        image: '',
    });

    const filteredProducts = products.filter((p) => {
        const matchesCat = selectedCat === 'All' || p.category === selectedCat;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const handleCreateProduct = (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;
        
        const created = {
            id: `prod-${Math.floor(100 + Math.random() * 900)}`,
            name: newProduct.name,
            subtitle: newProduct.subtitle || 'Lorem Ipsum product tagline',
            price: parseFloat(newProduct.price),
            originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : parseFloat(newProduct.price) * 1.2,
            category: newProduct.category,
            stock: parseInt(newProduct.stock, 10),
            image: newProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
            status: 'Active',
        };

        dispatch(addProduct(created));
        setShowModal(false);
        setNewProduct({ name: '', subtitle: '', price: '', originalPrice: '', category: 'Electronics', stock: '10', image: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">Product Inventory Center</h1>
                    <p className="text-xs text-[#6B7280]">Manage catalog items, pricing, and stock levels across categories.</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                >
                    <Plus className="w-4 h-4" /> Add New Product
                </Button>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-xs">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search product title or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 text-xs bg-[#F4F5F8] border-[#E5E7EB] h-9"
                    />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                    <span className="text-slate-500 font-semibold">Category:</span>
                    <select
                        value={selectedCat}
                        onChange={(e) => setSelectedCat(e.target.value)}
                        className="bg-[#F4F5F8] border border-[#E5E7EB] rounded-lg text-xs py-1.5 px-3 font-semibold text-slate-800 focus:ring-1 focus:ring-[#5E6AD2]"
                    >
                        <option value="All">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                    </select>
                </div>
            </div>

            {/* Inventory Data Table */}
            <Card className="bg-white border-[#E5E7EB] shadow-xs">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F4F5F8] text-slate-500 font-semibold border-b border-[#E5E7EB]">
                                <tr>
                                    <th className="py-3.5 px-6">Product Details</th>
                                    <th className="py-3.5 px-6">Category</th>
                                    <th className="py-3.5 px-6">Price ($)</th>
                                    <th className="py-3.5 px-6">Stock Status</th>
                                    <th className="py-3.5 px-6">Availability</th>
                                    <th className="py-3.5 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3.5 px-6 flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                                            <div>
                                                <p className="font-bold text-slate-900">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{product.id}</p>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-6 font-medium text-slate-600">{product.category}</td>
                                        <td className="py-3.5 px-6 font-extrabold text-[#0F172A]">${product.price.toFixed(2)}</td>
                                        <td className="py-3.5 px-6 font-semibold text-slate-700">
                                            {product.stock <= 10 ? (
                                                <span className="text-amber-600 font-bold flex items-center gap-1">
                                                    <Flame className="w-3.5 h-3.5" /> Low ({product.stock})
                                                </span>
                                            ) : (
                                                <span>{product.stock} units</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <Badge variant="success" className="text-[10px]">Active</Badge>
                                        </td>
                                        <td className="py-3.5 px-6 text-right">
                                            <button
                                                onClick={() => dispatch(deleteProduct(product.id))}
                                                className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
                        <h3 className="text-base font-bold text-[#0F172A]">Add New Product to Inventory</h3>
                        <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                            <div>
                                <label className="font-semibold text-slate-700">Product Title</label>
                                <Input
                                    placeholder="e.g. Lorem Ultra Headphones"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700">Price ($)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="199.99"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                        className="text-xs mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700">Category</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full h-9 rounded-md border border-[#E5E7EB] bg-white px-3 py-1 text-xs mt-1 focus:ring-1 focus:ring-[#5E6AD2]"
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Home & Kitchen">Home & Kitchen</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Image URL</label>
                                <Input
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div className="pt-3 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="text-xs">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-[#5E6AD2] text-white text-xs font-semibold">
                                    Save Product
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
