import { GET } from '../../../app/api/users/balances/route';
import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

describe('GET /api/users/balances', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar los balances correctamente', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        expensesPaid: [{ amount: 100 }, { amount: 50 }],
        divisions: [{ amountOwed: 60 }, { amountOwed: 30 }],
      },
      {
        id: 'user-2',
        name: 'Bob',
        email: 'bob@example.com',
        expensesPaid: [{ amount: 0 }],
        divisions: [{ amountOwed: 40 }],
      },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([
      {
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        totalPagado: 150,
        totalConsumido: 90,
        saldo: 60,
      },
      {
        id: 'user-2',
        name: 'Bob',
        email: 'bob@example.com',
        totalPagado: 0,
        totalConsumido: 40,
        saldo: -40,
      },
    ]);
  });

  it('debe retornar 500 si ocurre un error', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Error interno' });
  });
});
