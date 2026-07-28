import React from 'react';

export function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`animate-pulse rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden ${className}`}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-[#050507] text-[#F8FAFC]">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-32 rounded-lg" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-24 rounded-xl" />
            </div>

            {/* Split Product Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Gallery Skeleton */}
                <div className="lg:col-span-7 space-y-4">
                    <Skeleton className="aspect-4/3 rounded-3xl w-full" />
                    <div className="grid grid-cols-4 gap-3">
                        <Skeleton className="aspect-square rounded-2xl" />
                        <Skeleton className="aspect-square rounded-2xl" />
                        <Skeleton className="aspect-square rounded-2xl" />
                        <Skeleton className="aspect-square rounded-2xl" />
                    </div>
                </div>

                {/* Right: Info & Price Skeleton */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-3/4 rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-2xl" />
                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                    </div>

                    <Skeleton className="h-20 w-full rounded-2xl" />

                    <div className="p-5 bg-[#0C0C12] border border-white/10 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-28 rounded-lg" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-10 w-40 rounded-xl" />
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex gap-3">
                            <Skeleton className="h-12 w-32 rounded-2xl" />
                            <Skeleton className="h-12 flex-1 rounded-2xl" />
                        </div>
                        <Skeleton className="h-13 w-full rounded-2xl" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                        <Skeleton className="h-16 rounded-2xl" />
                        <Skeleton className="h-16 rounded-2xl" />
                        <Skeleton className="h-16 rounded-2xl" />
                    </div>
                </div>
            </div>

            {/* Technical Datasheet Table Skeleton */}
            <div className="bg-[#0C0C12] border border-white/10 rounded-3xl p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <Skeleton className="h-8 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-32 rounded-lg" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="relative bg-[#050507] pt-4 pb-8 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-[#0C0C12] rounded-3xl p-8 sm:p-12 border border-white/10 min-h-[540px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <Skeleton className="h-6 w-40 rounded-full" />
                        <Skeleton className="h-14 w-full rounded-2xl" />
                        <Skeleton className="h-14 w-4/5 rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <div className="flex gap-3 pt-2">
                            <Skeleton className="h-13 w-44 rounded-xl" />
                            <Skeleton className="h-13 w-36 rounded-xl" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="aspect-4/3 rounded-2xl w-full" />
                        <div className="flex gap-2">
                            <Skeleton className="h-14 flex-1 rounded-xl" />
                            <Skeleton className="h-14 flex-1 rounded-xl" />
                            <Skeleton className="h-14 flex-1 rounded-xl" />
                            <Skeleton className="h-14 flex-1 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
