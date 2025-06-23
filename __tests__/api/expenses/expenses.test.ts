import { POST, GET } from '../../../app/api/expenses/route';
import { prisma } from '../../../lib/prisma';
import { calculateDivisions } from '../../../app/utils/division';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    expense: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));
jest.mock('../../../app/utils/division');

describe('POST /api/expenses', () => {
  const expenseMock = {
    id: 'exp-1',
    description: 'Cena',
    amount: 100,
    date: new Date(),
    paidById: 'user-1',
    divisions: [],
  };

  const body = {
    description: 'Cena',
    amount: 100,
    date: new Date().toISOString(),
    paidById: 'user-1',
    participantIds: ['user-1', 'user-2'],
    mode: 'equal',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar 500 si ocurre un error interno', async () => {
    (calculateDivisions as jest.Mock).mockImplementation(() => {
      throw new Error('División inválida');
    });

    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'División inválida' });
  });

  it('debe crear un gasto y retornar el objeto', async () => {
    const divisionsMock = [{ userId: 'user-1', amountOwed: 50 }, { userId: 'user-2', amountOwed: 50 }];

    (calculateDivisions as jest.Mock).mockReturnValue(divisionsMock);
    (prisma.expense.create as jest.Mock).mockResolvedValue({ ...expenseMock, divisions: divisionsMock });

    const req = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      description: 'Cena',
      amount: 100,
      paidById: 'user-1',
      divisions: divisionsMock,
    });
  });
});

describe('GET /api/expenses', () => {
  it('debe retornar la lista de gastos con relaciones', async () => {
    const expensesMock = [
      {
        id: 'exp-1',
        description: 'Cena',
        amount: 100,
        paidBy: { id: 'user-1', name: 'Paco' },
        divisions: [],
        date: new Date().toDateString(),
      },
    ];

    (prisma.expense.findMany as jest.Mock).mockResolvedValue(expensesMock);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(expensesMock);
  });

  it('debe retornar 500 si ocurre un error al recuperar gastos', async () => {
    (prisma.expense.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Error interno' });
  });
});
