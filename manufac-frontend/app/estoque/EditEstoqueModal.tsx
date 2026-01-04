'use client';

import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

interface Estoque {
  id: number;
  produto_id: number;
  quantidade: number;
  tipo: string;
  data: string;
}

interface Produto {
  id: number;
  nome: string;
}

interface EditEstoqueModalProps {
  registro: Estoque | null;
  onClose: () => void;
  onUpdated: (r: Estoque) => void;
  produtos: Produto[];
}

export default function EditEstoqueModal({ registro, onClose, onUpdated, produtos }: EditEstoqueModalProps) {
  const [produtoId, setProdutoId] = useState<number>(registro?.produto_id || 0);
  const [quantidade, setQuantidade] = useState<number>(registro?.quantidade || 0);
  const [tipo, setTipo] = useState(registro?.tipo || "Entrada");
  const [data, setData] = useState(registro?.data.slice(0, 16) || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (registro) {
      setProdutoId(registro.produto_id);
      setQuantidade(registro.quantidade);
      setTipo(registro.tipo);
      setData(registro.data.slice(0,16));
    }
  }, [registro]);

  if (!registro) return null;

  const isValid = produtoId > 0 && quantidade > 0 && tipo.trim() !== "" && data;

  async function salvar() {
    if (!registro || !isValid) return;

    setLoading(true);
    try {
      const payload = { produto_id: produtoId, quantidade, tipo, data };
      await api.put(`/estoque/${registro.id}`, payload);
      onUpdated({ ...registro, ...payload });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={!!registro}
      title="Editar Registro de Estoque"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancelar</button>
          <button onClick={salvar} disabled={loading || !isValid} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
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
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300">
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            type="datetime-local"
            value={data}
            onChange={e => setData(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
    </Modal>
  );
}
