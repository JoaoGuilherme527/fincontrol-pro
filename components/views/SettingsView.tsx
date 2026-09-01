'use client';

import { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Database, AlertTriangle, FileJson } from 'lucide-react';
import { Transaction, Categories } from '@/lib/types';
import { buildBackup, downloadBackup, parseBackup, mergeTransactions, mergeCategories, backupFileName } from '@/lib/backup';

type ImportMode = 'merge' | 'replace';

interface SettingsViewProps {
    transactions: Transaction[];
    categories: Categories;
    onImport: (transactions: Transaction[], categories: Categories) => void;
    onClearData: () => void;
    notify: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function SettingsView({ transactions, categories, onImport, onClearData, notify }: SettingsViewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importMode, setImportMode] = useState<ImportMode>('merge');
    const [confirmingClear, setConfirmingClear] = useState(false);

    const categoryCount = categories.income.length + categories.expense.length + categories.investment.length;

    const handleExport = () => {
        if (transactions.length === 0) {
            notify('Não há transações para exportar.', 'info');
            return;
        }
        try {
            downloadBackup(buildBackup(transactions, categories));
            notify('Backup exportado com sucesso!', 'success');
        } catch {
            notify('Não foi possível gerar o arquivo de backup.', 'error');
        }
    };

    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Reset early so selecting the same file twice still fires onChange
        event.target.value = '';
        if (!file) return;

        try {
            const parsed = parseBackup(await file.text());

            const nextTransactions =
                importMode === 'replace'
                    ? parsed.transactions
                    : mergeTransactions(transactions, parsed.transactions);

            const nextCategories = parsed.categories
                ? importMode === 'replace'
                    ? parsed.categories
                    : mergeCategories(categories, parsed.categories)
                : categories;

            onImport(nextTransactions, nextCategories);

            const added = nextTransactions.length - (importMode === 'replace' ? 0 : transactions.length);
            notify(
                importMode === 'replace'
                    ? `Dados substituídos: ${parsed.transactions.length} transações importadas.`
                    : `${added} nova(s) transação(ões) importada(s).`,
                'success'
            );
        } catch (error) {
            notify(error instanceof Error ? error.message : 'Falha ao importar o arquivo.', 'error');
        }
    };

    const handleClear = () => {
        onClearData();
        setConfirmingClear(false);
        notify('Todos os dados foram apagados.', 'info');
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* DADOS */}
            <Card>
                <CardHeader className="border-b pb-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Database size={20} />
                        Dados
                    </CardTitle>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                        Seus dados ficam salvos apenas neste navegador (localStorage). Exporte um backup
                        para não perdê-los ao limpar o navegador ou trocar de dispositivo.
                    </p>
                </CardHeader>

                <CardContent className="pt-4 space-y-6">
                    {/* Resumo */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                            <p className="text-xs text-slate-500">Transações salvas</p>
                            <p className="text-xl font-bold">{transactions.length}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                            <p className="text-xs text-slate-500">Categorias salvas</p>
                            <p className="text-xl font-bold">{categoryCount}</p>
                        </div>
                    </div>

                    {/* Exportar */}
                    <section className="space-y-2">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Download size={16} /> Exportar
                        </h3>
                        <p className="text-xs text-slate-500">
                            Baixa um arquivo <code className="font-mono">.json</code> com todas as transações e categorias.
                        </p>
                        <Button onClick={handleExport} className="gap-2 w-full sm:w-auto">
                            <FileJson size={16} /> Baixar backup ({backupFileName()})
                        </Button>
                    </section>

                    {/* Importar */}
                    <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Upload size={16} /> Importar
                        </h3>
                        <p className="text-xs text-slate-500">
                            Selecione um arquivo de backup gerado por esta aba.
                        </p>

                        <div className="space-y-2">
                            <label className="flex items-start gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="import-mode"
                                    value="merge"
                                    checked={importMode === 'merge'}
                                    onChange={() => setImportMode('merge')}
                                    className="mt-1"
                                />
                                <span>
                                    <span className="font-medium">Mesclar</span>
                                    <span className="block text-xs text-slate-500">
                                        Mantém o que já existe e adiciona o que vier no arquivo.
                                    </span>
                                </span>
                            </label>

                            <label className="flex items-start gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="import-mode"
                                    value="replace"
                                    checked={importMode === 'replace'}
                                    onChange={() => setImportMode('replace')}
                                    className="mt-1"
                                />
                                <span>
                                    <span className="font-medium">Substituir</span>
                                    <span className="block text-xs text-slate-500">
                                        Apaga os dados atuais e usa apenas os do arquivo.
                                    </span>
                                </span>
                            </label>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json,.json"
                            onChange={handleFileSelected}
                            className="hidden"
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2 w-full sm:w-auto"
                        >
                            <Upload size={16} /> Selecionar arquivo
                        </Button>
                    </section>

                    {/* Zona de risco */}
                    <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle size={16} /> Apagar tudo
                        </h3>
                        <p className="text-xs text-slate-500">
                            Remove todas as transações e restaura as categorias padrão. Não há como desfazer —
                            exporte um backup antes.
                        </p>

                        {confirmingClear ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button variant="destructive" onClick={handleClear} className="gap-2">
                                    Confirmar exclusão
                                </Button>
                                <Button variant="outline" onClick={() => setConfirmingClear(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setConfirmingClear(true)}
                                className="gap-2 w-full sm:w-auto text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                                <AlertTriangle size={16} /> Apagar todos os dados
                            </Button>
                        )}
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
