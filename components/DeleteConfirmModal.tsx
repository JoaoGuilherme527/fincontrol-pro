'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    transactionDescription: string;
}

export function DeleteConfirmModal({ isOpen, onConfirm, onCancel, transactionDescription }: DeleteConfirmModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(onCancel, 200);
    };

    const handleConfirm = () => {
        setIsVisible(false);
        setTimeout(onConfirm, 200);
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleCancel}
        >
            <Card
                className={`w-full max-w-md transition-all duration-200 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Confirmar Exclusão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                        Tem certeza que deseja excluir a transação <span className="font-semibold">"{transactionDescription}"</span>?
                    </p>
                    <p className="text-xs text-slate-500">
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button variant="outline" className="w-full text-xs md:text-sm" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" className="w-full text-xs md:text-sm" onClick={handleConfirm}>
                            Sim, Excluir
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
