import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProduct } from '@/store/adminSlice';
import { uploadImageToCloudinary } from '@/services/cloudinaryService';
import { Plus, Trash2, Search, Filter, Package, Flame, CheckCircle, UploadCloud, Loader2 } from 'lucide-react';
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
    const [uploadingImage, setUploadingImage] = useState(false);

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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const uploadedMedia = await uploadImageToCloudinary(file, 'shopground/products');
            setNewProduct(prev => ({ ...prev, image: uploadedMedia.url }));
        } catch (error) {
            console.error('Failed to upload image to Cloudinary:', error);
        } finally {
            setUploadingImage(false);
        }
    };

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
                    <p className="text-xs text-[#6B7280]">Manage catalog items, pricing, Cloudinary media assets, and stock levels.</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="gradient-btn-primary font-bold text-xs flex items-center gap-2 rounded-xl px-4 py-2"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <Card className="border border-[#E5E7EB]">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <Input
                            placeholder="Search by title or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 text-xs"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                        {['All', 'Electronics', 'Fashion', 'Furniture', 'Accessories'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCat(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                                    selectedCat === cat
                                        ? 'bg-[#5E6AD2] text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Product Grid Table */}
            <Card className="border border-[#E5E7EB]">
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-slate-700 font-bold uppercase text-[10px]">
                            <tr>
                                <th className="p-4">Product Info</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                        />
                                        <div>
                                            <span className="font-bold text-[#0F172A] block">{product.name}</span>
                                            <span className="text-[10px] text-slate-400">{product.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">{product.category}</td>
                                    <td className="p-4 font-bold text-[#5E6AD2]">${product.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        <Badge
                                            variant={product.stock <= 5 ? 'warning' : 'outline'}
                                            className="text-[10px]"
                                        >
                                            {product.stock} in stock
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                            <CheckCircle className="w-3 h-3" /> {product.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => dispatch(deleteProduct(product.id))}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                <label className="font-semibold text-slate-700">Product Image (Cloudinary Upload)</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <Input
                                        placeholder="https://res.cloudinary.com/..."
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        className="text-xs flex-1"
                                    />
                                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 border border-slate-200 transition-colors">
                                        {uploadingImage ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <UploadCloud className="w-3.5 h-3.5 text-[#5E6AD2]" />
                                        )}
                                        <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>
                                {newProduct.image && (
                                    <img
                                        src={newProduct.image}
                                        alt="Preview"
                                        className="mt-2 w-16 h-16 rounded-lg object-cover border border-slate-200"
                                    />
                                )}
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
