import { Transaction, Totals } from './types';

export type PeriodType = 'current-month' | 'month' | 'range' | 'all';

export interface PeriodFilter {
    type: PeriodType;
    /** 0-11, used when type === 'month' */
    month?: number;
    /** used when type === 'month' */
    year?: number;
    /** YYYY-MM-DD, used when type === 'range' */
    start?: string;
    /** YYYY-MM-DD, used when type === 'range' */
    end?: string;
}

export const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const pad2 = (value: number): string => String(value).padStart(2, '0');

/** Local (not UTC) YYYY-MM-DD for a Date */
export function toDateKey(date: Date): string {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayKey(): string {
    return toDateKey(new Date());
}

/**
 * First and last day of a month as YYYY-MM-DD strings.
 * Transaction dates are stored as YYYY-MM-DD, so comparing strings avoids the
 * timezone shift that `new Date('YYYY-MM-DD')` introduces (it parses as UTC).
 */
function monthBounds(month: number, year: number): { start: string; end: string } {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return {
        start: `${year}-${pad2(month + 1)}-01`,
        end: `${year}-${pad2(month + 1)}-${pad2(lastDay)}`,
    };
}

/** Inclusive bounds of a filter, or null/null when it covers everything. */
export function getPeriodBounds(filter: PeriodFilter): { start: string | null; end: string | null } {
    switch (filter.type) {
        case 'current-month': {
            const now = new Date();
            return monthBounds(now.getMonth(), now.getFullYear());
        }
        case 'month': {
            const now = new Date();
            return monthBounds(filter.month ?? now.getMonth(), filter.year ?? now.getFullYear());
        }
        case 'range':
            return { start: filter.start || null, end: filter.end || null };
        case 'all':
        default:
            return { start: null, end: null };
    }
}

export function filterTransactionsByPeriod(transactions: Transaction[], filter: PeriodFilter): Transaction[] {
    const { start, end } = getPeriodBounds(filter);
    if (!start && !end) return transactions;

    return transactions.filter(t => {
        if (!t.date) return false;
        if (start && t.date < start) return false;
        if (end && t.date > end) return false;
        return true;
    });
}

export function calculateTotals(transactions: Transaction[]): Totals {
    return transactions.reduce<Totals>((acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        if (curr.type === 'expense') acc.expense += curr.amount;
        if (curr.type === 'investment') acc.investment += curr.amount;
        return acc;
    }, { income: 0, expense: 0, investment: 0 });
}

const formatDateKey = (key: string): string => {
    const [year, month, day] = key.split('-');
    return `${day}/${month}/${year}`;
};

export function getPeriodLabel(filter: PeriodFilter): string {
    switch (filter.type) {
        case 'current-month': {
            const now = new Date();
            return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
        }
        case 'month': {
            const now = new Date();
            return `${MONTH_NAMES[filter.month ?? now.getMonth()]} ${filter.year ?? now.getFullYear()}`;
        }
        case 'range': {
            if (filter.start && filter.end) return `${formatDateKey(filter.start)} até ${formatDateKey(filter.end)}`;
            if (filter.start) return `A partir de ${formatDateKey(filter.start)}`;
            if (filter.end) return `Até ${formatDateKey(filter.end)}`;
            return 'Período personalizado';
        }
        case 'all':
        default:
            return 'Todas as transações';
    }
}

/** Short suffix used in KPI titles, e.g. "Investido no Mês" vs "Investido no Período". */
export function getPeriodSuffix(filter: PeriodFilter): string {
    switch (filter.type) {
        case 'current-month':
        case 'month':
            return 'no Mês';
        case 'range':
            return 'no Período';
        case 'all':
        default:
            return 'no Total';
    }
}
