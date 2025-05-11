// app/api/users/balances/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        expensesPaid: {
          select: { amount: true },
        },
        divisions: {
          select: { amountOwed: true },
        },
      },
    });

    const balances = users.map((user) => {
      const totalPagado = user.expensesPaid.reduce((sum, e) => sum + e.amount, 0);
      const totalConsumido = user.divisions.reduce((sum, d) => sum + d.amountOwed, 0);
      const saldo = totalPagado - totalConsumido;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalPagado,
        totalConsumido,
        saldo,
      };
    });

    return NextResponse.json(balances);
  } catch (error) {
    console.error('ERROR EN GET /api/users/balances:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
