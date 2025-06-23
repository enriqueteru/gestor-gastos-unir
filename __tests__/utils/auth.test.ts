
import { signToken, verifyToken } from '../../app/utils/auth';
import jwt from 'jsonwebtoken';

describe('auth utils', () => {
    const payload = { id: 'user-123', email: 'test@example.com' };

    it('signToken should return a valid JWT', () => {
        const token = signToken(payload);
        expect(typeof token).toBe('string');

        const decoded = jwt.decode(token) as jwt.JwtPayload;
        expect(decoded).toMatchObject(payload);
    });

    it('verifyToken should return the decoded payload if valid', () => {
        const token = signToken(payload);
        const decoded = verifyToken(token);
        expect(decoded).toMatchObject(payload);
    });

    it('verifyToken should return null for invalid token', () => {
        const invalidToken = 'this.is.an.invalid.token';
        const result = verifyToken(invalidToken);
        expect(result).toBeNull();
    });

    it('verifyToken should return null for expired token', () => {
        const expiredToken = jwt.sign(payload, process.env.JWT_SECRET ?? 'super-secret-key', {
            expiresIn: -10, // expired 10 seconds ago
        });

        const result = verifyToken(expiredToken);
        expect(result).toBeNull();
    });
});
