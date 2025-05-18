'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const divisionModes = [
  { value: 'equal', label: 'A partes iguales' },
  { value: 'percentage', label: 'Por porcentaje' },
  { value: 'custom', label: 'Cantidad personalizada' },
];

export default function NewExpensePage() {
  const router = useRouter();
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState('');
  const [paidById, setPaidById] = useState('');
  const [mode, setMode] = useState<'equal' | 'percentage' | 'custom'>('equal');
  const [participants, setParticipants] = useState<{ userId: string; value: number }[]>([]);
  const [error, setError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (mode === 'equal') {
      const equally = users
        .filter((u) => u.id !== paidById)
        .map((u) => ({
          userId: u.id,
          value: Number((amount / (users.length - 1)).toFixed(2)),
        }));
      setParticipants(equally);
    } else {
      setParticipants([]);
    }
  }, [mode, amount, paidById, users]);

  useEffect(() => {
    if (!amount || !paidById || !description || !date) {
      setError('Todos los campos son obligatorios.');
      setCanSubmit(false);
      return;
    }

    if (mode !== 'equal') {
      if (participants.length === 0) {
        setError('Debe haber al menos un participante.');
        setCanSubmit(false);
        return;
      }

      const total = participants.reduce((acc, p) => acc + p.value, 0);
      if (mode === 'percentage') {
        if (total > 100) {
          setError('La suma de porcentajes no puede superar el 100%.');
          setCanSubmit(false);
          return;
        } else if (total < 100) {
          setError('La suma de porcentajes debe ser 100%.');
          setCanSubmit(false);
          return;
        }
      }
      if (mode === 'custom') {
        if (total > amount) {
          setError('La suma personalizada no puede superar el importe total.');
          setCanSubmit(false);
          return;
        } else if (total < amount) {
          setError('La suma personalizada debe ser igual al importe total.');
          setCanSubmit(false);
          return;
        }
      }
    }

    setError('');
    setCanSubmit(true);
  }, [description, amount, date, paidById, mode, participants]);

  const addParticipant = () => {
    setParticipants([...participants, { userId: '', value: 0 }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: 'userId' | 'value', value: any) => {
    const updated = [...participants];
    updated[index][field] = field === 'value' ? Number(value) : value;
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const body = {
      description,
      amount,
      date,
      paidById,
      mode,
      participants,
    };

    const res = await fetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al crear el gasto.');
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-xl font-semibold">Nuevo gasto</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Descripción</label>
          <input className="w-full border p-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm">Importe total (€)</label>
          <input type="number" className="w-full border p-2 rounded" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
        </div>

        <div>
          <label className="block text-sm">Fecha</label>
          <input type="date" className="w-full border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm">Pagado por</label>
          <select className="w-full border p-2 rounded" value={paidById} onChange={(e) => setPaidById(e.target.value)} required>
            <option value="">Seleccionar usuario</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Tipo de división</label>
          <select className="w-full border p-2 rounded" value={mode} onChange={(e) => setMode(e.target.value as any)}>
            {divisionModes.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {(mode === 'percentage' || mode === 'custom') && (
          <div className="space-y-2">
            <label className="block text-sm">Participantes</label>
            {participants.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  className="border p-2 rounded w-1/3"
                  value={p.userId}
                  onChange={(e) => updateParticipant(i, 'userId', e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  {users
                    .filter((u) => u.id !== paidById || u.id === p.userId)
                    .filter((u) => !participants.some((pt, idx) => idx !== i && pt.userId === u.id))
                    .map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
                <input
                  type="number"
                  className="border p-2 rounded w-1/3"
                  value={p.value}
                  onChange={(e) => updateParticipant(i, 'value', e.target.value)}
                  placeholder={mode === 'percentage' ? '% participación' : '€'}
                  required
                />
                <button type="button" onClick={() => removeParticipant(i)} className="text-sm text-red-500 hover:underline">Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={addParticipant} className="text-sm underline mt-1">+ Añadir participante</button>
          </div>
        )}

        {mode === 'equal' && participants.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm">Vista previa de participantes (a partes iguales)</label>
            <ul className="text-sm list-disc list-inside text-gray-700">
              {participants.map((p) => {
                const name = users.find((u) => u.id === p.userId)?.name || 'Usuario';
                return (
                  <li key={p.userId}>{name}: {p.value.toFixed(2)} €</li>
                );
              })}
            </ul>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Crear gasto
        </button>
      </form>
    </main>
  );
}
