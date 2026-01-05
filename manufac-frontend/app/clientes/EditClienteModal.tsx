'use client';

import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

import { Cliente } from "../types/clientes.types";

import { UFS } from "../types/ufs.types";

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
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState<"PF" | "PJ">("PF");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setEmail(cliente.email);
      setTelefone(cliente.telefone);
      setEndereco(cliente.endereco);
      setCidade(cliente.cidade || "");
      setEstado(cliente.estado || "");
      setTipo(cliente.tipo);
      setCpf(cliente.cpf || "");
      setCnpj(cliente.cnpj || "");
      setObservacoes(cliente.observacoes || "");
      setAtivo(cliente.ativo);
    }
  }, [cliente]);

  if (!cliente) return null;

  const isValid =
    nome.trim() &&
    email.trim() &&
    telefone.trim() &&
    endereco.trim() &&
    estado &&
    (tipo === "PF" ? cpf.trim() : cnpj.trim());

  async function salvar() {
    if (!cliente || !isValid) return;

    setLoading(true);
    try {
      const payload = {
        nome,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        tipo,
        cpf: tipo === "PF" ? cpf : null,
        cnpj: tipo === "PJ" ? cnpj : null,
        observacoes,
        ativo,
      };

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
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        {/* Email / Telefone */}
        <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "PF" | "PJ")}
          >
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </select>
        </div>

        {/* CPF / CNPJ */}
        {tipo === "PF" && (
          <div>
            <label className="block text-sm font-medium mb-1">CPF</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>
        )}
        {tipo === "PJ" && (
          <div>
            <label className="block text-sm font-medium mb-1">CNPJ</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
          </div>
        )}

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

        {/* Cidade / Estado */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Selecione o estado</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        {/* Ativo */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          Cliente ativo
        </label>
      </div>
    </Modal>
  );
}
