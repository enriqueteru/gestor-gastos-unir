// app/api/users/[id]/balance/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

type Params = {
  params: { id: string };
};

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { balance: true },
  });
  if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  return NextResponse.json({ saldo: user.balance });
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { amount } = await req.json();

    if (!userId || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    return NextResponse.json({
      message: 'Saldo actualizado correctamente',
      balance: updatedUser.balance,
    });
  } catch (error) {
    console.error('Error al añadir saldo:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
