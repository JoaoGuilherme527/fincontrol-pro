/**
 * Formats a number as Brazilian Real (BRL) currency
 * @param value - The numeric value to format
 * @returns Formatted string in BRL format (e.g., "R$ 1.234,56")
 */
export function formatBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}
