'use client';

import Modal from "../../components/Modal";
import { Fornecedor } from "../types/fornecedores.types";

interface ViewFornecedorModalProps {
  fornecedor: Fornecedor | null;
  onClose: () => void;
}

export default function ViewFornecedorModal({
  fornecedor,
  onClose,
}: ViewFornecedorModalProps) {
  if (!fornecedor) return null;

  return (
    <Modal
      open={!!fornecedor}
      title="Detalhes do Fornecedor"
      onClose={onClose}
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Fechar
        </button>
      }
    >
      <div className="space-y-6">

        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Identificação
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Nome</label>
              <p className="text-gray-800 font-medium">{fornecedor.nome}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">Tipo</label>
              <p className="text-gray-800">{fornecedor.tipo}</p>
            </div>

            {fornecedor.tipo === "PF" && (
              <div>
                <label className="text-xs text-gray-500">CPF</label>
                <p className="text-gray-800">{fornecedor.cpf || '-'}</p>
              </div>
            )}

            {fornecedor.tipo === "PJ" && (
              <div>
                <label className="text-xs text-gray-500">CNPJ</label>
                <p className="text-gray-800">{fornecedor.cnpj || '-'}</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Contato
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <p className="text-gray-800">{fornecedor.email}</p>
            </div>

            <div>
              <label className="text-xs text-gray-500">Telefone</label>
              <p className="text-gray-800">{fornecedor.telefone}</p>
            </div>

            <div className="col-span-2">
              <label className="text-xs text-gray-500">
                Contato Responsável
              </label>
              <p className="text-gray-800">
                {fornecedor.contato_responsavel || '-'}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Endereço
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Endereço</label>
              <p className="text-gray-800">{fornecedor.endereco}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Cidade</label>
                <p className="text-gray-800">{fornecedor.cidade || '-'}</p>
              </div>

              <div>
                <label className="text-xs text-gray-500">Estado</label>
                <p className="text-gray-800">{fornecedor.estado || '-'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Informações adicionais
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Observações</label>
              <p className="text-gray-800">
                {fornecedor.observacoes || '-'}
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500">Status</label>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  fornecedor.ativo
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {fornecedor.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </section>

      </div>
    </Modal>
  );
}
