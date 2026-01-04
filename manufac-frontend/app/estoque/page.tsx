'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";
import TableFilters from "../../components/TableFilters";
import TablePagination from "../../components/TablePagination";

import CreateEstoqueModal from "./CreateEstoqueModal";
import EditEstoqueModal from "./EditEstoqueModal";

interface Estoque {
  id: number;
  produto_id: number;
  quantidade: number;
  tipo: string;
  data: string;
  produto_nome?: string;
}

interface Produto {
  id: number;
  nome: string;
}

const ITEMS_PER_PAGE = 10;

export default function EstoquePage() {
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"historico" | "total">("historico");

  const [search, setSearch] = useState("");
  const [tipoSelecionados, setTipoSelecionados] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [modalCriando, setModalCriando] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<Estoque | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [estoqueRes, produtosRes] = await Promise.all([
        api.get<Estoque[]>("/estoque"),
        api.get<Produto[]>("/produtos")
      ]);

      const estoqueComNome = estoqueRes.data.map(e => {
        const produto = produtosRes.data.find(p => p.id === e.produto_id);
        return { ...e, produto_nome: produto?.nome || "Desconhecido" };
      });

      setEstoque(estoqueComNome);
      setProdutos(produtosRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  const estoqueFiltrado = useMemo(() => {
    return estoque.filter(e => {
      const matchProduto = e.produto_nome?.toLowerCase().includes(search.toLowerCase());
      const matchTipo = tipoSelecionados.length === 0 || tipoSelecionados.includes(e.tipo);
      return matchProduto && matchTipo;
    });
  }, [estoque, search, tipoSelecionados]);

  const estoquePaginado = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return estoqueFiltrado.slice(start, start + ITEMS_PER_PAGE);
  }, [estoqueFiltrado, page]);

  const toggleSelectAll = () => {
    setSelected(
      selected.length === estoquePaginado.length
        ? []
        : estoquePaginado.map(e => e.id)
    );
  };

  const toggleSelectOne = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleTipo = (tipo: string) => {
    setTipoSelecionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    );
    setPage(1);
  };

  const excluirRegistro = async (id: number) => {
    await api.delete(`/estoque/${id}`);
    setEstoque(prev => prev.filter(e => e.id !== id));
  };

  const excluirSelecionados = async () => {
    await Promise.all(selected.map(id => api.delete(`/estoque/${id}`)));
    setEstoque(prev => prev.filter(e => !selected.includes(e.id)));
    setSelected([]);
  };

  const handleRegistroAtualizado = (r: Estoque) => {
    setEstoque(prev => prev.map(e => e.id === r.id ? { ...e, ...r } : e));
  };

  const handleRegistroCriado = (r: Estoque) => {
    const produto = produtos.find(p => p.id === r.produto_id);
    setEstoque(prev => [{ ...r, produto_nome: produto?.nome || "Desconhecido" }, ...prev]);
  };

  const tipos = ["Entrada", "Saída"];

  const columnsHistorico = [
    { header: "Produto", render: (e: Estoque) => e.produto_nome },
    { header: "Quantidade", render: (e: Estoque) => e.quantidade },
    { header: "Tipo", render: (e: Estoque) => e.tipo },
    { header: "Data", render: (e: Estoque) => new Date(e.data).toLocaleString() },
    {
      header: "Ações",
      render: (e: Estoque) => (
        <div className="flex gap-2">
          <button
            onClick={() => setRegistroEditando(e)}
            className="px-3 py-1 rounded bg-yellow-100 text-gray-800 hover:bg-yellow-200"
          >
            Editar
          </button>
          <button
            onClick={() => excluirRegistro(e.id)}
            className="px-3 py-1 rounded bg-red-100 text-gray-800 hover:bg-red-200"
          >
            Excluir
          </button>
        </div>
      )
    }
  ];

  const estoqueTotal = useMemo(() => {
    const totals: Record<number, { produto_nome: string, quantidade: number }> = {};
    estoque.forEach(e => {
      if (!totals[e.produto_id]) totals[e.produto_id] = { produto_nome: e.produto_nome || "Desconhecido", quantidade: 0 };
      totals[e.produto_id].quantidade += e.tipo === "Entrada" ? e.quantidade : -e.quantidade;
    });
    return Object.entries(totals).map(([id, val]) => ({ produto_id: Number(id), ...val }));
  }, [estoque]);

  interface EstoqueTotal {
    produto_id: number;
    produto_nome: string;
    quantidade: number;
  }

  const columnsTotal = [
    { header: "Produto", render: (e: EstoqueTotal) => e.produto_nome },
    { header: "Quantidade Total", render: (e: EstoqueTotal) => e.quantidade },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Estoque</h1>
          <p className="text-gray-600">Gerencie entradas, saídas e saldo atual do estoque</p>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${tab === "historico" ? "bg-green-600 text-white" : "bg-white text-gray-800 border"}`}
            onClick={() => setTab("historico")}
          >
            Histórico
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${tab === "total" ? "bg-green-600 text-white" : "bg-white text-gray-800 border"}`}
            onClick={() => setTab("total")}
          >
            Estoque Total
          </button>
        </div>

        {tab === "historico" ? (
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 flex items-center justify-between border-b">
              <TableSearch
                value={search}
                onChange={v => { setSearch(v); setPage(1); }}
                placeholder="Buscar produto"
              />
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setModalCriando(true)}
                  className="px-4 py-2 rounded-lg bg-green-600/90 text-white hover:bg-green-600 text-sm font-medium"
                >
                  + Novo Registro
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
                  Filtrar por tipo
                </button>
                <TableFilters
                  open={showFilter}
                  options={tipos}
                  selected={tipoSelecionados}
                  onToggle={toggleTipo}
                  onClose={() => setShowFilter(false)}
                />
              </div>
            </div>

            <Table<Estoque>
              data={estoquePaginado}
              columns={columnsHistorico}
              loading={loading}
              rowKey={e => e.id}
              selectable
              selectedIds={selected}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelectOne={toggleSelectOne}
            />

            <TablePagination
              page={page}
              total={estoqueFiltrado.length}
              perPage={ITEMS_PER_PAGE}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              onNext={() => setPage(p => (p * ITEMS_PER_PAGE < estoqueFiltrado.length ? p + 1 : p))}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <Table<any>
              data={estoqueTotal}
              columns={columnsTotal}
              loading={loading}
              rowKey={e => e.produto_id}
            />
          </div>
        )}

        <CreateEstoqueModal
          open={modalCriando}
          onClose={() => setModalCriando(false)}
          onCreated={handleRegistroCriado}
          produtos={produtos}
        />

        <EditEstoqueModal
          registro={registroEditando}
          onClose={() => setRegistroEditando(null)}
          onUpdated={handleRegistroAtualizado}
          produtos={produtos}
        />
      </div>
    </ProtectedRoute>
  );
}
