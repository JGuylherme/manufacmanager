'use client';

import { useEffect, useRef } from "react";

interface ModalProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
}

export default function Modal({
    open,
    title,
    onClose,
    children,
    footer,
    width = "max-w-md",
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        function handleClickOutside(e: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleEsc);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                ref={modalRef}
                className={`w-full ${width} bg-white rounded-xl shadow-xl text-gray-800`}
            >
                {title && (
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Preencha os dados abaixo
                        </p>
                    </div>
                )}

                <div className="px-6 py-5">{children}</div>

                {footer && (
                    <div className="px-6 py-4 border-t flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
