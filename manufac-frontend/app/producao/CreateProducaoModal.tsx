'use client';

import { useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

interface Producao {
  id: number;
  produto_id: number;
  quantidade: number;
  status: string;
  prazo: string;
}

interface Produto {
  id: number;
  nome: string;
}

interface CreateProducaoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (p: Producao) => void;
  produtos: Produto[];
}

const STATUS_OPTIONS = ["Pendente", "Em Andamento", "Finalizado", "Cancelado"];

export default function CreateProducaoModal({ open, onClose, onCreated, produtos }: CreateProducaoModalProps) {
  const [produtoId, setProdutoId] = useState<number>(produtos[0]?.id || 0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [status, setStatus] = useState("Pendente");
  const [prazo, setPrazo] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = produtoId > 0 && quantidade > 0 && status && prazo;

  async function criar() {
    if (!isValid) return;

    setLoading(true);
    try {
      const payload = { produto_id: produtoId, quantidade, status, prazo };
      const res = await api.post<Producao>("/producao", payload);
      onCreated(res.data);
      onClose();

      setProdutoId(produtos[0]?.id || 0);
      setQuantidade(1);
      setStatus("Pendente");
      setPrazo("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Nova Produção"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancelar</button>
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
          <label className="block text-sm font-medium mb-1">Produto</label>
          <select
            value={produtoId}
            onChange={e => setProdutoId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          >
            {produtos.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantidade</label>
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prazo</label>
          <input
            type="date"
            value={prazo}
            onChange={e => setPrazo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>
    </Modal>
  );
}
