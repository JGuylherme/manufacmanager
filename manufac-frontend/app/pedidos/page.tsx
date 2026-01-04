'use client';

import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";
import TableFilters from "../../components/TableFilters";
import TablePagination from "../../components/TablePagination";

import CreatePedidoModal from "./CreatePedidosModal";
import EditPedidoModal from "./EditPedidosModal";

interface Pedido {
  id: number;
  cliente_id: number;
  status: string;
  cliente_nome?: string;
}

interface Cliente {
  id: number;
  nome: string;
}

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["Pendente", "Em andamento", "Finalizado", "Cancelado"];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  const [pedidoCriando, setPedidoCriando] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [pedidosRes, clientesRes] = await Promise.all([
        api.get<Pedido[]>("/pedidos"),
        api.get<Cliente[]>("/clientes"),
      ]);

      const pedidosComNome = pedidosRes.data.map(p => {
        const cliente = clientesRes.data.find(c => c.id === p.cliente_id);
        return { ...p, cliente_nome: cliente?.nome || "Desconhecido" };
      });

      setPedidos(pedidosComNome);
      setClientes(clientesRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter(p => {
      const matchSearch = p.cliente_nome?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter.length === 0 || statusFilter.includes(p.status);
      return matchSearch && matchStatus;
    });
  }, [pedidos, search, statusFilter]);

  const pedidosPaginados = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return pedidosFiltrados.slice(start, start + ITEMS_PER_PAGE);
  }, [pedidosFiltrados, page]);

  const toggleSelectAll = () => {
    setSelected(
      selected.length === pedidosPaginados.length
        ? []
        : pedidosPaginados.map(p => p.id)
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

  const excluirPedido = async (id: number) => {
    await api.delete(`/pedidos/${id}`);
    setPedidos(prev => prev.filter(p => p.id !== id));
  };
  const excluirSelecionados = async () => {
    await Promise.all(selected.map(id => api.delete(`/pedidos/${id}`)));
    setPedidos(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
  };

  const handlePedidoAtualizado = (pAtualizado: Pedido) => {
    setPedidos(prev =>
      prev.map(p => (p.id === pAtualizado.id ? { ...p, ...pAtualizado } : p))
    );
  };
  const handlePedidoCriado = (p: Pedido) => {
    const cliente = clientes.find(c => c.id === p.cliente_id);
    setPedidos(prev => [{ ...p, cliente_nome: cliente?.nome || "Desconhecido" }, ...prev]);
  };

  const columns = [
    { header: "ID", render: (p: Pedido) => p.id },
    { header: "Cliente", render: (p: Pedido) => p.cliente_nome },
    { header: "Status", render: (p: Pedido) => p.status },
    {
      header: "Ações",
      render: (p: Pedido) => (
        <div className="flex gap-2">
          <button
            onClick={() => setPedidoEditando(p)}
            className="px-3 py-1 rounded bg-yellow-100 text-gray-800 hover:bg-yellow-200"
          >
            Editar
          </button>
          <button
            onClick={() => excluirPedido(p.id)}
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
          <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-600">Gerencie todos os pedidos cadastrados</p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-4 flex items-center justify-between border-b">
            <TableSearch
              value={search}
              onChange={v => { setSearch(v); setPage(1); }}
              placeholder="Buscar por cliente"
            />

            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setPedidoCriando(true)}
                className="px-4 py-2 rounded-lg bg-green-600/90 text-white hover:bg-green-600 text-sm font-medium"
              >
                + Novo Pedido
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

          <Table<Pedido>
            data={pedidosPaginados}
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
            total={pedidosFiltrados.length}
            perPage={ITEMS_PER_PAGE}
            onPrev={() => setPage(p => Math.max(1, p - 1))}
            onNext={() =>
              setPage(p =>
                p * ITEMS_PER_PAGE < pedidosFiltrados.length ? p + 1 : p
              )
            }
          />
        </div>

        <CreatePedidoModal
          open={pedidoCriando}
          onClose={() => setPedidoCriando(false)}
          onCreated={handlePedidoCriado}
          clientes={clientes}
        />

        <EditPedidoModal
          pedido={pedidoEditando}
          onClose={() => setPedidoEditando(null)}
          onUpdated={handlePedidoAtualizado}
          clientes={clientes}
        />
      </div>
    </ProtectedRoute>
  );
}
