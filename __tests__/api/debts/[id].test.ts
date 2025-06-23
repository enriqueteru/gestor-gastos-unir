// __tests__/api/debts/[id].test.ts
import { GET } from '../../../app/api/users/[id]/debts/route';
import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    division: {
      findMany: jest.fn(),
    },
  },
}));

describe('GET /api/debts/[id]', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar 200 y las deudas del usuario', async () => {
    (prisma.division.findMany as jest.Mock).mockResolvedValue([
      { id: 'div-1', amountOwed: 50, expense: { description: 'Cena', date: new Date(), paidBy: { name: 'Ana' } } },
      { id: 'div-2', amountOwed: 30, expense: { description: 'Cine', date: new Date(), paidBy: { name: 'Luis' } } },
    ]);

    const req = new Request('http://localhost/api/debts/user-id');
    const res = await GET(req, { params: { id: 'user-id' } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([
      { id: 'div-1', amount: 50 },
      { id: 'div-2', amount: 30 },
    ]);
  });

  it('debe retornar 500 si ocurre un error', async () => {
    (prisma.division.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost/api/debts/user-id');
    const res = await GET(req, { params: { id: 'user-id' } });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Error al obtener deudas' });
  });
});
