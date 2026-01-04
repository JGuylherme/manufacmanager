'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";
import TableFilters from "../../components/TableFilters";
import TablePagination from "../../components/TablePagination";

import EditProdutoModal from "./EditProdutoModal";
import CreateProdutoModal from "./CreateProdutoModal";

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  tamanho: string;
  cor: string;
  preco: number;
  estoque: number;
}

const ITEMS_PER_PAGE = 10;

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [produtoCriando, setProdutoCriando] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    async function fetchProdutos() {
      const res = await api.get<Produto[]>("/produtos");
      setProdutos(res.data);
      setLoading(false);
    }
    fetchProdutos();
  }, []);

  const categorias = useMemo(
    () => Array.from(new Set(produtos.map(p => p.categoria))),
    [produtos]
  );

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchNome = p.nome.toLowerCase().includes(search.toLowerCase());
      const matchCategoria =
        categoriasSelecionadas.length === 0 ||
        categoriasSelecionadas.includes(p.categoria);
      return matchNome && matchCategoria;
    });
  }, [produtos, search, categoriasSelecionadas]);

  const produtosPaginados = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return produtosFiltrados.slice(start, start + ITEMS_PER_PAGE);
  }, [produtosFiltrados, page]);

  const toggleSelectAll = () => {
    setSelected(
      selected.length === produtosPaginados.length
        ? []
        : produtosPaginados.map(p => p.id)
    );
  };

  const toggleSelectOne = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCategoria = (categoria: string) => {
    setCategoriasSelecionadas(prev =>
      prev.includes(categoria)
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
    setPage(1);
  };

  const excluirProduto = async (id: number) => {
    await api.delete(`/produtos/${id}`);
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  const excluirSelecionados = async () => {
    await Promise.all(selected.map(id => api.delete(`/produtos/${id}`)));
    setProdutos(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
  };

  const handleProdutoAtualizado = (produtoAtualizado: Produto) => {
    setProdutos(prev =>
      prev.map(p =>
        p.id === produtoAtualizado.id ? { ...p, ...produtoAtualizado } : p
      )
    );
  };

  const handleProdutoCriado = (produto: Produto) => {
    setProdutos(prev => [produto, ...prev]);
  };

  const columns = [
    { header: "Produto", render: (p: Produto) => <strong>{p.nome}</strong> },
    { header: "Cor", render: (p: Produto) => p.cor },
    { header: "Categoria", render: (p: Produto) => p.categoria },
    { header: "Preço", render: (p: Produto) => `R$ ${Number(p.preco).toFixed(2)}` },
    { header: "Estoque", render: (p: Produto) => p.estoque },
    {
      header: "Ações",
      render: (p: Produto) => (
        <div className="flex gap-2">
          <button
            onClick={() => setProdutoEditando(p)}
            className="px-3 py-1 rounded bg-yellow-100 text-gray-800 hover:bg-yellow-200"
          >
            Editar
          </button>
          <button
            onClick={() => excluirProduto(p.id)}
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
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-600">
            Gerencie todos os produtos cadastrados no sistema
          </p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">

          <div className="p-4 flex items-center justify-between border-b">

            <TableSearch
              value={search}
              onChange={(v: string) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Buscar produto"
            />

            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setProdutoCriando(true)}
                className="
                  px-4 py-2 rounded-lg
                  bg-green-600/90 text-white
                  hover:bg-green-600
                  flex items-center gap-2
                  text-sm font-medium
                "
              >
                <span className="text-lg leading-none">+</span>
                Novo Produto
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
                Filtrar por categoria
              </button>

              <TableFilters
                open={showFilter}
                options={categorias}
                selected={categoriasSelecionadas}
                onToggle={toggleCategoria}
                onClose={() => setShowFilter(false)}
              />
            </div>
          </div>

          <Table<Produto>
            data={produtosPaginados}
            columns={columns}
            loading={loading}
            rowKey={(p) => p.id}
            selectable
            selectedIds={selected}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectOne={toggleSelectOne}
          />

          <TablePagination
            page={page}
            total={produtosFiltrados.length}
            perPage={ITEMS_PER_PAGE}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() =>
              setPage(p =>
                p * ITEMS_PER_PAGE < produtosFiltrados.length ? p + 1 : p
              )
            }
          />
        </div>

        <EditProdutoModal
          produto={produtoEditando}
          onClose={() => setProdutoEditando(null)}
          onUpdated={handleProdutoAtualizado}
        />

        <CreateProdutoModal
          open={produtoCriando}
          onClose={() => setProdutoCriando(false)}
          onCreated={handleProdutoCriado}
        />
      </div>
    </ProtectedRoute>
  );
}
