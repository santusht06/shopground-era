import React from 'react';
import { Send, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#E5E7EB] pt-12 pb-8 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#5E6AD2] text-white flex items-center justify-center font-bold text-sm">
                                S
                            </div>
                            <span className="text-base font-bold text-[#0F172A]">ShopGround ERA</span>
                        </div>
                        <p className="leading-relaxed">
                            Static E-Commerce Platform built with React, Vite, Redux Toolkit, and Tailwind CSS. Design system copied from cloud.sharexpress.in light theme.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-3">Shop Categories</h4>
                        <ul className="space-y-2">
                            <li><a href="#product-catalog" className="hover:text-[#5E6AD2] transition-colors">Electronics & Audio</a></li>
                            <li><a href="#product-catalog" className="hover:text-[#5E6AD2] transition-colors">Fashion & Apparel</a></li>
                            <li><a href="#product-catalog" className="hover:text-[#5E6AD2] transition-colors">Ergonomic Furniture</a></li>
                            <li><a href="#product-catalog" className="hover:text-[#5E6AD2] transition-colors">Accessories & Watches</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-3">Customer Service</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-[#5E6AD2] transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-[#5E6AD2] transition-colors">30-Day Money Back Guarantee</a></li>
                            <li><a href="#" className="hover:text-[#5E6AD2] transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[#5E6AD2] transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-1">Newsletter</h4>
                        <p>Subscribe to receive lorem ipsum product updates and discount coupons.</p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="bg-[#F4F5F8] border-[#E5E7EB] text-xs h-9" />
                            <Button size="sm" className="bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white">
                                <Send className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                </div>

                <div className="border-t border-[#E5E7EB] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <p>© 2026 ShopGround Era. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <span className="font-mono text-[11px]">Linear Light Theme #F4F5F8</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
