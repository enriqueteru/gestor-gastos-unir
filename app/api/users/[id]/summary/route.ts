import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Params) {
  try {
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const paidExpenses = await prisma.expense.aggregate({
      where: { paidById: userId },
      _sum: { amount: true },
    });

    const consumed = await prisma.division.aggregate({
      where: { userId },
      _sum: { amountOwed: true },
    });

    const history = await prisma.expense.findMany({
      where: {
        divisions: {
          some: { userId },
        },
      },
      include: {
        paidBy: true,
        divisions: {
          include: { user: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalPagado = paidExpenses._sum.amount ?? 0;
    const totalConsumido = consumed._sum.amountOwed ?? 0;
    const saldo = totalPagado - totalConsumido;

    return NextResponse.json({
      userId,
      totalPagado,
      totalConsumido,
      saldo,
      history,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR EN GET /api/users/:id/summary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
