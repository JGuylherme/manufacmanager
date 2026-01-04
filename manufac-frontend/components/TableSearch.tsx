'use client';

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TableSearch({
  value,
  onChange,
  placeholder = "Buscar",
}: TableSearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full max-w-sm px-4 py-2 text-sm
        text-gray-800 placeholder-gray-400
        border rounded-lg
        focus:ring-2 focus:ring-blue-300
      "
    />
  );
}
