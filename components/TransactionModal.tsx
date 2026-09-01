'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, TransactionType } from '@/lib/types';
import { todayKey } from '@/lib/period';

export interface TransactionFormValues {
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
}

interface TransactionModalProps {
    onClose: () => void;
    onSubmit: (transaction: TransactionFormValues) => void;
    categoryNames: {
        income: string[];
        expense: string[];
        investment: string[];
    };
    /** When provided the modal edits this transaction instead of creating a new one. */
    transaction?: Transaction | null;
}

export function TransactionModal({ onClose, onSubmit, categoryNames, transaction }: TransactionModalProps) {
    const isEditing = Boolean(transaction);

    const [formData, setFormData] = useState({
        description: transaction?.description ?? '',
        amount: transaction ? String(transaction.amount) : '',
        type: (transaction?.type ?? 'expense') as TransactionType,
        category: transaction?.category ?? '',
        date: transaction?.date ?? todayKey()
    });
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const description = formData.description.trim();
        const amount = parseFloat(formData.amount);

        if (!description) return setError('Informe uma descrição.');
        if (!formData.amount || Number.isNaN(amount) || amount <= 0) return setError('Informe um valor maior que zero.');
        if (!formData.date) return setError('Informe uma data.');
        if (!formData.category) return setError('Selecione uma categoria.');

        setError('');
        onSubmit({ ...formData, description, amount });
    };

    const getCategoryOptions = (): string[] => {
        const options = categoryNames[formData.type] ?? [];
        // Keep the saved category selectable even if it was renamed or removed later
        if (formData.category && !options.includes(formData.category)) {
            return [formData.category, ...options];
        }
        return options;
    };

    const handleTypeChange = (type: TransactionType) => {
        const newCategories = categoryNames[type] ?? [];

        setFormData(prev => ({
            ...prev,
            type,
            // The old category belongs to the previous type, so pick a valid one
            category: newCategories.includes(prev.category) ? prev.category : (newCategories[0] || '')
        }));
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleClose}
        >
            <Card
                className={`w-full max-w-md transition-all duration-200 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                        {isEditing ? 'Editar Movimentação' : 'Nova Movimentação'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                        <div>
                            <label className="text-xs md:text-sm font-medium mb-1 block">Tipo</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('income')}
                                    className={`p-2 text-xs md:text-sm rounded border transition-all ${formData.type === 'income' ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 scale-105' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Entrada
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('expense')}
                                    className={`p-2 text-xs md:text-sm rounded border transition-all ${formData.type === 'expense' ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 scale-105' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Saída
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('investment')}
                                    className={`p-2 text-xs md:text-sm rounded border transition-all ${formData.type === 'investment' ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 scale-105' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Investimento
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs md:text-sm font-medium">Descrição</label>
                            <Input
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ex: Salário, Aluguel, Compra de FIIs..."
                                className="text-sm md:text-base"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                                <label className="text-xs md:text-sm font-medium">Valor (R$)</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    className="text-sm md:text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs md:text-sm font-medium">Data</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="text-sm md:text-base"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label className="text-xs md:text-sm font-medium">Categoria</label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger className='w-full text-sm md:text-base'>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getCategoryOptions().map(cat => (
                                        <SelectItem key={cat} value={cat} className="text-sm md:text-base">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-2 md:pt-4">
                            <Button variant="outline" className="w-full text-xs md:text-sm" onClick={handleClose} type="button">Cancelar</Button>
                            <Button className="w-full text-xs md:text-sm" type="submit">
                                {isEditing ? 'Salvar alterações' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
