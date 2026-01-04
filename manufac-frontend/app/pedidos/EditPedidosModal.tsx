'use client';

import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

interface Pedido {
    id: number;
    cliente_id: number;
    status: string;
}

interface Cliente {
    id: number;
    nome: string;
}

interface EditPedidoModalProps {
    pedido: Pedido | null;
    onClose: () => void;
    onUpdated: (p: Pedido) => void;
    clientes: Cliente[];
}

export default function EditPedidoModal({ pedido, onClose, onUpdated, clientes }: EditPedidoModalProps) {
    const [clienteId, setClienteId] = useState<number>(pedido?.cliente_id || 0);
    const [status, setStatus] = useState(pedido?.status || "Pendente");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pedido) {
            setClienteId(pedido.cliente_id);
            setStatus(pedido.status);
        }
    }, [pedido]);

    if (!pedido) return null;

    const isValid = clienteId > 0 && status.trim().length > 0;

    async function salvar() {
        if (!pedido || !isValid) return;

        setLoading(true);
        try {
            const payload = { cliente_id: clienteId, status };
            await api.put(`/pedidos/${pedido.id}`, payload);
            onUpdated({ ...pedido, ...payload });
            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={!!pedido}
            title="Editar Pedido"
            onClose={onClose}
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={salvar}
                        disabled={loading || !isValid}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </>
            }
        >
            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Cliente</label>
                    <select
                        value={clienteId}
                        onChange={e => setClienteId(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                    >
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
}
