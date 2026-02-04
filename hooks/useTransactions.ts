import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Transaction, Totals } from '@/lib/types';

// Helper function to get date N days ago
const getDaysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

// Mock transactions with RECENT dates (last 7 days) for testing the chart
// const MOCK_TRANSACTIONS: Transaction[] = [
//     { id: 1, description: "Salário Mensal", amount: 5500, type: "income", date: getDaysAgo(6), category: "Salário" },
//     { id: 2, description: "Freelance - Projeto Web", amount: 1200, type: "income", date: getDaysAgo(4), category: "Freelance" },
//     { id: 3, description: "Aluguel", amount: 1800, type: "expense", date: getDaysAgo(5), category: "Moradia" },
//     { id: 4, description: "Supermercado Extra", amount: 450, type: "expense", date: getDaysAgo(3), category: "Alimentação" },
//     { id: 5, description: "Uber e Gasolina", amount: 320, type: "expense", date: getDaysAgo(2), category: "Transporte" },
//     { id: 6, description: "Plano de Saúde", amount: 280, type: "expense", date: getDaysAgo(6), category: "Saúde" },
//     { id: 7, description: "Curso Online", amount: 150, type: "expense", date: getDaysAgo(4), category: "Educação" },
//     { id: 8, description: "Netflix + Spotify", amount: 45, type: "expense", date: getDaysAgo(1), category: "Lazer" },
//     { id: 9, description: "Compra de Ações", amount: 500, type: "investment", date: getDaysAgo(3), category: "Ações" },
//     { id: 10, description: "Tesouro Direto", amount: 300, type: "investment", date: getDaysAgo(2), category: "Tesouro Direto" },
//     { id: 11, description: "Restaurante", amount: 180, type: "expense", date: getDaysAgo(1), category: "Alimentação" },
//     { id: 12, description: "Academia", amount: 120, type: "expense", date: getDaysAgo(5), category: "Saúde" },
//     { id: 13, description: "Roupas", amount: 350, type: "expense", date: getDaysAgo(0), category: "Vestuário" },
//     { id: 14, description: "Fundo Imobiliário", amount: 400, type: "investment", date: getDaysAgo(4), category: "Fundos Imobiliários" },
// ];

export function useTransactions() {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('fincontrol-transactions', []);

    const totals = useMemo<Totals>(() => {
        return transactions.reduce((acc, curr) => {
            if (curr.type === 'income') acc.income += curr.amount;
            if (curr.type === 'expense') acc.expense += curr.amount;
            if (curr.type === 'investment') acc.investment += curr.amount;
            return acc;
        }, { income: 0, expense: 0, investment: 0 });
    }, [transactions]);

    const finalBalance = totals.income - totals.expense - totals.investment;

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now(), // Simple ID generation
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id: number) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    return {
        transactions,
        totals,
        finalBalance,
        addTransaction,
        deleteTransaction,
    };
}
