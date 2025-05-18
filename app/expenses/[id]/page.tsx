'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [expense, setExpense] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      const meRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await meRes.json();
      setUserId(me.id);

      const res = await fetch(`/api/expenses/${id}`);
      const data = await res.json();
      setExpense(data);
    };

    fetchData();
  }, [id]);

  const handlePay = async (divisionId: string) => {
    setPaying(true);
    const res = await fetch(`/api/debts/${divisionId}/pay`, { method: 'POST' });
    if (res.ok) {
      setExpense((prev: any) => ({
        ...prev,
        divisions: prev.divisions.map((d: any) =>
          d.id === divisionId ? { ...d, paid: true } : d
        ),
      }));
    } else {
      setError('No se pudo pagar la deuda');
    }
    setPaying(false);
  };

  if (!expense) return <p className="p-4">Cargando...</p>;

  const paidByName = expense?.paidBy?.name || 'Desconocido';

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{expense.description}</h1>
        <p className="text-gray-600 text-sm">
          {new Date(expense.date).toLocaleDateString()} — Pagado por {paidByName}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Participantes</h2>
        <ul className="text-sm space-y-2">
          {expense.divisions.map((d: any) => (
            <li key={d.id} className="flex justify-between items-center">
              <div>
                {d.user.name} debe {d.amountOwed.toFixed(2)} €
              </div>
              {d.paid ? (
                <span className="text-green-600 text-sm">Pagado</span>
              ) : d.user.id === userId ? (
                <button
                  onClick={() => handlePay(d.id)}
                  className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  disabled={paying}
                >
                  Pagar
                </button>
              ) : (
                <span className="text-red-500 text-sm">Pendiente</span>
              )}
            </li>
          ))}
        </ul>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    </main>
  );
}
