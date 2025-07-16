// components/form/FormContainer.tsx
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface FormContainerProps {
    title: string;
    description?: string;
    children: ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    buttons: ReactNode;
    className?: string;
}

export const FormContainer = ({ title, description, children, onSubmit, buttons, className }: FormContainerProps) => {
    return (
        <div className={cn('overflow-hidden rounded-lg border bg-card shadow-sm', 'border-border dark:border-border/50', className)}>
            <div className={cn('border-b bg-muted/20 px-6 py-4', 'border-border dark:border-border/50')}>
                <div>
                    <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="space-y-6 p-6">{children}</div>

                <div className={cn('border-t bg-muted/20 px-6 py-4', 'border-border dark:border-border/50')}>
                    <div className="flex justify-end gap-3">{buttons}</div>
                </div>
            </form>
        </div>
    );
};
