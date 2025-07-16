// components/form/select-input-field.tsx
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Option {
    id: string | number;
    name: string | number;
}

interface SelectInputFieldProps {
    name: string;
    label: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    placeholder?: string;
    optional?: boolean;
    required?: boolean;
    className?: string;
    defaultValue?: string | number;
    options: Option[];
    disabled?: boolean;
    value?: string | number;
}

export const SelectInputField = ({
    name,
    label,
    error,
    optional = false,
    required = false,
    className,
    placeholder,
    onChange,
    options,
    defaultValue = '',
    disabled = false,
    value,
}: SelectInputFieldProps) => {
    return (
        <div className={cn('space-y-2', className)}>
            <label htmlFor={name} className="block text-sm font-medium text-foreground">
                {label}
                {optional && <span className="text-muted-foreground"> (Opsional)</span>}
                {required && <span className="ml-1 text-destructive">*</span>}
            </label>

            <div className="relative">
                <select
                    name={name}
                    id={name}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={cn(
                        'flex h-9 w-full appearance-none rounded-md border border-input bg-card px-3 py-2 text-sm shadow-xs transition-colors',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-muted-foreground',
                        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                        error && 'border-destructive ring-destructive/20',
                        'pr-8', // Untuk memberi ruang pada chevron
                    )}
                    aria-invalid={!!error}
                >
                    <option value="" disabled className="text-muted-foregroun d">
                        {placeholder || 'Pilih opsi...'}
                    </option>

                    {options.length > 0 ? (
                        options.map((option) => (
                            <option key={option.id} value={option.id} className="bg-card text-foreground">
                                {option.name}
                            </option>
                        ))
                    ) : (
                        <option disabled className="text-muted-foreground">
                            -- Tidak ada data --
                        </option>
                    )}
                </select>

                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {error && <p className="mt-1 text-sm text-destructive dark:text-destructive-foreground">{error}</p>}
        </div>
    );
};
