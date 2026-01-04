'use client';

import { useState } from "react";
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

interface CreatePedidoModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (p: Pedido) => void;
    clientes: Cliente[];
}

export default function CreatePedidoModal({ open, onClose, onCreated, clientes }: CreatePedidoModalProps) {
    const [clienteId, setClienteId] = useState<number>(clientes[0]?.id || 0);
    const [status, setStatus] = useState("Pendente");
    const [loading, setLoading] = useState(false);

    const isValid = clienteId > 0 && status.trim().length > 0;

    async function criar() {
        if (!isValid) return;

        setLoading(true);
        try {
            const payload = { cliente_id: clienteId, status };
            const res = await api.post<Pedido>("/pedidos", payload);
            onCreated(res.data);
            onClose();

            setClienteId(clientes[0]?.id || 0);
            setStatus("Pendente");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={open}
            title="Novo Pedido"
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
                        onClick={criar}
                        disabled={loading || !isValid}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Criando..." : "Criar"}
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
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
