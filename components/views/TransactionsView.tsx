'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatBRL } from '@/lib/currency';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';

interface TransactionsViewProps {
    transactions: Transaction[];
    onDelete: (id: number) => void;
}

export function TransactionsView({ transactions, onDelete }: TransactionsViewProps) {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; transaction: Transaction | null }>({
        isOpen: false,
        transaction: null
    });

    const handleDeleteClick = (transaction: Transaction) => {
        setDeleteModal({ isOpen: true, transaction });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.transaction) {
            onDelete(deleteModal.transaction.id);
            setDeleteModal({ isOpen: false, transaction: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ isOpen: false, transaction: null });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'income':
                return 'text-green-600 dark:text-green-400';
            case 'expense':
                return 'text-red-600 dark:text-red-400';
            case 'investment':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-slate-600 dark:text-slate-400';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'income':
                return 'Entrada';
            case 'expense':
                return 'Saída';
            case 'investment':
                return 'Investimento';
            default:
                return type;
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Histórico Completo</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900">
                                <tr>
                                    <th className="px-4 py-3">Descrição</th>
                                    <th className="px-4 py-3">Categoria</th>
                                    <th className="px-4 py-3">Data</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3 text-right">Valor</th>
                                    <th className="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium">{t.description}</td>
                                        <td className="px-4 py-3 text-slate-500">{t.category}</td>
                                        <td className="px-4 py-3 text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={t.type as any} className={`text-xs p-0! ${getTypeColor(t.type)}`}>
                                                {getTypeLabel(t.type)}
                                            </Badge>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-medium ${getTypeColor(t.type)}`}>
                                            {formatBRL(t.amount)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleDeleteClick(t)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden space-y-3">
                        {transactions.map(t => (
                            <div
                                key={t.id}
                                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base mb-1">{t.description}</h3>
                                        <p className="text-xs text-slate-500">{t.category}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(t)}
                                        className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <div className="flex flex-col gap-2 items-start">
                                        <Badge variant={t.type as any} className={`text-xs p-0! ${getTypeColor(t.type)}`}>
                                            {getTypeLabel(t.type)}
                                        </Badge>
                                        <span className="text-xs text-slate-500">
                                            {new Date(t.date).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <span className={`font-bold text-lg ${getTypeColor(t.type)}`}>
                                        {t.type === 'expense' ? '-' : '+'}{formatBRL(t.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                transactionDescription={deleteModal.transaction?.description || ''}
            />
        </>
    );
}
