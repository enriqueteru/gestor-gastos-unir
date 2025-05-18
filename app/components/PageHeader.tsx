'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('No autorizado');
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, [pathname]);

  const isDashboard = pathname === '/dashboard';
  const isLoggedIn = Boolean(user);

  return (
    <div className="flex flex-col bg-gray-100 min-h-[4rem]">
      <header className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {!isDashboard && isLoggedIn && (
              <button
                onClick={() => router.back()}
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Volver
              </button>
            )}
            <Link href="/dashboard" className="text-lg font-semibold hover:underline">
              Gestor de gastos
            </Link>
            {isLoggedIn && user?.name && (
              <span className="text-sm text-gray-600">({user.name})</span>
            )}
          </div>

          <nav className="flex gap-4 text-sm items-center">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/auth/login';
                }}
                className="text-red-500 hover:underline"
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="hover:underline text-blue-600">Iniciar sesión</Link>
                <Link href="/auth/register" className="hover:underline text-blue-600">Registrarse</Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}
