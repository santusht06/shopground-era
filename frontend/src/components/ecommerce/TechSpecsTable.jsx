import React from 'react';
import { FileText, Package, Check, Database, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TechSpecsTable({ product }) {
    if (!product) return null;

    const specs = product.tech_specs || {
        "Acoustic Isolation": "High-Density Elastomer Compound",
        "Load Capacity": "800 LB Per Set of 4 Pads",
        "Damping Efficiency": "99.4% Motor Spin Vibration Reduction",
        "Modular Height": "Stackable Design + Leveling Shims",
        "Floor Compatibility": "Hardwood, Tile, Concrete, Laminate",
        "Dimensions": "3.0\" x 3.0\" x 1.2\" per pad",
        "Appliance Fit": "Universal Washer, Dryer, Treadmill, Oven",
        "Included Accessories": "4x Main Pads + 4x Leveling Shims + Mini Level Tool",
    };

    const boxContents = product.box_contents || [
        "4x GroundEra Industrial Elastomer Anti-Vibration Pads",
        "4x Precision Leveling Shims",
        "1x Pocket Mini Spirit Bubble Level Tool",
        "1x Quick Installation & Surface Preparation Manual",
        "1x 2-Year Direct Manufacturer Warranty Card",
    ];

    return (
        <section id="tech-specs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-[#0C0C12] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)] space-y-10 orange-glow-border">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 text-[#F27E24] text-xs font-black uppercase tracking-widest mb-1">
                            <FileText className="w-4 h-4" /> Technical Specifications & Package Audit
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
                            Precision Hardware Technical Datasheet
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Technical Specifications Table */}
                    <div className="lg:col-span-8 space-y-4">
                        <h3 className="text-lg font-black text-white flex items-center gap-2 font-heading">
                            <Zap className="w-4.5 h-4.5 text-[#F27E24]" /> Hardware & Damping Parameters
                        </h3>

                        <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-[#08080D]">
                            <table className="w-full text-xs sm:text-sm text-left text-slate-300">
                                <tbody className="divide-y divide-white/10">
                                    {Object.entries(specs).map(([key, value], idx) => (
                                        <tr key={key} className={idx % 2 === 0 ? 'bg-[#0E0E14]' : 'bg-[#08080D]'}>
                                            <td className="py-3.5 px-4 sm:px-6 font-bold text-white w-2/5 border-r border-white/10 font-heading">
                                                {key}
                                            </td>
                                            <td className="py-3.5 px-4 sm:px-6 text-slate-300 font-medium">
                                                {value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* What's In The Box */}
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="text-lg font-black text-white flex items-center gap-2 font-heading">
                            <Package className="w-4.5 h-4.5 text-[#F27E24]" /> Factory Package Contents
                        </h3>

                        <div className="bg-black/60 border border-white/10 rounded-2xl p-6 space-y-4">
                            <Badge variant="outline" className="bg-[#F27E24]/10 text-[#F27E24] border-[#F27E24]/30 text-[11px] font-black uppercase tracking-wider">
                                Sealed Retail Packaging
                            </Badge>
                            <ul className="space-y-3.5 pt-1 text-xs font-semibold text-slate-200">
                                {boxContents.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-[#F27E24] shrink-0 mt-0.5" />
                                        <span className="leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
