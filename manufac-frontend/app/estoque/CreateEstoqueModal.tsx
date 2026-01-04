'use client';

import { useState } from "react";
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

interface CreateEstoqueModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (r: Estoque) => void;
  produtos: Produto[];
}

export default function CreateEstoqueModal({ open, onClose, onCreated, produtos }: CreateEstoqueModalProps) {
  const [produtoId, setProdutoId] = useState<number>(produtos[0]?.id || 0);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [tipo, setTipo] = useState("Entrada");
  const [data, setData] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);

  const isValid = produtoId > 0 && quantidade > 0 && tipo.trim() !== "" && data;

  async function criar() {
    if (!isValid) return;

    setLoading(true);
    try {
      const payload = { produto_id: produtoId, quantidade, tipo, data };
      const res = await api.post<Estoque>("/estoque", payload);
      onCreated(res.data);
      onClose();
      setProdutoId(produtos[0]?.id || 0);
      setQuantidade(0);
      setTipo("Entrada");
      setData(new Date().toISOString().slice(0, 16));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Novo Registro de Estoque"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancelar</button>
          <button onClick={criar} disabled={loading || !isValid} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
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
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300">
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>
    </Modal>
  );
}
