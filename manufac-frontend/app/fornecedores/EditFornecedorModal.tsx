'use client';

import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

interface Fornecedor {
  id: number;
  nome: string;
  contato: string;
}

interface EditFornecedorModalProps {
  fornecedor: Fornecedor | null;
  onClose: () => void;
  onUpdated: (fAtualizado: Fornecedor) => void;
}

export default function EditFornecedorModal({ fornecedor, onClose, onUpdated }: EditFornecedorModalProps) {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fornecedor) {
      setNome(fornecedor.nome);
      setContato(fornecedor.contato);
    }
  }, [fornecedor]);

  if (!fornecedor) return null;

  const isValid = nome.trim().length > 0 && contato.trim().length > 0;

  async function salvar() {
    if (!fornecedor || !isValid) return;

    setLoading(true);
    try {
      const payload = { nome, contato };
      await api.put(`/fornecedores/${fornecedor.id}`, payload);
      onUpdated({ ...fornecedor, ...payload });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={!!fornecedor}
      title="Editar Fornecedor"
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
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contato</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            value={contato}
            onChange={e => setContato(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
