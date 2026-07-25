import React from 'react';
import { useSelector } from 'react-redux';
import { Shield, Globe, Database, Server, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SettingsView() {
    const { apiEndpoint, backendCorsDomain } = useSelector((state) => state.admin);

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">System & CORS Configuration</h1>
                <p className="text-xs text-slate-500">Production domain bindings and API integration diagnostics.</p>
            </div>

            <Card className="bg-white border-[#E5E7EB]">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#5E6AD2]" /> Production Domain Setup
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Configured for pointing to <strong>admin.myapp.com</strong> in production deployment.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-xs">
                    <div className="bg-[#F4F5F8] p-4 rounded-xl border border-[#E5E7EB] space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-700">Target Production Host:</span>
                            <code className="bg-white px-2.5 py-1 rounded border border-[#E5E7EB] font-mono text-[#5E6AD2] font-bold">
                                admin.myapp.com
                            </code>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-700">Shared Backend API:</span>
                            <code className="bg-white px-2.5 py-1 rounded border border-[#E5E7EB] font-mono text-slate-800">
                                {apiEndpoint}
                            </code>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-700">CORS Allowed Headers:</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Configured in backend (config.py)
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB]">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                        <Database className="w-4 h-4 text-[#5E6AD2]" /> Database & Cache Connections
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-[#5E6AD2]" />
                            <div>
                                <p className="font-semibold text-slate-800">MongoDB Async (Motor)</p>
                                <p className="text-[10px] text-slate-400">mongodb://localhost:27017/shopground_db</p>
                            </div>
                        </div>
                        <span className="text-emerald-600 font-bold">Ready</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-[#5E6AD2]" />
                            <div>
                                <p className="font-semibold text-slate-800">Redis Cache</p>
                                <p className="text-[10px] text-slate-400">redis://localhost:6379/0</p>
                            </div>
                        </div>
                        <span className="text-emerald-600 font-bold">Ready</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
