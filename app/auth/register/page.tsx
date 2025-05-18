'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Registro
    const registerRes = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    const registerData = await registerRes.json();

    if (registerData.error) {
      setMessage(registerData.error);
      return;
    }

    // Login automático
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: form.email, password: form.password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const loginData = await loginRes.json();

    if (loginData.error || !loginData.token) {
      setMessage(loginData.error || 'Error al iniciar sesión automáticamente');
      return;
    }

    // Guardar token y redirigir
    localStorage.setItem('token', loginData.token);
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Registrarse
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
