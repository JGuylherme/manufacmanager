'use client';

import React from "react";

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
  selectable?: boolean;
  selectedIds?: number[];
  onToggleSelectAll?: () => void;
  onToggleSelectOne?: (id: number) => void;
}

export default function Table<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "Nenhum registro encontrado",
  rowKey,
  selectable = false,
  selectedIds = [],
  onToggleSelectAll,
  onToggleSelectOne,
}: TableProps<T>) {
  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className="w-full overflow-x-auto relative">
      <table className="min-w-[900px] w-full text-sm text-left text-gray-800">
        <thead className="bg-blue-100 border-b">
          <tr>
            {selectable && (
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={onToggleSelectAll}
                />
              </th>
            )}

            {columns.map(col => (
              <th
                key={col.header}
                className={`px-4 py-3 font-semibold whitespace-nowrap ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={colSpan} className="px-4 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 rounded w-full" />
                </td>
              </tr>
            ))}

          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={colSpan}
                className="px-6 py-10 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            data.map(row => (
              <tr
                key={rowKey(row)}
                className="even:bg-gray-50 hover:bg-blue-50/70"
              >
                {selectable && (
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes((row as any).id)}
                      onChange={() =>
                        onToggleSelectOne?.((row as any).id)
                      }
                    />
                  </td>
                )}

                {columns.map(col => (
                  <td key={col.header} className="px-4 py-4 whitespace-nowrap">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
