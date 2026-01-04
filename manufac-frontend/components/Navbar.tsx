'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || pathname === "/login") {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!showNavbar) return null;

  return (
    <nav className="relative z-20 flex h-[70px] w-full items-center justify-between bg-white px-6 md:px-16 shadow-[0px_4px_25px_0px_#0000000D] text-gray-700">

      <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
        <li><Link className="hover:text-blue-600 transition" href="/dashboard">Dashboard</Link></li>
        <li><Link className="hover:text-blue-600 transition" href="/produtos">Produtos</Link></li>
        <li><Link className="hover:text-blue-600 transition" href="/clientes">Clientes</Link></li>
        <li><Link className="hover:text-blue-600 transition" href="/fornecedores">Fornecedores</Link></li>
        <li><Link className="hover:text-blue-600 transition" href="/pedidos">Pedidos</Link></li>
        <li><Link className="hover:text-blue-600 transition" href="/producao">Produção</Link></li>
        <li><Link className="hover:text-blue-600 transition" href="/estoque">Estoque</Link></li>
      </ul>

      <button
        onClick={handleLogout}
        className="hidden md:inline-flex h-9 px-4 items-center justify-center rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 active:scale-95 transition"
      >
        Logout
      </button>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden active:scale-90 transition"
        aria-label="menu"
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor">
          <path d="M3 7h24M3 15h24M3 23h24" />
        </svg>
      </button>

      {mobileOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white p-6 shadow-md md:hidden">
          <ul className="flex flex-col space-y-4 text-sm">
            <li><Link onClick={() => setMobileOpen(false)} href="/dashboard">Dashboard</Link></li>
            <li><Link onClick={() => setMobileOpen(false)} href="/produtos">Produtos</Link></li>
            <li><Link onClick={() => setMobileOpen(false)} href="/clientes">Clientes</Link></li>
            <li><Link onClick={() => setMobileOpen(false)} href="/fornecedores">Fornecedores</Link></li>
            <li><Link onClick={() => setMobileOpen(false)} href="/pedidos">Pedidos</Link></li>
            <li><Link onClick={() => setMobileOpen(false)} href="/producao">Produção</Link></li>
            <li><Link onClick={() => setMobileOpen(false)} href="/estoque">Estoque</Link></li>
          </ul>

          <button
            onClick={handleLogout}
            className="mt-6 h-9 w-full rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 active:scale-95 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
