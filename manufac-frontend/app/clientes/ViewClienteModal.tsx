'use client';

import { Cliente } from "../types/clientes.types";
import Modal from '../../components/Modal';

interface ViewClienteModalProps {
  cliente: Cliente | null;
  onClose: () => void;
}

export default function ViewClienteModal({ cliente, onClose }: ViewClienteModalProps) {
  if (!cliente) return null;

  return (
    <Modal
      open={!!cliente}
      title="Detalhes do Cliente"
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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Nome</label>
          <p className="text-gray-800">{cliente.nome}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <p className="text-gray-800">{cliente.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Telefone</label>
          <p className="text-gray-800">{cliente.telefone}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Endereço</label>
          <p className="text-gray-800">{cliente.endereco}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-500">Cidade</label>
            <p className="text-gray-800">{cliente.cidade || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Estado</label>
            <p className="text-gray-800">{cliente.estado || '-'}</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-500">Tipo</label>
        <p className="text-gray-800">{cliente.tipo}</p>
      </div>
      {cliente.tipo === 'PF' && (
        <div>
          <label className="block text-sm font-medium text-gray-500">CPF</label>
          <p className="text-gray-800">{cliente.cpf || '-'}</p>
        </div>
      )}
      {cliente.tipo === 'PJ' && (
        <div>
          <label className="block text-sm font-medium text-gray-500">CNPJ</label>
          <p className="text-gray-800">{cliente.cnpj || '-'}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-500">Observações</label>
        <p className="text-gray-800">{cliente.observacoes || '-'}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500">Ativo</label>
        <p className="text-gray-800">{cliente.ativo ? 'Sim' : 'Não'}</p>
      </div>
    </Modal>
  );
}
