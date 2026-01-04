'use client';

import { useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  tamanho: string;
  cor: string;
  preco: number;
  estoque: number;
}

interface CreateProdutoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (produto: Produto) => void;
}

export default function CreateProdutoModal({
  open,
  onClose,
  onCreated,
}: CreateProdutoModalProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cor, setCor] = useState("");
  const [preco, setPreco] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid =
    nome.trim().length > 0 &&
    categoria.trim().length > 0 &&
    Number(preco) > 0;

  async function criar() {
    if (!isValid) return;

    setLoading(true);
    try {
      const payload = {
        nome,
        categoria,
        cor,
        preco: Number(preco),
        estoque: 0,
      };

      const res = await api.post<Produto>("/produtos", payload);
      onCreated(res.data);
      onClose();

      setNome("");
      setCategoria("");
      setCor("");
      setPreco("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Novo Produto"
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
            className="px-4 py-2 rounded-lg bg-green-600 text-white
                       hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome do produto
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Categoria
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cor
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Preço
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
