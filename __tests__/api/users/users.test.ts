import { GET, POST } from '../../../app/api/users/route';
import { prisma } from '../../../lib/prisma';

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('GET /api/users', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar la lista de usuarios', async () => {
    const mockUsers = [
      { id: 'u1', name: 'Alice', email: 'a@example.com', createdAt: new Date().toISOString() },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockUsers);
  });
});

describe('POST /api/users', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('debe retornar 400 si faltan campos', async () => {
    const req = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }), // falta `name` y `password`
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({ error: 'Campos requeridos faltan' });
  });

  it('debe crear un nuevo usuario y retornarlo', async () => {
    const mockUser = {
      id: 'user-id',
      name: 'Test',
      email: 'test@example.com',
      passwordHash: '123456',
      createdAt: new Date(),
    };

    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const req = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
        password: '123456',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toMatchObject({
      id: 'user-id',
      name: 'Test',
      email: 'test@example.com',
    });
  });

  it('debe retornar 500 si ocurre un error inesperado', async () => {
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error('DB insert error'));

    const req = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
        password: '123456',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Error al crear usuario' });
  });
});
