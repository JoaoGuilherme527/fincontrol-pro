import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Transaction, Totals } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/backup';
import { calculateTotals } from '@/lib/period';

export function useTransactions() {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>(STORAGE_KEYS.transactions, []);

    const totals = useMemo<Totals>(() => calculateTotals(transactions), [transactions]);

    const finalBalance = totals.income - totals.expense - totals.investment;

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now(), // Simple ID generation
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const updateTransaction = (id: number, changes: Omit<Transaction, 'id'>) => {
        setTransactions(prev => prev.map(t => (t.id === id ? { ...changes, id } : t)));
    };

    const deleteTransaction = (id: number) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    return {
        transactions,
        totals,
        finalBalance,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setTransactions,
    };
}
