// __tests__/api/users/summary.test.ts
import { GET } from '../../../app/api/users/[id]/summary/route';

import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
    prisma: {
      user: {
        findUnique: jest.fn(),
      },
      expense: {
        aggregate: jest.fn(),
        findMany: jest.fn(),
      },
      division: {
        aggregate: jest.fn(),
      },
    },
  }));
  
  describe('/api/users/:id/summary', () => {
    const userId = 'user-123';
  
    beforeEach(() => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId });
      (prisma.expense.aggregate as jest.Mock).mockResolvedValue({ _sum: { amount: 200 } });
      (prisma.division.aggregate as jest.Mock).mockResolvedValue({ _sum: { amountOwed: 100 } });
      (prisma.expense.findMany as jest.Mock).mockResolvedValue([]);
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('GET retorna el resumen del usuario correctamente', async () => {
      const res = await GET(new Request(`http://localhost/api/users/${userId}/summary`), { params: { id: userId } });
      const json = await res.json();
  
      expect(res.status).toBe(200);
      expect(json).toEqual({
        userId: 'user-123',
        totalPagado: 200,
        totalConsumido: 100,
        saldo: 100,
        history: [],
      });
    });
  });
  