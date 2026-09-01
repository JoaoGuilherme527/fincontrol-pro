import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PeriodFilter, DEFAULT_PERIOD, normalizePeriodFilter } from '@/lib/period';
import { STORAGE_KEYS } from '@/lib/backup';

/** Dashboard period selection, persisted across sessions. */
export function usePeriodFilter(): [PeriodFilter, (filter: PeriodFilter) => void] {
    const [stored, setStored] = useLocalStorage<PeriodFilter>(STORAGE_KEYS.period, DEFAULT_PERIOD);

    // Memoized so the normalized object stays referentially stable between renders
    const period = useMemo(() => normalizePeriodFilter(stored), [stored]);

    return [period, setStored];
}
