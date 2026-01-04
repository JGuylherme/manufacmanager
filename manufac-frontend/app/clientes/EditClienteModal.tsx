'use client';

import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";
import { Cliente } from "./CreateClienteModal";

interface EditClienteModalProps {
  cliente: Cliente | null;
  onClose: () => void;
  onUpdated: (clienteAtualizado: Cliente) => void;
}

export default function EditClienteModal({
  cliente,
  onClose,
  onUpdated,
}: EditClienteModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setEmail(cliente.email);
      setTelefone(cliente.telefone);
      setEndereco(cliente.endereco);
    }
  }, [cliente]);

  if (!cliente) return null;

  const isValid =
    nome.trim() &&
    email.trim() &&
    telefone.trim() &&
    endereco.trim();

  async function salvar() {
    if (!cliente || !isValid) return;

    setLoading(true);
    try {
      const payload = { nome, email, telefone, endereco };
      await api.put(`/clientes/${cliente.id}`, payload);
      onUpdated({ ...cliente, ...payload });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={!!cliente}
      title="Editar Cliente"
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
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
