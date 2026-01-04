'use client';

import { useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  criado_em?: string;
}

interface CreateClienteModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (cliente: Cliente) => void;
}

export default function CreateClienteModal({
  open,
  onClose,
  onCreated,
}: CreateClienteModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid =
    nome.trim() &&
    email.trim() &&
    telefone.trim() &&
    endereco.trim();

  async function criar() {
    if (!isValid) return;

    setLoading(true);
    try {
      const payload = { nome, email, telefone, endereco };
      const res = await api.post<Cliente>("/clientes", payload);
      onCreated(res.data);
      onClose();

      setNome("");
      setEmail("");
      setTelefone("");
      setEndereco("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Novo Cliente"
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
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
