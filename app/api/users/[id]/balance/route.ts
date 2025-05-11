// app/api/users/[id]/balance/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Params) {
  const userId = params.id;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Total pagado como "paidBy"
    const paidExpenses = await prisma.expense.aggregate({
      where: { paidById: userId },
      _sum: { amount: true },
    });

    // Total consumido en divisiones
    const consumed = await prisma.division.aggregate({
      where: { userId },
      _sum: { amountOwed: true },
    });

    const totalPagado = paidExpenses._sum.amount || 0;
    const totalConsumido = consumed._sum.amountOwed || 0;
    const saldo = totalPagado - totalConsumido;

    return NextResponse.json({
      userId,
      totalPagado,
      totalConsumido,
      saldo,
    });
  } catch (error) {
    console.error('ERROR EN GET /api/users/[id]/balance:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
