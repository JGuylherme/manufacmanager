'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';

/**
 * Expected response shape from the login endpoint
 */
interface LoginResponse {
  token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    papel: string;
  };
}

/**
 * Local form state structure
 */
interface LoginForm {
  email: string;
  senha: string;
}

export default function LoginPage() {
  const router = useRouter();

  /**
   * Form state (email + password)
   */
  const [form, setForm] = useState<LoginForm>({
    email: '',
    senha: '',
  });

  /**
   * Controls password visibility
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * UI feedback states
   */
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Change handler
   * Uses input `name` attribute to update state
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  /**
   * Handles form submission and authentication flow
   */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post<LoginResponse>('/auth/login', form);
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">

        {/* App icon / visual identity */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
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

        {/* Title & subtitle */}
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          ManufacManager
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Sign in to your account
        </p>

        {/* Error feedback */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              autoFocus
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800
                outline-none transition
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password field with visibility toggle */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                name="senha"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10
                  text-gray-800 outline-none transition
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />

              {/* Toggle password visibility */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye off icon
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.018.152-2 .434-2.924M9.88 9.88a3 3 0 104.243 4.243M6.1 6.1l11.8 11.8"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5
              font-medium text-white transition
              hover:bg-blue-700
              disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Password recovery */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
