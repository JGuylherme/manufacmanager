'use client';

import { useEffect, useRef } from "react";

interface TableFiltersProps {
    open: boolean;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    onClose: () => void;
}

export default function TableFilters({
    open,
    options,
    selected,
    onToggle,
    onClose,
}: TableFiltersProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        }

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className="
        absolute right-0 mt-2 w-56
        bg-white border rounded-lg shadow z-10
        text-sm text-gray-800
      "
        >
            {options.map(opt => (
                <label
                    key={opt}
                    className="
            flex items-center gap-2 px-4 py-2
            hover:bg-gray-50 cursor-pointer
          "
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(opt)}
                        onChange={() => onToggle(opt)}
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
}
