import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, amount, date, paidById, participantIds } = body;

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        date: new Date(date),
        paidById,
        divisions: {
          create: participantIds.map((userId: string) => ({
            userId,
            amountOwed: amount / participantIds.length,
          })),
        },
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('ERROR EN POST /api/expenses:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        paidBy: true,
        divisions: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('ERROR EN GET /api/expenses:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
