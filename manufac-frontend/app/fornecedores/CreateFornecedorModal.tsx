'use client';

import { useState } from "react";
import api from "../../utils/api";
import Modal from "../../components/Modal";
import { Fornecedor } from "../types/fornecedores.types";
import { UFS } from "../types/ufs.types";
import { showSuccess, showError } from "../../utils/toasts";

interface CreateFornecedorModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (f: Fornecedor) => void;
}

export default function CreateFornecedorModal({
  open,
  onClose,
  onCreated,
}: CreateFornecedorModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState<"PF" | "PJ">("PJ");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [contatoResponsavel, setContatoResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  const isValid =
    nome.trim() &&
    email.trim() &&
    telefone.trim() &&
    endereco.trim() &&
    estado &&
    contatoResponsavel.trim() &&
    (tipo === "PF" ? cpf.trim() : cnpj.trim());

  async function criar() {
    if (!isValid) {
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
        cpf: tipo === "PF" ? cpf : null,
        cnpj: tipo === "PJ" ? cnpj : null,
        endereco,
        cidade,
        estado,
        contato_responsavel: contatoResponsavel,
        observacoes,
        ativo,
      };

      const res = await api.post<Fornecedor>("/fornecedores", payload);
      onCreated(res.data);
      showSuccess("Fornecedor cadastrado com sucesso");
      onClose();
    } catch {
      showError("Erro ao cadastrar fornecedor");
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
      <div className="space-y-4">
        <input className="w-full px-3 py-2 border rounded-lg" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <input className="w-full px-3 py-2 border rounded-lg" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full px-3 py-2 border rounded-lg" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
        </div>

        <select className="w-full px-3 py-2 border rounded-lg" value={tipo} onChange={e => setTipo(e.target.value as "PF" | "PJ")}>
          <option value="PF">Pessoa Física</option>
          <option value="PJ">Pessoa Jurídica</option>
        </select>

        {tipo === "PF" && <input className="w-full px-3 py-2 border rounded-lg" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />}
        {tipo === "PJ" && <input className="w-full px-3 py-2 border rounded-lg" placeholder="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)} />}

        <input className="w-full px-3 py-2 border rounded-lg" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <input className="w-full px-3 py-2 border rounded-lg" placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} />
          <select className="w-full px-3 py-2 border rounded-lg" value={estado} onChange={e => setEstado(e.target.value)}>
            <option value="">Estado</option>
            {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>

        <input className="w-full px-3 py-2 border rounded-lg" placeholder="Contato responsável" value={contatoResponsavel} onChange={e => setContatoResponsavel(e.target.value)} />

        <textarea className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Observações" value={observacoes} onChange={e => setObservacoes(e.target.value)} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} />
          Fornecedor ativo
        </label>
      </div>
    </Modal>
  );
}
