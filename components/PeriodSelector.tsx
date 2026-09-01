'use client';

import { CalendarRange, CalendarDays, CalendarClock, Layers } from 'lucide-react';
import { PeriodFilter, PeriodType, MONTH_NAMES, getPeriodLabel, todayKey } from '@/lib/period';

interface PeriodSelectorProps {
    filter: PeriodFilter;
    onChange: (filter: PeriodFilter) => void;
    /** Number of transactions currently matching the filter, shown as a hint. */
    count: number;
}

const OPTIONS: { type: PeriodType; label: string; icon: React.ReactNode }[] = [
    { type: 'current-month', label: 'Mês atual', icon: <CalendarDays size={16} /> },
    { type: 'month', label: 'Escolher mês', icon: <CalendarClock size={16} /> },
    { type: 'range', label: 'Período', icon: <CalendarRange size={16} /> },
    { type: 'all', label: 'Total', icon: <Layers size={16} /> },
];

export function PeriodSelector({ filter, onChange, count }: PeriodSelectorProps) {
    const now = new Date();
    const selectedMonth = filter.month ?? now.getMonth();
    const selectedYear = filter.year ?? now.getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => now.getFullYear() - 5 + i);

    const handleTypeChange = (type: PeriodType) => {
        if (type === filter.type) return;

        if (type === 'month') {
            onChange({ type, month: selectedMonth, year: selectedYear });
        } else if (type === 'range') {
            onChange({
                type,
                start: filter.start || `${now.getFullYear()}-01-01`,
                end: filter.end || todayKey(),
            });
        } else {
            onChange({ type });
        }
    };

    const inputClass =
        'w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900';

    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-slate-700 dark:text-slate-300">Período dos cálculos</h2>
                <p className="text-xs text-slate-500">
                    {getPeriodLabel(filter)} · {count} {count === 1 ? 'transação' : 'transações'}
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {OPTIONS.map(option => (
                    <button
                        key={option.type}
                        onClick={() => handleTypeChange(option.type)}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${filter.type === option.type
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                            : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800'
                            }`}
                    >
                        {option.icon}
                        <span className="truncate">{option.label}</span>
                    </button>
                ))}
            </div>

            {filter.type === 'month' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Mês</label>
                        <select
                            value={selectedMonth}
                            onChange={e => onChange({ type: 'month', month: Number(e.target.value), year: selectedYear })}
                            className={inputClass}
                        >
                            {MONTH_NAMES.map((month, index) => (
                                <option key={month} value={index}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Ano</label>
                        <select
                            value={selectedYear}
                            onChange={e => onChange({ type: 'month', month: selectedMonth, year: Number(e.target.value) })}
                            className={inputClass}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {filter.type === 'range' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">De</label>
                        <input
                            type="date"
                            value={filter.start || ''}
                            max={filter.end || undefined}
                            onChange={e => onChange({ ...filter, type: 'range', start: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Até</label>
                        <input
                            type="date"
                            value={filter.end || ''}
                            min={filter.start || undefined}
                            onChange={e => onChange({ ...filter, type: 'range', end: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
