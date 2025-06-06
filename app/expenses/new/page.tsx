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
  const [percentageError, setPercentageError] = useState('');
  const [errorIndex, setErrorIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (mode === 'equal' && amount > 0 && participants.length > 0) {
      const valuePerPerson = parseFloat((amount / participants.length).toFixed(2));
      setParticipants((prev) =>
        prev.map((p) => ({ ...p, value: valuePerPerson }))
      );
    }
  }, [mode, amount, participants.length]);

  const addParticipant = () => {
    if (participants.length >= users.length) return;
    setParticipants([...participants, { userId: '', value: 0 }]);
  };
  const handlePercentageChange = (idx: number, value: number) => {
    const updated = [...participants];
    updated[idx].value = Number(value);
    const total = updated.reduce((acc, p) => acc + p.value, 0);

    if (total > 100) {
      setPercentageError('La suma de los porcentajes no puede superar el 100%');
      setErrorIndex(idx);
    } else {
      setPercentageError('');
      setErrorIndex(null);
    }
    setParticipants(updated);
  };

  const updateParticipant = (
      index: number,
      field: 'userId' | 'value',
      value: string | number
  ) => {
    const updated = [...participants];
    if (field === 'value') {
      updated[index].value = Number(value);
    } else {
      updated[index].userId = value as string;
    }
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'percentage') {
      const total = participants.reduce((acc, p) => acc + p.value, 0);
      if (total !== 100) {
        setError('La suma de porcentajes debe ser exactamente 100%.');
        return;
      }
    } else if (mode === 'custom') {
      const total = participants.reduce((acc, p) => acc + p.value, 0);
      if (total !== amount) {
        setError('La suma personalizada debe ser igual al importe total.');
        return;
      }
    }

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

        <div className="space-y-2">
          <label className="block text-sm">Participantes</label>
          {participants.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select className="border p-2 rounded w-1/2" value={p.userId} onChange={(e) => updateParticipant(i, 'userId', e.target.value)} required>
                <option value="">Seleccionar</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              {mode === 'percentage' ? (
                  <div className="w-1/2">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className={`border p-2 rounded w-full ${errorIndex === i ? 'border-red-500' : ''}`}
                        value={p.value}
                        onChange={e => handlePercentageChange(i, Number(e.target.value))}
                        placeholder="% de participación"
                        required
                    />
                    {percentageError && errorIndex === i && (
                        <p className="text-red-500 text-xs mt-1">{percentageError}</p>
                    )}
                  </div>
              ) : (
                  <input
                      type="number"
                      className="border p-2 rounded w-1/2"
                      value={p.value}
                      onChange={e => updateParticipant(i, 'value', e.target.value)}
                      placeholder="Cantidad €"
                      required
                      disabled={mode === 'equal'}
                  />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addParticipant}
            className={`text-sm underline mt-1 ${participants.length >= users.length ? 'text-gray-400 cursor-not-allowed' : ''}`}
            disabled={participants.length >= users.length}
          >
            + Añadir participante
          </button>
        </div>

        {error && !percentageError && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear gasto</button>
      </form>
    </main>
  );
}
