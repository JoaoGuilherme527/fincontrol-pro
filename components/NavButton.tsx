import { ReactNode } from 'react';

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
}

export function NavButton({ active, onClick, icon, label }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
