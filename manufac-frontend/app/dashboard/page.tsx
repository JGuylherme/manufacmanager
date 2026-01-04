import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao sistema de gestão
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">Pedidos</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">124</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">Produtos</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">58</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">Clientes</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">32</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">Produção Ativa</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">7</p>
          </div>
        </div>

        <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Atividades recentes
          </h2>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>📦 Pedido #1024 criado</li>
            <li>🧵 Produção iniciada para Camiseta Azul</li>
            <li>👤 Novo cliente cadastrado</li>
            <li>📊 Estoque atualizado</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
