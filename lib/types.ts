export type TransactionType = 'income' | 'expense' | 'investment';

export interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: TransactionType;
    date: string;
    category: string;
}

export interface Totals {
    income: number;
    expense: number;
    investment: number;
}

// Category interface for editable categories
export interface Category {
    id: string;
    name: string;
    type: TransactionType;
}

export interface Categories {
    income: Category[];
    expense: Category[];
    investment: Category[];
}

// Default categories for first-time users
export const DEFAULT_INCOME_CATEGORIES: Category[] = [
    { id: 'inc-1', name: 'Salário', type: 'income' },
    { id: 'inc-2', name: 'Freelance', type: 'income' },
    { id: 'inc-3', name: 'Aluguel Recebido', type: 'income' },
    { id: 'inc-4', name: 'Pensão', type: 'income' },
    { id: 'inc-5', name: 'Rendimentos', type: 'income' },
    { id: 'inc-6', name: 'Venda', type: 'income' },
    { id: 'inc-7', name: 'Presente', type: 'income' },
    { id: 'inc-8', name: 'Bônus', type: 'income' },
    { id: 'inc-9', name: 'Outros', type: 'income' },
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
    { id: 'exp-1', name: 'Moradia', type: 'expense' },
    { id: 'exp-2', name: 'Alimentação', type: 'expense' },
    { id: 'exp-3', name: 'Transporte', type: 'expense' },
    { id: 'exp-4', name: 'Saúde', type: 'expense' },
    { id: 'exp-5', name: 'Educação', type: 'expense' },
    { id: 'exp-6', name: 'Lazer', type: 'expense' },
    { id: 'exp-7', name: 'Vestuário', type: 'expense' },
    { id: 'exp-8', name: 'Beleza', type: 'expense' },
    { id: 'exp-9', name: 'Telefone/Internet', type: 'expense' },
    { id: 'exp-10', name: 'Pets', type: 'expense' },
    { id: 'exp-11', name: 'Presentes', type: 'expense' },
    { id: 'exp-12', name: 'Assinaturas', type: 'expense' },
    { id: 'exp-13', name: 'Seguros', type: 'expense' },
    { id: 'exp-14', name: 'Impostos', type: 'expense' },
    { id: 'exp-15', name: 'Manutenção', type: 'expense' },
    { id: 'exp-16', name: 'Outros', type: 'expense' },
];

export const DEFAULT_INVESTMENT_CATEGORIES: Category[] = [
    { id: 'inv-1', name: 'Ações', type: 'investment' },
    { id: 'inv-2', name: 'Fundos Imobiliários', type: 'investment' },
    { id: 'inv-3', name: 'Tesouro Direto', type: 'investment' },
    { id: 'inv-4', name: 'CDB/LCI/LCA', type: 'investment' },
    { id: 'inv-5', name: 'Previdência', type: 'investment' },
    { id: 'inv-6', name: 'Fundos de Investimento', type: 'investment' },
    { id: 'inv-7', name: 'Criptomoedas', type: 'investment' },
    { id: 'inv-8', name: 'Poupança', type: 'investment' },
    { id: 'inv-9', name: 'Outros', type: 'investment' },
];
