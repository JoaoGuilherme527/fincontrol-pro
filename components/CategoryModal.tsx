'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category, TransactionType } from '@/lib/types';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    mode: 'add' | 'edit';
    initialName?: string;
    type: TransactionType;
}

export function CategoryModal({ isOpen, onClose, onSubmit, mode, initialName = '', type }: CategoryModalProps) {
    const [name, setName] = useState(initialName);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSubmit(name.trim());
        setName('');
        handleClose();
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'income': return 'Entrada';
            case 'expense': return 'Saída';
            case 'investment': return 'Investimento';
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleClose}
        >
            <Card
                className={`w-full max-w-md transition-all duration-200 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                        {mode === 'add' ? 'Adicionar' : 'Editar'} Categoria de {getTypeLabel()}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs md:text-sm font-medium">Nome da Categoria</label>
                            <Input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ex: Alimentação, Transporte..."
                                autoFocus
                                className="text-sm md:text-base"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button variant="outline" className="w-full text-xs md:text-sm" onClick={handleClose} type="button">
                                Cancelar
                            </Button>
                            <Button className="w-full text-xs md:text-sm" type="submit">
                                {mode === 'add' ? 'Adicionar' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
