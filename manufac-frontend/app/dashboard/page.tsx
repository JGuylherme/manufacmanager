'use client';

import { useEffect, useState } from "react";
import api from "../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

/* ===== Interfaces ===== */

interface Pedido {
  id: number;
  cliente_id: number;
  status: string;
}

interface Produto {
  id: number;
  nome: string;
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

interface Producao {
  id: number;
  produto_id: number;
  status: string;
}

interface DashboardStats {
  pedidos: number;
  produtos: number;
  clientes: number;
  producoesAtivas: number;
}

interface Atividade {
  id: number;
  tipo: "pedido" | "producao" | "cliente";
  descricao: string;
}

/* ===== Página ===== */

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    pedidos: 0,
    produtos: 0,
    clientes: 0,
    producoesAtivas: 0,
  });

  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [
          pedidosRes,
          produtosRes,
          clientesRes,
          producaoRes,
        ] = await Promise.all([
          api.get<Pedido[]>("/pedidos"),
          api.get<Produto[]>("/produtos"),
          api.get<Cliente[]>("/clientes"),
          api.get<Producao[]>("/producao"),
        ]);

        const producoesAtivas = producaoRes.data.filter(
          p => p.status === "Em Andamento" || p.status === "Pendente"
        );

        setStats({
          pedidos: pedidosRes.data.length,
          produtos: produtosRes.data.length,
          clientes: clientesRes.data.length,
          producoesAtivas: producoesAtivas.length,
        });

        const atividadesRecentes: Atividade[] = [
          ...pedidosRes.data.slice(-3).map((p) => ({
            id: p.id,
            tipo: "pedido" as const,
            descricao: `📦 Pedido #${p.id} criado`,
          })),
          ...producaoRes.data.slice(-3).map((p) => ({
            id: p.id,
            tipo: "producao" as const,
            descricao: `🧵 Produção iniciada para produto ${p.produto_id}`,
          })),
          ...clientesRes.data.slice(-3).map((c) => ({
            id: c.id,
            tipo: "cliente" as const,
            descricao: `👤 Novo cliente cadastrado: ${c.nome}`,
          })),
        ]
          .reverse()
          .slice(0, 6);

        setAtividades(atividadesRecentes);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral do sistema em tempo real
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando dados...</p>
        ) : (
          <>
            {/* CARDS */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-sm font-medium text-gray-500">Pedidos</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {stats.pedidos}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-sm font-medium text-gray-500">Produtos</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {stats.produtos}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-sm font-medium text-gray-500">Clientes</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {stats.clientes}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-sm font-medium text-gray-500">
                  Produção Ativa
                </h3>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {stats.producoesAtivas}
                </p>
              </div>
            </div>

            {/* ATIVIDADES RECENTES */}
            <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Atividades recentes
              </h2>

              {atividades.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhuma atividade recente encontrada.
                </p>
              ) : (
                <ul className="space-y-3 text-sm text-gray-600">
                  {atividades.map((a, index) => (
                    <li key={index}>{a.descricao}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
