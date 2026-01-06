export interface Fornecedor {
  id: number;
  nome: string;
  email: string;
  telefone: string;

  tipo: "PF" | "PJ";
  cpf?: string;
  cnpj?: string;

  endereco: string;
  cidade?: string;
  estado?: string;

  contato_responsavel: string;

  observacoes?: string;
  ativo: boolean;
}