import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Params) {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: {
        paidBy: true,
        divisions: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error('ERROR EN GET /api/expenses/[id]:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
