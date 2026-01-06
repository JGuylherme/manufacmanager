'use client';

import { useEffect, useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";

import { Fornecedor } from "../types/fornecedores.types";
import { UFS } from "../types/ufs.types";

import { showSuccess, showError } from "../../utils/toasts";

interface EditFornecedorModalProps {
  fornecedor: Fornecedor | null;
  onClose: () => void;
  onUpdated: (fornecedorAtualizado: Fornecedor) => void;
}

export default function EditFornecedorModal({
  fornecedor,
  onClose,
  onUpdated,
}: EditFornecedorModalProps) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState<"PF" | "PJ">("PF");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [contatoResponsavel, setContatoResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fornecedor) {
      setNome(fornecedor.nome);
      setEmail(fornecedor.email);
      setTelefone(fornecedor.telefone);
      setTipo(fornecedor.tipo);
      setCpf(fornecedor.cpf || "");
      setCnpj(fornecedor.cnpj || "");
      setEndereco(fornecedor.endereco);
      setCidade(fornecedor.cidade || "");
      setEstado(fornecedor.estado || "");
      setContatoResponsavel(fornecedor.contato_responsavel);
      setObservacoes(fornecedor.observacoes || "");
      setAtivo(fornecedor.ativo);
    }
  }, [fornecedor]);

  if (!fornecedor) return null;

  const isValid =
    nome.trim() &&
    email.trim() &&
    telefone.trim() &&
    endereco.trim() &&
    contatoResponsavel.trim() &&
    estado &&
    (tipo === "PF" ? cpf.trim() : cnpj.trim());

  async function salvar() {
    if (!fornecedor || !isValid) {
      showError("Preencha os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome,
        email,
        telefone,
        tipo,
        cpf: tipo === "PF" ? cpf : undefined,
        cnpj: tipo === "PJ" ? cnpj : undefined,
        endereco,
        cidade,
        estado,
        contato_responsavel: contatoResponsavel,
        observacoes,
        ativo,
      };

      await api.put(`/fornecedores/${fornecedor.id}`, payload);

      const fornecedorAtualizado: Fornecedor = {
        id: fornecedor.id,
        ...payload,
      };

      onUpdated(fornecedorAtualizado);
      showSuccess("Fornecedor atualizado com sucesso");
      onClose();
    } catch {
      showError("Erro ao atualizar fornecedor");
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
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

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
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contato responsável
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg"
            value={contatoResponsavel}
            onChange={(e) => setContatoResponsavel(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          Fornecedor ativo
        </label>

      </div>
    </Modal>
  );
}
