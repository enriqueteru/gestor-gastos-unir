import { POST } from '../../../app/api/auth/login/route';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '../../../app/utils/auth';


jest.mock('../../../lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));
jest.mock('bcrypt');
jest.mock('../../../app/utils/auth', () => ({
    signToken: jest.fn(() => 'mocked-jwt-token'),
}))


describe('POST /api/login', () => {
    const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('debe retornar 404 si el usuario no existe', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const req = new Request('http://localhost/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: '1234' }),
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json).toEqual({ error: 'Usuario no encontrado' });
    });

    it('debe retornar 401 si la contraseña es incorrecta', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const req = new Request('http://localhost/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: mockUser.email, password: 'wrong' }),
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json).toEqual({ error: 'Contraseña incorrecta' });
    });

    it('debe retornar 200 y el token si las credenciales son correctas', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (signToken as jest.Mock).mockReturnValue('mocked-jwt-token')

        const req = new Request('http://localhost/api/login', {
            method: 'POST',
            body: JSON.stringify({ email: mockUser.email, password: 'correct' }),
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await POST(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json).toEqual({ token: 'mocked-jwt-token' });
    });

});
