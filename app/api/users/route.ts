import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/users - lista todos los usuarios
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

// POST /api/users - crea un nuevo usuario
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validación básica
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Campos requeridos faltan' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password, // En producción: hashea esto
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('ERROR EN POST /api/users:', error);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
