import React, { useEffect, useState } from 'react';
import { Radio, Users, PackageCheck, Zap } from 'lucide-react';

export default function LiveSSEBanner() {
    const [sseData, setSseData] = useState({
        stock_remaining: 1500,
        active_viewers: 28,
        last_order_location: 'Chicago, IL',
    });
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const sseUrl = typeof window !== 'undefined' && window.location.hostname.includes('shopgroundera.com')
            ? 'https://api.shopgroundera.com/api/v1/sse/inventory'
            : 'http://localhost:8000/api/v1/sse/inventory';

        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener('inventory_update', (e) => {
            try {
                const parsed = JSON.parse(e.data);
                setSseData(parsed);
                setConnected(true);
            } catch (err) {
                console.error('Failed to parse SSE event:', err);
            }
        });

        eventSource.onerror = () => {
            setConnected(false);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="bg-[#0C0C12] border-b border-white/10 text-xs text-slate-300 py-2 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F27E24] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F27E24]" />
                    </span>
                    <span className="font-bold text-white uppercase tracking-wider text-[11px] font-heading">
                        SSE Real-Time Stream
                    </span>
                    <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">
                        [{connected ? 'Connected Live' : 'Streaming'}]
                    </span>
                </div>

                <div className="flex items-center gap-6 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <Users className="w-3.5 h-3.5 text-[#F27E24]" />
                        <span><strong className="text-white font-bold">{sseData.active_viewers}</strong> prospective buyers viewing page</span>
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 text-slate-300">
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Recent sample order dispatched to <strong className="text-white font-bold">{sseData.last_order_location}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{sseData.stock_remaining} Units In Stock</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
