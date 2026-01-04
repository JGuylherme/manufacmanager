'use client';

import { useEffect, useState } from "react";
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

interface EditProdutoModalProps {
  produto: Produto | null;
  onClose: () => void;
  onUpdated: (produtoAtualizado: Produto) => void;
}

export default function EditProdutoModal({
  produto,
  onClose,
  onUpdated,
}: EditProdutoModalProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cor, setCor] = useState("");
  const [preco, setPreco] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setCategoria(produto.categoria);
      setCor(produto.cor);
      setPreco(String(produto.preco));
    }
  }, [produto]);

  if (!produto) return null;

  const isValid =
    nome.trim().length > 0 &&
    categoria.trim().length > 0 &&
    Number(preco) > 0;

  async function salvar() {
    if (!produto || !isValid) return;

    setLoading(true);
    try {
      const payload = {
        nome,
        categoria,
        cor,
        preco: Number(preco),
        estoque: produto.estoque,
      };

      await api.put(`/produtos/${produto.id}`, payload);

      onUpdated({
        ...produto,
        ...payload,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={!!produto}
      title="Editar Produto"
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
            className="px-4 py-2 rounded-lg bg-blue-600 text-white
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Categoria
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cor
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            placeholder="Cor"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
