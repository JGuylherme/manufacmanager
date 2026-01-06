'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";
import TablePagination from "../../components/TablePagination";

import CreateFornecedorModal from "./CreateFornecedorModal";
import EditFornecedorModal from "./EditFornecedorModal";
import ViewFornecedorModal from "./ViewFornecedorModal";

import { Fornecedor } from "../types/fornecedores.types";
import { showSuccess, showError } from "../../utils/toasts";

const ITEMS_PER_PAGE = 10;

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [fornecedorCriando, setFornecedorCriando] = useState(false);
  const [fornecedorVisualizando, setFornecedorVisualizando] = useState<Fornecedor | null>(null);

  useEffect(() => {
    async function fetchFornecedores() {
      try {
        const res = await api.get<Fornecedor[]>("/fornecedores");

        const normalizados = res.data.map(f => ({
          ...f,
          cpf: f.cpf ?? undefined,
          cnpj: f.cnpj ?? undefined,
          cidade: f.cidade ?? undefined,
          estado: f.estado ?? undefined,
          observacoes: f.observacoes ?? undefined,
        }));

        setFornecedores(normalizados);
      } catch {
        showError("Erro ao carregar fornecedores");
      } finally {
        setLoading(false);
      }
    }

    fetchFornecedores();
  }, []);

  const fornecedoresFiltrados = useMemo(() => {
    return fornecedores.filter(f =>
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
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

  /* =======================
     EXCLUSÃO (COM TOASTS)
     ======================= */

  const excluirFornecedor = async (id: number) => {
    const ok = confirm("Tem certeza que deseja excluir este fornecedor?");
    if (!ok) return;

    try {
      await api.delete(`/fornecedores/${id}`);
      setFornecedores(prev => prev.filter(f => f.id !== id));
      showSuccess("Fornecedor excluído com sucesso");
    } catch {
      showError("Erro ao excluir fornecedor");
    }
  };

  const excluirSelecionados = async () => {
    const ok = confirm(
      `Deseja excluir ${selected.length} fornecedores selecionados?`
    );
    if (!ok) return;

    try {
      await Promise.all(
        selected.map(id => api.delete(`/fornecedores/${id}`))
      );
      setFornecedores(prev => prev.filter(f => !selected.includes(f.id)));
      setSelected([]);
      showSuccess("Fornecedores excluídos com sucesso");
    } catch {
      showError("Erro ao excluir fornecedores");
    }
  };

  const handleFornecedorAtualizado = (fAtualizado: Fornecedor) => {
    setFornecedores(prev =>
      prev.map(f => (f.id === fAtualizado.id ? fAtualizado : f))
    );
  };

  const handleFornecedorCriado = (f: Fornecedor) => {
    setFornecedores(prev => [f, ...prev]);
  };

  const columns = [
    {
      header: "Nome",
      render: (f: Fornecedor) => (
        <div>
          <strong className="block">{f.nome}</strong>
          <span className="text-xs text-gray-500">{f.email}</span>
        </div>
      ),
    },
    {
      header: "Tipo",
      render: (f: Fornecedor) => (
        <span className="text-sm">
          {f.tipo === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}
        </span>
      ),
    },
    {
      header: "Telefone",
      render: (f: Fornecedor) => f.telefone,
    },
    {
      header: "Status",
      render: (f: Fornecedor) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${f.ativo
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {f.ativo ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      header: "Ações",
      render: (f: Fornecedor) => (
        <div className="flex gap-2">
          <button
            onClick={() => setFornecedorVisualizando(f)}
            className="px-3 py-1 rounded bg-blue-100 text-gray-800 hover:bg-blue-200"
          >
            Ver
          </button>

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
              placeholder="Buscar por nome ou email"
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

        <ViewFornecedorModal
          fornecedor={fornecedorVisualizando}
          onClose={() => setFornecedorVisualizando(null)}
        />

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
