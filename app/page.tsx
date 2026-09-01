'use client';

import { useState } from 'react';
import { Plus, LayoutDashboard, ArrowRightLeft, TrendingUp, FolderKanban, Settings } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { NavButton } from '@/components/NavButton';
import { TransactionModal } from '@/components/TransactionModal';
import { DashboardView } from '@/components/views/DashboardView';
import { TransactionsView } from '@/components/views/TransactionsView';
import { InvestmentsView } from '@/components/views/InvestmentsView';
import { CategoriesView } from '@/components/views/CategoriesView';
import { SettingsView } from '@/components/views/SettingsView';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories, DEFAULT_CATEGORIES } from '@/hooks/useCategories';
import { useToast } from '@/contexts/ToastContext';
import { PeriodFilter } from '@/lib/period';
import { Transaction, Categories } from '@/lib/types';

type Tab = 'dashboard' | 'transactions' | 'investments' | 'categories' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState<PeriodFilter>({ type: 'current-month' });

  const { transactions, addTransaction, deleteTransaction, setTransactions } = useTransactions();
  const { categories, addCategory, editCategory, deleteCategory, getCategoryNames, setCategories } = useCategories();
  const { showToast } = useToast();

  const categoryNames = {
    income: getCategoryNames('income'),
    expense: getCategoryNames('expense'),
    investment: getCategoryNames('investment'),
  };

  const handleAddTransaction = (newTransaction: { description: string; amount: number; type: 'income' | 'expense' | 'investment'; category: string; date: string }) => {
    addTransaction(newTransaction);
    setIsModalOpen(false);
    showToast('Transação adicionada com sucesso!', 'success');
  };

  const handleDeleteTransaction = (id: number) => {
    deleteTransaction(id);
    showToast('Transação excluída', 'info');
  };

  const handleAddCategory = (type: 'income' | 'expense' | 'investment', name: string) => {
    addCategory(type, name);
    showToast(`Categoria "${name}" adicionada!`, 'success');
  };

  const handleEditCategory = (type: 'income' | 'expense' | 'investment', id: string, newName: string) => {
    editCategory(type, id, newName);
    showToast('Categoria atualizada!', 'success');
  };

  const handleDeleteCategory = (type: 'income' | 'expense' | 'investment', id: string) => {
    deleteCategory(type, id);
    showToast('Categoria excluída', 'info');
  };

  const handleImportData = (importedTransactions: Transaction[], importedCategories: Categories) => {
    setTransactions(importedTransactions);
    setCategories(importedCategories);
  };

  const handleClearData = () => {
    setTransactions([]);
    setCategories(DEFAULT_CATEGORIES);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans pb-20 md:pb-0">

      {/* SIDEBAR - Desktop */}
      <aside className="hidden md:flex md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 md:h-screen md:sticky md:top-0 flex-col">
        <div className="p-4 md:p-6 flex items-center gap-2 font-bold text-lg md:text-xl">
          <Image
            src="/logo.jpg"
            alt="FinControl Logo"
            width={48}
            height={48}
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
          />
          <span>FinControl</span>
        </div>

        <nav className="px-4 space-y-2 flex-1">
          <NavButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Visão Geral"
          />
          <NavButton
            active={activeTab === 'transactions'}
            onClick={() => setActiveTab('transactions')}
            icon={<ArrowRightLeft size={20} />}
            label="Transações"
          />
          <NavButton
            active={activeTab === 'investments'}
            onClick={() => setActiveTab('investments')}
            icon={<TrendingUp size={20} />}
            label="Investimentos"
          />
          <NavButton
            active={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
            icon={<FolderKanban size={20} />}
            label="Categorias"
          />
          <NavButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            icon={<Settings size={20} />}
            label="Configurações"
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            ✨ FinControl Pro<br />
          </p>
        </div>
      </aside>

      {/* BOTTOM TAB BAR - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 safe-area-pb">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${activeTab === 'dashboard'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-xs mt-1 font-medium">Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${activeTab === 'transactions'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <ArrowRightLeft size={20} />
            <span className="text-xs mt-1 font-medium">Transações</span>
          </button>

          <button
            onClick={() => setActiveTab('investments')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${activeTab === 'investments'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <TrendingUp size={20} />
            <span className="text-xs mt-1 font-medium">Investimentos</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${activeTab === 'categories'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <FolderKanban size={20} />
            <span className="text-xs mt-1 font-medium">Categorias</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${activeTab === 'settings'
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1 font-medium">Config.</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto md:ml-0">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {activeTab === 'dashboard' && 'Dashboard Financeiro'}
              {activeTab === 'transactions' && 'Todas Transações'}
              {activeTab === 'investments' && 'Carteira de Investimentos'}
              {activeTab === 'categories' && 'Gerenciar Categorias'}
              {activeTab === 'settings' && 'Configurações'}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              {activeTab === 'dashboard' && 'Organize o que você ganha, gasta e investe.'}
              {activeTab === 'transactions' && 'Visualize e gerencie todas as suas movimentações.'}
              {activeTab === 'investments' && 'Acompanhe seus investimentos.'}
              {activeTab === 'categories' && 'Personalize suas categorias financeiras.'}
              {activeTab === 'settings' && 'Gerencie os dados salvos no seu navegador.'}
            </p>
          </div>
          {activeTab !== 'categories' && activeTab !== 'settings' && (
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 w-full sm:w-auto">
              <Plus size={16} /> Nova Movimentação
            </Button>
          )}
        </header>

        {activeTab === 'dashboard' && (
          <DashboardView transactions={transactions} period={period} onPeriodChange={setPeriod} />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView transactions={transactions} onDelete={handleDeleteTransaction} />
        )}

        {activeTab === 'investments' && (
          <InvestmentsView transactions={transactions.filter(t => t.type === 'investment')} />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            transactions={transactions}
            categories={categories}
            onImport={handleImportData}
            onClearData={handleClearData}
            notify={showToast}
          />
        )}

      </main>

      {/* MODAL DE ADIÇÃO */}
      {isModalOpen && (
        <TransactionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
          categoryNames={categoryNames}
        />
      )}
    </div>
  );
}
