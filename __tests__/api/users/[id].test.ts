// __tests__/api/users/[id].test.ts
import { GET } from '../../../app/api/users/[id]/route';
import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar 200 y el usuario si existe', async () => {
    const mockUser = { id: 'user-id', name: 'John Doe', email: 'john@example.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const req = new Request('http://localhost/api/users/user-id');
    const res = await GET(req, { params: { id: 'user-id' } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockUser);
  });

  it('debe retornar 404 si el usuario no existe', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/users/unknown');
    const res = await GET(req, { params: { id: 'unknown' } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: 'Usuario no encontrado' });
  });

  it('debe retornar 500 si ocurre un error en la base de datos', async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB fail'));

    const req = new Request('http://localhost/api/users/user-id');
    const res = await GET(req, { params: { id: 'user-id' } });
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Error interno' });
  });
});
