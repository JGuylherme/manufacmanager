'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";
import TablePagination from "../../components/TablePagination";

import CreateClienteModal from "./CreateClienteModal";
import EditClienteModal from "./EditClienteModal";
import ViewClienteModal from "./ViewClienteModal";

import { Cliente } from "../types/clientes.types";

import { showSuccess, showError } from "../../utils/toasts";

const ITEMS_PER_PAGE = 10;

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteCriando, setClienteCriando] = useState(false);
  const [clienteVisualizando, setClienteVisualizando] = useState<Cliente | null>(null);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await api.get<Cliente[]>("/clientes");
        setClientes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(c =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [clientes, search]);

  const clientesPaginados = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return clientesFiltrados.slice(start, start + ITEMS_PER_PAGE);
  }, [clientesFiltrados, page]);

  const toggleSelectAll = () => {
    setSelected(
      selected.length === clientesPaginados.length
        ? []
        : clientesPaginados.map(c => c.id)
    );
  };

  const toggleSelectOne = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const excluirCliente = async (id: number) => {
    const ok = confirm("Tem certeza que deseja excluir este cliente?");
    if (!ok) return;

    try {
      await api.delete(`/clientes/${id}`);
      setClientes(prev => prev.filter(c => c.id !== id));
      showSuccess("Cliente excluído com sucesso");
    } catch {
      showError("Erro ao excluir cliente");
    }
  };

  const excluirSelecionados = async () => {
    const ok = confirm(
      `Deseja excluir ${selected.length} clientes selecionados?`
    );
    if (!ok) return;

    try {
      await Promise.all(selected.map(id => api.delete(`/clientes/${id}`)));
      setClientes(prev => prev.filter(c => !selected.includes(c.id)));
      setSelected([]);
      showSuccess("Clientes excluídos com sucesso");
    } catch {
      showError("Erro ao excluir clientes");
    }
  };

  const handleClienteAtualizado = (clienteAtualizado: Cliente) => {
    setClientes(prev =>
      prev.map(c => (c.id === clienteAtualizado.id ? clienteAtualizado : c))
    );
  };

  const handleClienteCriado = (cliente: Cliente) => {
    setClientes(prev => [cliente, ...prev]);
  };

  const columns = [
    {
      header: "Nome",
      render: (c: Cliente) => (
        <div>
          <strong className="block">{c.nome}</strong>
          <span className="text-xs text-gray-500">{c.email}</span>
        </div>
      ),
    },
    {
      header: "Telefone",
      render: (c: Cliente) => c.telefone,
    },
    {
      header: "Endereço",
      render: (c: Cliente) => (
        <span className="max-w-[260px] truncate block">
          {c.endereco}
        </span>
      ),
    },
    {
      header: "Ações",
      render: (c: Cliente) => (
        <div className="flex gap-2">
          <button
            onClick={() => setClienteVisualizando(c)}
            className="px-3 py-1 rounded bg-blue-100 text-gray-800 hover:bg-blue-200"
          >
            Dados
          </button>
          <button
            onClick={() => setClienteEditando(c)}
            className="px-3 py-1 rounded bg-yellow-100 text-gray-800 hover:bg-yellow-200"
          >
            Editar
          </button>
          <button
            onClick={() => excluirCliente(c.id)}
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
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600">
            Gerencie todos os clientes cadastrados no sistema
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
              placeholder="Buscar cliente"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setClienteCriando(true)}
                className="px-4 py-2 rounded-lg bg-green-600/90 text-white hover:bg-green-600 flex items-center gap-2 text-sm font-medium"
              >
                <span className="text-lg leading-none">+</span>
                Novo Cliente
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

          <div className="w-full overflow-x-auto">
            <Table<Cliente>
              data={clientesPaginados}
              columns={columns}
              loading={loading}
              rowKey={(c) => c.id}
              selectable
              selectedIds={selected}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelectOne={toggleSelectOne}
            />
          </div>

          <TablePagination
            page={page}
            total={clientesFiltrados.length}
            perPage={ITEMS_PER_PAGE}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() =>
              setPage(p =>
                p * ITEMS_PER_PAGE < clientesFiltrados.length ? p + 1 : p
              )
            }
          />
        </div>

        <CreateClienteModal
          open={clienteCriando}
          onClose={() => setClienteCriando(false)}
          onCreated={handleClienteCriado}
        />

        <EditClienteModal
          cliente={clienteEditando}
          onClose={() => setClienteEditando(null)}
          onUpdated={handleClienteAtualizado}
        />

        <ViewClienteModal
          cliente={clienteVisualizando}
          onClose={() => setClienteVisualizando(null)}
        />
      </div>
    </ProtectedRoute>
  );
}
