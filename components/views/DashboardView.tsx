'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { KPICard } from '@/components/KPICard';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Filter } from 'lucide-react';
import { Transaction, Totals } from '@/lib/types';
import { formatBRL } from '@/lib/currency';
import { getChartData } from '@/lib/chart';
import { ChartFilterDrawer, ChartPeriodFilter } from '@/components/ChartFilterDrawer';

interface DashboardViewProps {
    totals: Totals;
    finalBalance: number;
    transactions: Transaction[];
}

export function DashboardView({ totals, finalBalance, transactions }: DashboardViewProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [chartFilter, setChartFilter] = useState<ChartPeriodFilter>({
        type: 'days',
        value: 7,
        label: 'Últimos 7 dias'
    });

    const chartData = getChartData(transactions, chartFilter.type, chartFilter.value);
    const isLineChart = chartData.length > 15;

    const handleFilterSelect = (filter: ChartPeriodFilter) => {
        setChartFilter(filter);
    };

    // Generate SVG path for line chart
    const generatePath = () => {
        if (chartData.length === 0) return '';

        const width = 100;
        const height = 100;
        const stepX = width / (chartData.length - 1 || 1);

        return chartData.map((bar, i) => {
            const x = i * stepX;
            const y = height - bar.height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    // Generate SVG area path (line + bottom)
    const generateAreaPath = () => {
        if (chartData.length === 0) return '';

        const width = 100;
        const height = 100;
        const stepX = width / (chartData.length - 1 || 1);

        let path = chartData.map((bar, i) => {
            const x = i * stepX;
            const y = height - bar.height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        // Close the path at bottom
        path += ` L ${width} ${height} L 0 ${height} Z`;
        return path;
    };

    return (
        <div className="space-y-6">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    title="Saldo Final"
                    value={formatBRL(finalBalance)}
                    icon={<DollarSign className="text-slate-500" />}
                    subtext="Disponível em conta"
                    highlight={true}
                />
                <KPICard
                    title="Entradas (Salário)"
                    value={formatBRL(totals.income)}
                    icon={<TrendingUp className="text-green-500" />}
                    color="text-green-600 dark:text-green-400"
                />
                <KPICard
                    title="Saídas (Dívidas)"
                    value={formatBRL(totals.expense)}
                    icon={<TrendingDown className="text-red-500" />}
                    color="text-red-600 dark:text-red-400"
                />
                <KPICard
                    title="Investido no Mês"
                    value={formatBRL(totals.investment)}
                    icon={<PiggyBank className="text-blue-500" />}
                    color="text-blue-600 dark:text-blue-400"
                    subtext="Reservado para o futuro"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* REAL DATA CHART WITH FILTER */}
                <Card className="col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-base md:text-lg">Fluxo de Caixa</CardTitle>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Filtrar período"
                        >
                            <Filter size={18} className="text-slate-600 dark:text-slate-400" />
                        </button>
                    </CardHeader>
                    <CardContent className="px-3 md:px-6">
                        {isLineChart ? (
                            // LINE CHART for > 15 days
                            <div className="h-64 relative">
                                <svg
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    className="w-full h-full"
                                >
                                    {/* Gradient definition */}
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
                                        </linearGradient>
                                    </defs>

                                    {/* Area under the line */}
                                    <path
                                        d={generateAreaPath()}
                                        fill="url(#chartGradient)"
                                        className="transition-all duration-300"
                                    />

                                    {/* Line */}
                                    <path
                                        d={generatePath()}
                                        fill="none"
                                        stroke="rgb(59, 130, 246)"
                                        strokeWidth="0.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="transition-all duration-300"
                                    />

                                    {/* Data points */}
                                    {chartData.map((bar, i) => {
                                        const stepX = 100 / (chartData.length - 1 || 1);
                                        const x = i * stepX;
                                        const y = 100 - bar.height;
                                        return (
                                            <circle
                                                key={i}
                                                cx={x}
                                                cy={y}
                                                r="1"
                                                fill="rgb(59, 130, 246)"
                                                className="hover:r-2 cursor-pointer transition-all"
                                            >
                                                <title>{`${new Date(bar.date).toLocaleDateString('pt-BR')}: ${formatBRL(bar.total)}`}</title>
                                            </circle>
                                        );
                                    })}
                                </svg>
                            </div>
                        ) : (
                            // BAR CHART for <= 15 days
                            <div className="h-64 flex items-end gap-1 justify-between pb-4 border-b border-l border-slate-200 dark:border-slate-700">
                                {chartData.map((bar, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 min-w-[8px] bg-linear-to-t ${bar.color} rounded-t-md opacity-90 hover:opacity-100 transition-all cursor-pointer shadow-sm relative group`}
                                        style={{ height: `${bar.height}%` }}
                                        title={`${new Date(bar.date).toLocaleDateString('pt-BR')}: ${formatBRL(bar.total)}`}
                                    >
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap left-1/2 -translate-x-1/2 z-10">
                                            {formatBRL(bar.total)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-center text-slate-500 mt-2">{chartFilter.label}</p>
                    </CardContent>
                </Card>

                {/* RECENT TRANSACTIONS */}
                <Card className="max-md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base md:text-lg">Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {transactions.slice(0, 5).map(t => (
                                <div key={t.id} className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{t.description}</p>
                                        <p className="text-xs text-slate-500">{t.category}</p>
                                    </div>
                                    <p className={`text-sm font-bold ml-2 shrink-0 ${t.type === 'income' ? 'text-green-600 dark:text-green-400' :
                                        t.type === 'expense' ? 'text-red-600 dark:text-red-400' :
                                            'text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {t.type === 'expense' ? '-' : '+'} {formatBRL(t.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FILTER DRAWER */}
            <ChartFilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onSelect={handleFilterSelect}
                currentFilter={chartFilter}
            />
        </div>
    );
}
