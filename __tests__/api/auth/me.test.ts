import { GET } from '../../../app/api/auth/me/route';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../app/utils/auth';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('../../../app/utils/auth');

describe('GET /api/profile', () => {
  const mockUser = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar 401 si no hay token o es inválido', async () => {
    (verifyToken as jest.Mock).mockReturnValue(null);

    const req = new Request('http://localhost/api/profile', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: 'No autenticado' });
  });

  it('debe retornar 404 si el usuario no existe', async () => {
    (verifyToken as jest.Mock).mockReturnValue({ id: 'user-id' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const req = new Request('http://localhost/api/profile', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer valid-token',
      },
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: 'Usuario no encontrado' });
  });

  it('debe retornar 200 y los datos del usuario si autenticado', async () => {
    (verifyToken as jest.Mock).mockReturnValue({ id: mockUser.id });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const req = new Request('http://localhost/api/profile', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer valid-token',
      },
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockUser);
  });
});
