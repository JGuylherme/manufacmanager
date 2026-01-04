'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    papel: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, senha });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } })
          ?.response?.data?.error;

      setError(message || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm transition hover:shadow-md">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 className="mb-6 text-center text-xl font-bold text-gray-800">
          Login
        </h3>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 
              text-gray-800 placeholder:text-gray-400
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 
              text-gray-800 placeholder:text-gray-400
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition 
            hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Sign In"}
          </button>

          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
