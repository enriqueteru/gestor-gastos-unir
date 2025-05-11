import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import {
  calculateDivisions,
  DivisionParticipant,
  DivisionMode,
} from '../../utils/division';

type Body = {
  description: string;
  amount: number;
  date: string;
  paidById: string;
  mode?: DivisionMode;
  participants?: DivisionParticipant[];
  participantIds?: string[];
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const {
      description,
      amount,
      date,
      paidById,
      mode = 'equal',
      participants,
      participantIds,
    } = body;

    const divisions = calculateDivisions(mode, amount, participants, participantIds);

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        date: new Date(date),
        paidById,
        divisions: {
          create: divisions,
        },
      },
    });

    return NextResponse.json(expense);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR EN POST /api/expenses:', error);
    return NextResponse.json({ error: error.message ?? 'Error interno' }, { status: 500 });
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


