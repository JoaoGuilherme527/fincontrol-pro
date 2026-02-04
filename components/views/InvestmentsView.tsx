'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatBRL } from '@/lib/currency';

interface InvestmentsViewProps {
    transactions: Transaction[];
}

export function InvestmentsView({ transactions }: InvestmentsViewProps) {
    const totalInvested = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6">
            <Card className="bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white border-none">
                <CardContent className="flex flex-col md:flex-row justify-between items-center py-10">
                    <div>
                        <p className="text-slate-300 mb-1">Total Acumulado em Investimentos</p>
                        <h2 className="text-4xl font-bold">{formatBRL(totalInvested)}</h2>
                    </div>
                    <div className="mt-4 md:mt-0 p-3 bg-white/10 rounded-full">
                        <TrendingUp size={32} className="text-green-400" />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Aportes Recentes</CardTitle></CardHeader>
                    <CardContent>
                        {transactions.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">Nenhum investimento registrado ainda.</p>
                        ) : (
                            <ul className="space-y-4">
                                {transactions.map(t => (
                                    <li key={t.id} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium">{t.description}</p>
                                            <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">+ {formatBRL(t.amount)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
                    <CardHeader><CardTitle>Dica de Ouro</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            Mantenha a constância! Tente investir pelo menos 20% do seu saldo final todos os meses.
                            Use esta aba para acompanhar apenas o que você está guardando para o futuro, separando das contas do dia a dia.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
