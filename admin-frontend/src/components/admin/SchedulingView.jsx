import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCampaign, toggleCampaignStatus } from '@/store/adminSlice';
import { Calendar, Plus, Tag, Flame, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SchedulingView() {
    const dispatch = useDispatch();
    const campaigns = useSelector((state) => state.admin.campaigns);

    const [showModal, setShowModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        discountPercent: '20',
        code: 'FLASH20',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-08-01',
        bannerText: '🔥 Mega Flash Sale: 20% Off All Categories',
    });

    const handleCreateCampaign = (e) => {
        e.preventDefault();
        if (!newCampaign.name) return;

        dispatch(addCampaign({
            id: `cmp-${Date.now()}`,
            name: newCampaign.name,
            discountPercent: parseInt(newCampaign.discountPercent, 10),
            code: newCampaign.code.toUpperCase(),
            startDate: newCampaign.startDate,
            endDate: newCampaign.endDate,
            status: 'Active',
            bannerText: newCampaign.bannerText,
        }));

        setShowModal(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0F172A]">Flash Sales & Campaign Scheduling</h1>
                    <p className="text-xs text-slate-500">Automate time-bounded promotional discounts and banner announcements.</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-[#5E6AD2] text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                >
                    <Plus className="w-4 h-4" /> Schedule Campaign
                </Button>
            </div>

            {/* Campaign Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {campaigns.map((cmp) => (
                    <Card key={cmp.id} className="bg-white border-[#E5E7EB] p-5 space-y-3 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-[#5E6AD2]" />
                                <span className="font-bold text-[#0F172A] text-base">{cmp.name}</span>
                            </div>
                            <Badge
                                variant={cmp.status === 'Active' ? 'success' : 'secondary'}
                                className={cmp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : ''}
                            >
                                {cmp.status}
                            </Badge>
                        </div>

                        <div className="bg-[#F4F5F8] p-3 rounded-xl border border-[#E5E7EB] space-y-1 text-xs">
                            <p className="text-slate-700 font-semibold">{cmp.bannerText}</p>
                            <p className="text-slate-500">
                                Promo Code: <strong className="text-[#5E6AD2] font-mono">{cmp.code}</strong> ({cmp.discountPercent}% Off)
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-[#5E6AD2]" />
                                {cmp.startDate} to {cmp.endDate}
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dispatch(toggleCampaignStatus(cmp.id))}
                                className="text-xs border-[#E5E7EB]"
                            >
                                {cmp.status === 'Active' ? 'Pause Sale' : 'Activate Sale'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Add Campaign Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 w-full max-w-lg space-y-4">
                        <h3 className="text-base font-bold text-[#0F172A]">Schedule New Promotional Campaign</h3>
                        <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
                            <div>
                                <label className="font-semibold text-slate-700">Campaign Name</label>
                                <Input
                                    placeholder="e.g. Big Billion Days Sale"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    required
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700">Discount (%)</label>
                                    <Input
                                        type="number"
                                        value={newCampaign.discountPercent}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, discountPercent: e.target.value })}
                                        required
                                        className="text-xs mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700">Promo Code</label>
                                    <Input
                                        placeholder="FLASH20"
                                        value={newCampaign.code}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, code: e.target.value })}
                                        required
                                        className="text-xs mt-1 font-mono uppercase"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700">Start Date</label>
                                    <Input
                                        type="date"
                                        value={newCampaign.startDate}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                                        required
                                        className="text-xs mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700">End Date</label>
                                    <Input
                                        type="date"
                                        value={newCampaign.endDate}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                                        required
                                        className="text-xs mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700">Banner Announcement Text</label>
                                <Input
                                    placeholder="🔥 Mega Flash Sale Announcement"
                                    value={newCampaign.bannerText}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, bannerText: e.target.value })}
                                    className="text-xs mt-1"
                                />
                            </div>

                            <div className="pt-3 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="text-xs">
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-[#5E6AD2] text-white text-xs font-semibold">
                                    Schedule Flash Sale
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
