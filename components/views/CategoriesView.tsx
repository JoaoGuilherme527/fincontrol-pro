'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { TransactionType, Category } from '@/lib/types';
import { CategoryModal } from '@/components/CategoryModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';

interface CategoriesViewProps {
    categories: {
        income: Category[];
        expense: Category[];
        investment: Category[];
    };
    onAddCategory: (type: TransactionType, name: string) => void;
    onEditCategory: (type: TransactionType, id: string, newName: string) => void;
    onDeleteCategory: (type: TransactionType, id: string) => void;
}

export function CategoriesView({ categories, onAddCategory, onEditCategory, onDeleteCategory }: CategoriesViewProps) {
    const [activeType, setActiveType] = useState<TransactionType>('expense');
    const [modal, setModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; type: TransactionType; category?: Category }>({
        isOpen: false,
        mode: 'add',
        type: 'expense',
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: TransactionType; category: Category | null }>({
        isOpen: false,
        type: 'expense',
        category: null,
    });

    const handleAddClick = (type: TransactionType) => {
        setModal({ isOpen: true, mode: 'add', type });
    };

    const handleEditClick = (type: TransactionType, category: Category) => {
        setModal({ isOpen: true, mode: 'edit', type, category });
    };

    const handleDeleteClick = (type: TransactionType, category: Category) => {
        setDeleteModal({ isOpen: true, type, category });
    };

    const handleModalSubmit = (name: string) => {
        if (modal.mode === 'add') {
            onAddCategory(modal.type, name);
        } else if (modal.category) {
            onEditCategory(modal.type, modal.category.id, name);
        }
    };

    const handleConfirmDelete = () => {
        if (deleteModal.category) {
            onDeleteCategory(deleteModal.type, deleteModal.category.id);
            setDeleteModal({ isOpen: false, type: 'expense', category: null });
        }
    };

    const getTypeLabel = (type: TransactionType) => {
        switch (type) {
            case 'income': return 'Entradas';
            case 'expense': return 'Saídas';
            case 'investment': return 'Investimentos';
        }
    };

    const getTypeBadgeVariant = (type: TransactionType) => {
        return type as any;
    };

    return (
        <>
            <div className="space-y-6">
                {/* Type Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {(['expense', 'income', 'investment'] as TransactionType[]).map(type => (
                        <Button
                            key={type}
                            onClick={() => setActiveType(type)}
                            variant={activeType === type ? 'default' : 'outline'}
                            className="gap-2"
                        >
                            {getTypeLabel(type)}
                        </Button>
                    ))}
                </div>

                {/* Category List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Categorias de {getTypeLabel(activeType)}</CardTitle>
                        <Button onClick={() => handleAddClick(activeType)} className="gap-2">
                            <Plus size={16} /> Nova Categoria
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {categories[activeType].length === 0 ? (
                            <p className="text-slate-500 text-center py-8">Nenhuma categoria cadastrada ainda.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {categories[activeType].map(category => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <Badge variant={getTypeBadgeVariant(category.type)}>
                                                {category.name}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditClick(activeType, category)}
                                                className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(activeType, category)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
                    <CardContent className="pt-6">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            💡 <strong>Dica:</strong> Organize suas finanças criando categorias personalizadas.
                            As categorias ajudam você a entender melhor para onde seu dinheiro está indo e de onde está vindo.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <CategoryModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onSubmit={handleModalSubmit}
                mode={modal.mode}
                type={modal.type}
                initialName={modal.category?.name}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                transactionDescription={`categoria "${deleteModal.category?.name || ''}"`}
            />
        </>
    );
}
