import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'super-secret-key'; // usa .env en producción

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
