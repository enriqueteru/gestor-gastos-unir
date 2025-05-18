'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/auth/login');

    const load = async () => {
      const me = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      setUser(me);

      const data = await fetch(`/api/users/${me.id}/summary`).then((r) => r.json());
      setSummary(data);
      setLoading(false);
    };
    load();
  }, [router]);

  if (loading) return <div className="p-6 text-center">Cargando panel...</div>;
  if (!user || !summary) return <div className="p-6 text-center">No hay datos disponibles.</div>;

  const createdByMe = summary.history.filter((e: any) => e.paidBy.id === user.id);
  const debts = summary.history.filter((e: any) =>
    e.divisions.some((d: any) => d.user.id === user.id && !d.paid)
  );
  const paid = summary.history.filter((e: any) =>
    e.divisions.some((d: any) => d.user.id === user.id && d.paid)
  );

  const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));
  summary.history.forEach((e: any) => {
    const m = new Date(e.date).getMonth();
    monthlyTotals[m].total += e.paidBy.id === user.id ? e.amount : 0;
  });

  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Gastos creados por mes',
        data: monthlyTotals.map((m) => m.total),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  return (
    <main className="px-6 py-10 max-w-screen-xl mx-auto text-gray-800 space-y-16">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total pagado</p>
            <p className="text-3xl font-bold">{summary.totalPagado.toFixed(2)} €</p>
          </div>
          <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl p-6  shadow-sm">
            <p className="text-sm text-gray-500">Total consumido</p>
            <p className="text-3xl font-bold">{summary.totalConsumido.toFixed(2)} €</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Saldo</p>
            <p className={`text-3xl font-bold ${summary.saldo >= 0 ? 'text-green-600' : 'text-red-500'}`}>{summary.saldo.toFixed(2)} €</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">📈 Evolución mensual</h3>
          <Line data={chartData} />
        </div>
      </section>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mis gastos</h2>
        <button
          onClick={() => router.push('/expenses/new')}
          className="px-5 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          + Nuevo gasto
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-lg font-medium mb-4">🧾 Creados por mí</h3>
          {createdByMe.length === 0 ? (
            <p className="text-sm text-gray-500">Todavía no has creado ningún gasto. ¡Empieza creando uno!</p>
          ) : (
            <ul className="space-y-3">
              {createdByMe.map((e: any) => (
                <li key={e.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <Link href={`/expenses/${e.id}`} className="font-medium text-blue-600 hover:underline">
                    {e.description}
                  </Link>
                  <p className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">💸 Deudas pendientes</h3>
          {debts.length === 0 ? (
            <p className="text-sm text-green-600">🎉 No tienes deudas pendientes. ¡Buen trabajo!</p>
          ) : (
            <ul className="space-y-3">
              {debts.map((e: any) => (
                <li key={e.id} className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <Link href={`/expenses/${e.id}`} className="font-medium text-yellow-700 hover:underline">
                        {e.description}
                      </Link>
                      <p className="text-xs text-gray-600">{new Date(e.date).toLocaleDateString()} — pagado por {e.paidBy.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">
                      {e.divisions.find((d: any) => d.user.id === user.id)?.amountOwed.toFixed(2)} €
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-lg font-medium mb-4">✅ Pagos realizados</h3>
        {paid.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no has pagado ningún gasto.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paid.map((e: any) => (
              <li key={e.id} className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/expenses/${e.id}`} className="font-medium text-green-700 hover:underline">
                      {e.description}
                    </Link>
                    <p className="text-xs text-gray-600">{new Date(e.date).toLocaleDateString()} — pagado por {e.paidBy.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">
                    {e.divisions.find((d: any) => d.user.id === user.id)?.amountOwed.toFixed(2)} €
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
