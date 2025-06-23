import { POST } from '../../../app/api/debts/[id]/pay/route';
import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    division: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}));

describe('POST /api/debts/[id]/pay', () => {
  const mockDivision = {
    id: 'div-123',
    userId: 'user-1',
    amountOwed: 50,
    paid: false,
    user: { id: 'user-1', balance: 100 },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar 404 si la división no existe', async () => {
    (prisma.division.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/debts/div-123/pay', {
      method: 'POST',
    });

    const res = await POST(req, { params: { id: 'div-123' } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: 'División no encontrada' });
  });

  it('debe retornar 500 si ocurre un error inesperado', async () => {
    (prisma.division.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost/api/debts/div-123/pay', {
      method: 'POST',
    });

    const res = await POST(req, { params: { id: 'div-123' } });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'No se pudo actualizar la deuda' });
  });

  it('debe actualizar la división y reducir saldo del usuario', async () => {
    (prisma.division.findUnique as jest.Mock).mockResolvedValue(mockDivision);
    (prisma.division.update as jest.Mock).mockResolvedValue({ ...mockDivision, paid: true });
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: 'user-1', balance: 50 });

    const req = new Request('http://localhost/api/debts/div-123/pay', {
      method: 'POST',
    });

    const res = await POST(req, { params: { id: 'div-123' } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      message: 'Deuda saldada',
      division: { ...mockDivision, paid: true },
    });
  });
});
