import { useLocalStorage } from './useLocalStorage';
import { Category, Categories, TransactionType, DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INVESTMENT_CATEGORIES } from '@/lib/types';

const DEFAULT_CATEGORIES: Categories = {
    income: DEFAULT_INCOME_CATEGORIES,
    expense: DEFAULT_EXPENSE_CATEGORIES,
    investment: DEFAULT_INVESTMENT_CATEGORIES,
};

export function useCategories() {
    const [categories, setCategories] = useLocalStorage<Categories>('fincontrol-categories', DEFAULT_CATEGORIES);

    const addCategory = (type: TransactionType, name: string) => {
        const newCategory: Category = {
            id: `${type}-${Date.now()}`,
            name,
            type,
        };

        setCategories(prev => ({
            ...prev,
            [type]: [...prev[type], newCategory],
        }));
    };

    const editCategory = (type: TransactionType, id: string, newName: string) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].map(cat =>
                cat.id === id ? { ...cat, name: newName } : cat
            ),
        }));
    };

    const deleteCategory = (type: TransactionType, id: string) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].filter(cat => cat.id !== id),
        }));
    };

    const getCategoriesByType = (type: TransactionType): Category[] => {
        return categories[type] || [];
    };

    const getCategoryNames = (type: TransactionType): string[] => {
        return categories[type].map(cat => cat.name);
    };

    return {
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        getCategoriesByType,
        getCategoryNames,
    };
}
