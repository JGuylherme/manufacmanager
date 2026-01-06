'use client';

import { useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

import { Cliente } from "../types/clientes.types";

import { UFS } from "../types/ufs.types";

import { showSuccess, showError } from "../../utils/toasts";

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
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState<"PF" | "PJ">("PF");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  const isValid =
    nome.trim() &&
    email.trim() &&
    telefone.trim() &&
    endereco.trim() &&
    estado &&
    (tipo === "PF" ? cpf.trim() : cnpj.trim());

  async function criar() {
    if (!isValid) {
      showError("Preencha todos os campos obrigatórios");
      return;
    }

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

      const res = await api.post<Cliente>("/clientes", payload);

      onCreated(res.data);
      showSuccess("Cliente cadastrado com sucesso");
      onClose();

      setNome("");
      setEmail("");
      setTelefone("");
      setEndereco("");
      setCidade("");
      setEstado("");
      setTipo("PF");
      setCpf("");
      setCnpj("");
      setObservacoes("");
      setAtivo(true);
    } catch {
      showError("Erro ao cadastrar cliente");
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
      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        {/* Email / Telefone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              className="w-full px-3 py-2 border rounded-lg"
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
            className="w-full px-3 py-2 border rounded-lg"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

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
                <option key={uf} value={uf}>
                  {uf}
                </option>
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
