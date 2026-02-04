'use client';

import { useToast } from '@/contexts/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 md:bottom-8 md:top-auto md:right-4 z-50 flex flex-col gap-2 w-full px-4">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`
            flex items-start gap-3 p-3 md:p-4 rounded-lg shadow-lg backdrop-blur-sm
            animate-in slide-in-from-top md:slide-in-from-right duration-300
            ${toast.type === 'success' ? 'bg-green-500/90 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
          `}
                >
                    <div className="shrink-0 pt-0.5">
                        {toast.type === 'success' && <CheckCircle size={18} className="md:w-5 md:h-5" />}
                        {toast.type === 'error' && <XCircle size={18} className="md:w-5 md:h-5" />}
                        {toast.type === 'info' && <Info size={18} className="md:w-5 md:h-5" />}
                    </div>
                    <p className="flex-1 text-sm md:text-base font-medium wrap-break-word">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="shrink-0 hover:opacity-70 transition-opacity"
                    >
                        <X size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                </div>
            ))}
        </div>
    );
}
