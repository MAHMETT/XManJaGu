// components/form/InputField.tsx
import { cn } from '@/lib/utils';
import React from 'react';

interface InputFieldProps {
    label: string;
    id: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    optional?: boolean;
    required?: boolean;
    className?: string;
    checked?: boolean;
}

export const InputField = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    optional = false,
    required = false,
    checked,
    className,
    ...props
}: InputFieldProps) => {
    return (
        <div className={cn('space-y-2', className)}>
            <label htmlFor={id} className="block text-sm font-medium text-foreground">
                {label} {optional && <span className="text-muted-foreground">(Opsional)</span>} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                {...props}
                checked={checked}
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    'flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                    'placeholder:text-muted-foreground',
                    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                    error && 'border-destructive ring-destructive/20',
                )}
                aria-invalid={!!error}
            />
            {error && <p className="mt-1 text-sm text-destructive dark:text-destructive-foreground">{error}</p>}
        </div>
    );
};
