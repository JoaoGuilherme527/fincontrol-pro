/**
 * Get daily totals for the last N days
 * @param transactions - All transactions
 * @param days - Number of days to get data for
 * @returns Array of daily totals with heights as percentages
 */
export function getLast7DaysData(transactions: any[], days: number = 7): { date: string; total: number; height: number; color: string }[] {
    const today = new Date();
    const dailyTotals: { [key: string]: number } = {};

    // Initialize all days with 0
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyTotals[dateStr] = 0;
    }

    // Sum up transactions for each day
    transactions.forEach(transaction => {
        const transDate = transaction.date;
        if (dailyTotals.hasOwnProperty(transDate)) {
            // For chart visualization, we sum all types
            // You can adjust this logic to show only specific types if needed
            dailyTotals[transDate] += Math.abs(transaction.amount);
        }
    });

    // Convert to array and calculate percentages
    const values = Object.values(dailyTotals);
    const maxValue = Math.max(...values, 1); // Prevent division by zero

    const colors = [
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-orange-500 to-orange-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600',
    ];

    return Object.entries(dailyTotals).map(([date, total], index) => ({
        date,
        total,
        height: Math.max((total / maxValue) * 100, 5), // Minimum 5% height for visibility
        color: colors[index % colors.length],
    }));
}

/**
 * Get daily totals for a specific month
 */
export function getMonthData(transactions: any[], month: number, year: number): { date: string; total: number; height: number; color: string }[] {
    const dailyTotals: { [key: string]: number } = {};

    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        dailyTotals[dateStr] = 0;
    }

    // Sum up transactions for each day
    transactions.forEach(transaction => {
        const transDate = transaction.date;
        if (dailyTotals.hasOwnProperty(transDate)) {
            dailyTotals[transDate] += Math.abs(transaction.amount);
        }
    });

    // Convert to array and calculate percentages
    const values = Object.values(dailyTotals);
    const maxValue = Math.max(...values, 1);

    const colors = [
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-orange-500 to-orange-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600',
    ];

    return Object.entries(dailyTotals).map(([date, total], index) => ({
        date,
        total,
        height: Math.max((total / maxValue) * 100, 5),
        color: colors[index % colors.length],
    }));
}

/**
 * Get chart data based on filter type
 */
export function getChartData(
    transactions: any[],
    filterType: 'days' | 'month',
    filterValue: number | { month: number; year: number }
): { date: string; total: number; height: number; color: string }[] {
    if (filterType === 'days') {
        return getLast7DaysData(transactions, filterValue as number);
    } else {
        const { month, year } = filterValue as { month: number; year: number };
        return getMonthData(transactions, month, year);
    }
}
