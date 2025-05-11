import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('ERROR EN GET /api/users/[id]:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
