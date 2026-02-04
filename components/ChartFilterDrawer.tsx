'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export interface ChartPeriodFilter {
    type: 'days' | 'month';
    value: number | { month: number; year: number };
    label: string;
}

interface ChartFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (filter: ChartPeriodFilter) => void;
    currentFilter: ChartPeriodFilter;
}

export function ChartFilterDrawer({ isOpen, onClose, onSelect, currentFilter }: ChartFilterDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSelect = (filter: ChartPeriodFilter) => {
        onSelect(filter);
        handleClose();
    };

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/50 flex items-end justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleClose}
        >
            <Card
                className={`w-full max-w-2xl rounded-t-2xl rounded-b-none transition-transform duration-300 max-h-[50vh] overflow-auto ${isVisible ? 'translate-y-0' : 'translate-y-full'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader className="border-b pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                            <Calendar size={20} />
                            Filtrar Período
                        </CardTitle>
                        <button
                            onClick={handleClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            ✕
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                    {/* Quick Options */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Últimos Dias</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={currentFilter.type === 'days' && currentFilter.value === 7 ? 'default' : 'outline'}
                                onClick={() => handleSelect({ type: 'days', value: 7, label: 'Últimos 7 dias' })}
                                className="text-sm"
                            >
                                7 Dias
                            </Button>
                            <Button
                                variant={currentFilter.type === 'days' && currentFilter.value === 15 ? 'default' : 'outline'}
                                onClick={() => handleSelect({ type: 'days', value: 15, label: 'Últimos 15 dias' })}
                                className="text-sm"
                            >
                                15 Dias
                            </Button>
                        </div>
                    </div>

                    {/* Month/Year Selector */}
                    <div>
                        <h3 className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Selecionar Mês e Ano</h3>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Mês</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
                                >
                                    {months.map((month, index) => (
                                        <option key={index} value={index}>{month}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Ano</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900"
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSelect({
                                type: 'month',
                                value: { month: selectedMonth, year: selectedYear },
                                label: `${months[selectedMonth]} ${selectedYear}`
                            })}
                            className="w-full text-sm"
                        >
                            Aplicar Mês: {months[selectedMonth]} {selectedYear}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
