'use client';

import { useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

interface Fornecedor {
  id: number;
  nome: string;
  contato: string;
}

interface CreateFornecedorModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (f: Fornecedor) => void;
}

export default function CreateFornecedorModal({ open, onClose, onCreated }: CreateFornecedorModalProps) {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = nome.trim().length > 0 && contato.trim().length > 0;

  async function criar() {
    if (!isValid) return;

    setLoading(true);
    try {
      const payload = { nome, contato };
      const res = await api.post<Fornecedor>("/fornecedores", payload);
      onCreated(res.data);
      onClose();

      setNome("");
      setContato("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Novo Fornecedor"
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
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contato</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={contato}
            onChange={e => setContato(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
