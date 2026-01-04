'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";
import TableFilters from "../../components/TableFilters";
import TablePagination from "../../components/TablePagination";

import CreateProducaoModal from "./CreateProducaoModal";
import EditProducaoModal from "./EditProducaoModal";

interface Producao {
  id: number;
  produto_id: number;
  quantidade: number;
  status: string;
  prazo: string;
  produto_nome?: string;
}

interface Produto {
  id: number;
  nome: string;
}

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["Pendente", "Em Andamento", "Finalizado", "Cancelado"];

export default function ProducoesPage() {
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const [producaoEditando, setProducaoEditando] = useState<Producao | null>(null);
  const [producaoCriando, setProducaoCriando] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [prodRes, prodExecRes] = await Promise.all([
        api.get<Produto[]>("/produtos"),
        api.get<Producao[]>("/producao"),
      ]);

      const producoesComNome = prodExecRes.data.map(p => {
        const produto = prodRes.data.find(pr => pr.id === p.produto_id);
        return { ...p, produto_nome: produto?.nome || "Desconhecido" };
      });

      setProdutos(prodRes.data);
      setProducoes(producoesComNome);
      setLoading(false);
    }

    fetchData();
  }, []);

  const producoesFiltradas = useMemo(() => {
    return producoes.filter(p => {
      const matchSearch = p.produto_nome?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter.length === 0 || statusFilter.includes(p.status);
      return matchSearch && matchStatus;
    });
  }, [producoes, search, statusFilter]);

  const producoesPaginadas = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return producoesFiltradas.slice(start, start + ITEMS_PER_PAGE);
  }, [producoesFiltradas, page]);

  const toggleSelectAll = () => {
    setSelected(
      selected.length === producoesPaginadas.length
        ? []
        : producoesPaginadas.map(p => p.id)
    );
  };

  const toggleSelectOne = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setPage(1);
  };

  const excluirProducao = async (id: number) => {
    await api.delete(`/producao/${id}`);
    setProducoes(prev => prev.filter(p => p.id !== id));
  };

  const excluirSelecionados = async () => {
    await Promise.all(selected.map(id => api.delete(`/producao/${id}`)));
    setProducoes(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
  };

  const handleProducaoAtualizada = (p: Producao) => {
    setProducoes(prev =>
      prev.map(pr => (pr.id === p.id ? { ...pr, ...p } : pr))
    );
  };

  const handleProducaoCriada = (p: Producao) => {
    const produto = produtos.find(pr => pr.id === p.produto_id);
    setProducoes(prev => [{ ...p, produto_nome: produto?.nome || "Desconhecido" }, ...prev]);
  };

  const columns = [
    { header: "Produto", render: (p: Producao) => p.produto_nome },
    { header: "Quantidade", render: (p: Producao) => p.quantidade },
    { header: "Status", render: (p: Producao) => p.status },
    { header: "Prazo", render: (p: Producao) => p.prazo },
    {
      header: "Ações",
      render: (p: Producao) => (
        <div className="flex gap-2">
          <button
            onClick={() => setProducaoEditando(p)}
            className="px-3 py-1 rounded bg-yellow-100 text-gray-800 hover:bg-yellow-200"
          >
            Editar
          </button>
          <button
            onClick={() => excluirProducao(p.id)}
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
          <h1 className="text-3xl font-bold text-gray-800">Produção</h1>
          <p className="text-gray-600">Gerencie a produção dos produtos</p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-4 flex items-center justify-between border-b">
            <TableSearch
              value={search}
              onChange={v => { setSearch(v); setPage(1); }}
              placeholder="Buscar por produto"
            />

            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setProducaoCriando(true)}
                className="px-4 py-2 rounded-lg bg-green-600/90 text-white hover:bg-green-600 text-sm font-medium"
              >
                + Nova Produção
              </button>

              {selected.length > 0 && (
                <button
                  onClick={excluirSelecionados}
                  className="px-4 py-2 text-sm rounded bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Excluir ({selected.length})
                </button>
              )}

              <button
                onClick={() => setShowFilter(v => !v)}
                className="px-4 py-2 text-sm border rounded-lg text-gray-800 hover:bg-gray-50"
              >
                Filtrar por status
              </button>

              <TableFilters
                open={showFilter}
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onToggle={toggleStatusFilter}
                onClose={() => setShowFilter(false)}
              />
            </div>
          </div>

          <Table<Producao>
            data={producoesPaginadas}
            columns={columns}
            loading={loading}
            rowKey={p => p.id}
            selectable
            selectedIds={selected}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectOne={toggleSelectOne}
          />

          <TablePagination
            page={page}
            total={producoesFiltradas.length}
            perPage={ITEMS_PER_PAGE}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() =>
              setPage(p =>
                p * ITEMS_PER_PAGE < producoesFiltradas.length ? p + 1 : p
              )
            }
          />
        </div>

        <CreateProducaoModal
          open={producaoCriando}
          onClose={() => setProducaoCriando(false)}
          onCreated={handleProducaoCriada}
          produtos={produtos}
        />

        <EditProducaoModal
          producao={producaoEditando}
          onClose={() => setProducaoEditando(null)}
          onUpdated={handleProducaoAtualizada}
          produtos={produtos}
        />
      </div>
    </ProtectedRoute>
  );
}
