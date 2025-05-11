import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const summaries = await Promise.all(
      users.map(async (user) => {
        const [paidAgg, consumedAgg, history] = await Promise.all([
          prisma.expense.aggregate({
            where: { paidById: user.id },
            _sum: { amount: true },
          }),
          prisma.division.aggregate({
            where: { userId: user.id },
            _sum: { amountOwed: true },
          }),
          prisma.expense.findMany({
            where: {
              divisions: {
                some: { userId: user.id },
              },
            },
            include: {
              paidBy: {
                select: { id: true, name: true, email: true },
              },
              divisions: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true },
                  },
                },
              },
            },
            orderBy: { date: 'desc' },
          }),
        ]);

        const totalPagado = paidAgg._sum.amount ?? 0;
        const totalConsumido = consumedAgg._sum.amountOwed ?? 0;
        const saldo = totalPagado - totalConsumido;

        return {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          totalPagado,
          totalConsumido,
          saldo,
          history,
        };
      })
    );

    return NextResponse.json(summaries);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR EN GET /api/users/summary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
