import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface KPICardProps {
    title: string;
    value: string;
    icon: ReactNode;
    subtext?: string;
    color?: string;
    highlight?: boolean;
}

export function KPICard({ title, value, icon, subtext, color = "text-slate-900 dark:text-white", highlight = false }: KPICardProps) {
    return (
        <Card className={highlight ? "border-slate-400 shadow-md" : ""}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                    {icon}
                </div>
                <div className={`text-2xl font-bold ${color}`}>
                    {value}
                </div>
                {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
            </CardContent>
        </Card>
    );
}
