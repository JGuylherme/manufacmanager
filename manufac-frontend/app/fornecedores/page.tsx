'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";
import TablePagination from "../../components/TablePagination";

import CreateFornecedorModal from "./CreateFornecedorModal";
import EditFornecedorModal from "./EditFornecedorModal";

interface Fornecedor {
  id: number;
  nome: string;
  contato: string;
}

const ITEMS_PER_PAGE = 10;

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [fornecedorCriando, setFornecedorCriando] = useState(false);

  useEffect(() => {
    async function fetchFornecedores() {
      const res = await api.get<Fornecedor[]>("/fornecedores");
      setFornecedores(res.data);
      setLoading(false);
    }
    fetchFornecedores();
  }, []);

  const fornecedoresFiltrados = useMemo(() => {
    return fornecedores.filter(f =>
      f.nome.toLowerCase().includes(search.toLowerCase())
    );
  }, [fornecedores, search]);

  const fornecedoresPaginados = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return fornecedoresFiltrados.slice(start, start + ITEMS_PER_PAGE);
  }, [fornecedoresFiltrados, page]);

  const toggleSelectAll = () => {
    setSelected(
      selected.length === fornecedoresPaginados.length
        ? []
        : fornecedoresPaginados.map(f => f.id)
    );
  };

  const toggleSelectOne = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const excluirFornecedor = async (id: number) => {
    await api.delete(`/fornecedores/${id}`);
    setFornecedores(prev => prev.filter(f => f.id !== id));
  };

  const excluirSelecionados = async () => {
    await Promise.all(selected.map(id => api.delete(`/fornecedores/${id}`)));
    setFornecedores(prev => prev.filter(f => !selected.includes(f.id)));
    setSelected([]);
  };

  const handleFornecedorAtualizado = (fAtualizado: Fornecedor) => {
    setFornecedores(prev =>
      prev.map(f => (f.id === fAtualizado.id ? { ...f, ...fAtualizado } : f))
    );
  };

  const handleFornecedorCriado = (f: Fornecedor) => {
    setFornecedores(prev => [f, ...prev]);
  };

  const columns = [
    { header: "Nome", render: (f: Fornecedor) => <strong>{f.nome}</strong> },
    { header: "Contato", render: (f: Fornecedor) => f.contato },
    {
      header: "Ações",
      render: (f: Fornecedor) => (
        <div className="flex gap-2">
          <button
            onClick={() => setFornecedorEditando(f)}
            className="px-3 py-1 rounded bg-yellow-100 text-gray-800 hover:bg-yellow-200"
          >
            Editar
          </button>
          <button
            onClick={() => excluirFornecedor(f.id)}
            className="px-3 py-1 rounded bg-red-100 text-gray-800 hover:bg-red-200"
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Fornecedores</h1>
          <p className="text-gray-600">
            Gerencie todos os fornecedores cadastrados
          </p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-4 flex items-center justify-between border-b">
            <TableSearch
              value={search}
              onChange={v => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Buscar fornecedor"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFornecedorCriando(true)}
                className="px-4 py-2 rounded-lg bg-green-600/90 text-white hover:bg-green-600 text-sm font-medium"
              >
                + Novo Fornecedor
              </button>

              {selected.length > 0 && (
                <button
                  onClick={excluirSelecionados}
                  className="px-4 py-2 text-sm rounded bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Excluir ({selected.length})
                </button>
              )}
            </div>
          </div>

          <Table<Fornecedor>
            data={fornecedoresPaginados}
            columns={columns}
            loading={loading}
            rowKey={f => f.id}
            selectable
            selectedIds={selected}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectOne={toggleSelectOne}
          />

          <TablePagination
            page={page}
            total={fornecedoresFiltrados.length}
            perPage={ITEMS_PER_PAGE}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() =>
              setPage(p =>
                p * ITEMS_PER_PAGE < fornecedoresFiltrados.length ? p + 1 : p
              )
            }
          />
        </div>

        <CreateFornecedorModal
          open={fornecedorCriando}
          onClose={() => setFornecedorCriando(false)}
          onCreated={handleFornecedorCriado}
        />

        <EditFornecedorModal
          fornecedor={fornecedorEditando}
          onClose={() => setFornecedorEditando(null)}
          onUpdated={handleFornecedorAtualizado}
        />
      </div>
    </ProtectedRoute>
  );
}
