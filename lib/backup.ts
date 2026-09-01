import { Transaction, TransactionType, Categories, Category } from './types';

export const STORAGE_KEYS = {
    transactions: 'fincontrol-transactions',
    categories: 'fincontrol-categories',
} as const;

export const BACKUP_APP_ID = 'fincontrol-pro';
export const BACKUP_VERSION = 1;

export interface BackupFile {
    app: typeof BACKUP_APP_ID;
    version: number;
    exportedAt: string;
    data: {
        transactions: Transaction[];
        categories: Categories;
    };
}

const TYPES: TransactionType[] = ['income', 'expense', 'investment'];

export function buildBackup(transactions: Transaction[], categories: Categories): BackupFile {
    return {
        app: BACKUP_APP_ID,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        data: { transactions, categories },
    };
}

export function backupFileName(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `fincontrol-backup-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`;
}

/** Triggers a browser download of the backup as a .json file. */
export function downloadBackup(backup: BackupFile, fileName = backupFileName()): void {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function isTransaction(value: unknown): value is Transaction {
    if (!value || typeof value !== 'object') return false;
    const t = value as Record<string, unknown>;
    return (
        typeof t.id === 'number' &&
        typeof t.description === 'string' &&
        typeof t.amount === 'number' &&
        typeof t.date === 'string' &&
        typeof t.category === 'string' &&
        TYPES.includes(t.type as TransactionType)
    );
}

function isCategory(value: unknown): value is Category {
    if (!value || typeof value !== 'object') return false;
    const c = value as Record<string, unknown>;
    return typeof c.id === 'string' && typeof c.name === 'string' && TYPES.includes(c.type as TransactionType);
}

export interface ParsedBackup {
    transactions: Transaction[];
    categories: Categories | null;
}

/**
 * Reads a backup file's contents. Accepts both the wrapped format produced by
 * `buildBackup` and a bare array of transactions, so older manual exports still load.
 * Throws an Error with a user-facing (pt-BR) message when the file is unusable.
 */
export function parseBackup(text: string): ParsedBackup {
    let raw: unknown;
    try {
        raw = JSON.parse(text);
    } catch {
        throw new Error('Arquivo inválido: não é um JSON válido.');
    }

    const payload =
        Array.isArray(raw)
            ? { transactions: raw, categories: null }
            : (() => {
                const obj = raw as Record<string, unknown>;
                const data = (obj.data ?? obj) as Record<string, unknown>;
                return {
                    transactions: data.transactions,
                    categories: (data.categories ?? null) as unknown,
                };
            })();

    if (!Array.isArray(payload.transactions)) {
        throw new Error('Arquivo inválido: nenhuma lista de transações encontrada.');
    }

    const transactions = payload.transactions.filter(isTransaction);
    if (transactions.length === 0 && payload.transactions.length > 0) {
        throw new Error('Arquivo inválido: as transações não estão no formato esperado.');
    }

    let categories: Categories | null = null;
    if (payload.categories && typeof payload.categories === 'object') {
        const c = payload.categories as Record<string, unknown>;
        const hasAllTypes = TYPES.every(type => Array.isArray(c[type]));
        if (hasAllTypes) {
            categories = {
                income: (c.income as unknown[]).filter(isCategory),
                expense: (c.expense as unknown[]).filter(isCategory),
                investment: (c.investment as unknown[]).filter(isCategory),
            };
        }
    }

    return { transactions, categories };
}

/** Merges imported transactions into existing ones, skipping duplicate ids. */
export function mergeTransactions(current: Transaction[], incoming: Transaction[]): Transaction[] {
    const seen = new Set(current.map(t => t.id));
    const added: Transaction[] = [];

    for (const t of incoming) {
        let id = t.id;
        // Ids are timestamps; a collision means a genuinely different transaction
        // exported from another device, so give it a free id instead of dropping it.
        if (seen.has(id)) {
            const isSame = current.some(
                c => c.id === id && c.description === t.description && c.amount === t.amount && c.date === t.date
            );
            if (isSame) continue;
            while (seen.has(id)) id++;
        }
        seen.add(id);
        added.push({ ...t, id });
    }

    return [...added, ...current].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

/** Merges imported categories into existing ones, skipping names already present. */
export function mergeCategories(current: Categories, incoming: Categories): Categories {
    const result = { ...current };

    for (const type of TYPES) {
        const existingNames = new Set(current[type].map(c => c.name.toLowerCase()));
        const existingIds = new Set(current[type].map(c => c.id));
        const added = incoming[type]
            .filter(c => !existingNames.has(c.name.toLowerCase()))
            .map(c => (existingIds.has(c.id) ? { ...c, id: `${c.id}-${Date.now()}` } : c));
        result[type] = [...current[type], ...added];
    }

    return result;
}
