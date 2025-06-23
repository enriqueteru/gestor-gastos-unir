import { POST } from '../../../app/api/auth/logout/route';

describe('POST /api/logout', () => {
  it('debe retornar 200 y mensaje de cierre de sesión', async () => {
    const req = new Request('http://localhost/api/logout', { method: 'POST' });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ message: 'Sesión cerrada (cliente debe borrar el token)' });
  });
});
