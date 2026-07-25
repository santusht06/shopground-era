import React from 'react';
import { useSelector } from 'react-redux';
import { FileText, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AuditLogsView() {
    const auditLogs = useSelector((state) => state.admin.auditLogs);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A]">Real-Time System Audit Logs</h1>
                <p className="text-xs text-slate-500">Live immutable activity trail recording all admin actions and configuration changes.</p>
            </div>

            <Card className="bg-white border-[#E5E7EB]">
                <CardHeader>
                    <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#5E6AD2]" /> System Event Stream ({auditLogs.length})
                    </CardTitle>
                    <CardDescription className="text-xs">Security events logged per admin session.</CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 text-xs">
                        {auditLogs.map((log) => (
                            <div key={log.id} className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-slate-800 border-slate-300 font-mono text-[10px]">
                                            {log.role}
                                        </Badge>
                                        <span className="font-bold text-[#0F172A]">{log.action}</span>
                                        <span className="text-slate-400 font-mono text-[11px]">by {log.user}</span>
                                    </div>
                                    <p className="text-slate-600 text-xs font-medium">{log.details}</p>
                                </div>

                                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 whitespace-nowrap">
                                    <Clock className="w-3.5 h-3.5 text-[#5E6AD2]" /> {log.timestamp}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
