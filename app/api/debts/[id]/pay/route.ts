import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const divisionId = params.id;

    // Obtener la división y su usuario y cantidad
    const division = await prisma.division.findUnique({
      where: { id: divisionId },
      include: { user: true },
    });

    if (!division) {
      return NextResponse.json({ error: 'División no encontrada' }, { status: 404 });
    }

    // Marcar como pagada
    const updated = await prisma.division.update({
      where: { id: divisionId },
      data: { paid: true },
    });

    // Restar el saldo al usuario que paga su parte
    await prisma.user.update({
      where: { id: division.userId },
      data: {
        balance: {
          decrement: division.amountOwed,
        },
      },
    });

    return NextResponse.json({ message: 'Deuda saldada', division: updated });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo actualizar la deuda' }, { status: 500 });
  }
}