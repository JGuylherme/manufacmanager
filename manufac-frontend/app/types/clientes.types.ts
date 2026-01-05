export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade?: string;
  estado?: string;
  tipo: "PF" | "PJ";
  cpf?: string | null;
  cnpj?: string | null;
  observacoes?: string | null;
  ativo: boolean;
}
