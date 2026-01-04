'use client';

interface TablePaginationProps {
    page: number;
    total: number;
    perPage: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function TablePagination({
    page,
    total,
    perPage,
    onPrev,
    onNext,
}: TablePaginationProps) {
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);

    return (
        <div className="flex justify-between items-center p-4 text-sm text-gray-800">
            <span>
                {start}–{end} de {total}
            </span>

            <div className="flex gap-2">
                <button
                    disabled={page === 1}
                    onClick={onPrev}
                    className="
            px-3 py-1 border rounded
            text-gray-800
            hover:bg-gray-50
            disabled:opacity-40
          "
                >
                    Anterior
                </button>

                <button
                    disabled={end >= total}
                    onClick={onNext}
                    className="
            px-3 py-1 border rounded
            text-gray-800
            hover:bg-gray-50
            disabled:opacity-40
          "
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}
