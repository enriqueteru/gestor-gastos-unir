// __tests__/api/users/balance.test.ts
import { GET, POST } from '../../../app/api/users/[id]/balance/route';
import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('/api/users/:id/balance', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET retorna el saldo del usuario si existe', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ balance: 100 });

    const req = new Request(`http://localhost/api/users/${userId}/balance`);
    const res = await GET(req, { params: { id: userId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ saldo: 100 });
  });

  it('POST incrementa el saldo del usuario correctamente', async () => {
    // Mock del Request con método .json() incluido
    const mockReq = {
      json: async () => ({ amount: 50 }),
    } as unknown as Request;

    (prisma.user.update as jest.Mock).mockResolvedValue({ balance: 150 });

    const res = await POST(mockReq, { params: { id: userId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: 'Saldo actualizado correctamente',
      balance: 150,
    });
  });
});
