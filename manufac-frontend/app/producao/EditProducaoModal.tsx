'use client';

import { useEffect, useState } from "react";
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

interface EditProducaoModalProps {
  producao: Producao | null;
  onClose: () => void;
  onUpdated: (p: Producao) => void;
  produtos: Produto[];
}

const STATUS_OPTIONS = ["Pendente", "Em Andamento", "Finalizado", "Cancelado"];

export default function EditProducaoModal({ producao, onClose, onUpdated, produtos }: EditProducaoModalProps) {
  const [produtoId, setProdutoId] = useState<number>(producao?.produto_id || 0);
  const [quantidade, setQuantidade] = useState<number>(producao?.quantidade || 1);
  const [status, setStatus] = useState(producao?.status || "Pendente");
  const [prazo, setPrazo] = useState(producao?.prazo || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (producao) {
      setProdutoId(producao.produto_id);
      setQuantidade(producao.quantidade);
      setStatus(producao.status);
      setPrazo(producao.prazo);
    }
  }, [producao]);

  if (!producao) return null;

  const isValid = produtoId > 0 && quantidade > 0 && status && prazo;

  async function salvar() {
    if (!producao || !isValid) return;

    setLoading(true);
    try {
      const payload = { produto_id: produtoId, quantidade, status, prazo };
      await api.put(`/producao/${producao.id}`, payload);
      onUpdated({ ...producao, ...payload });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={!!producao}
      title="Editar Produção"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancelar</button>
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
          <label className="block text-sm font-medium mb-1">Produto</label>
          <select
            value={produtoId}
            onChange={e => setProdutoId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
    </Modal>
  );
}
