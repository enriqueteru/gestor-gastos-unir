import { calculateDivisions, DivisionMode, DivisionParticipant } from '@/app/utils/division';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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

export async function DELETE(_: Request, { params }: Params) {
  try {
    const deleted = await prisma.expense.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Gasto eliminado correctamente',
      expenseId: deleted.id,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR EN DELETE /api/expenses/[id]:', error);

    // Manejar error de no encontrado (P2025)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}


export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const {
      description,
      amount,
      date,
      paidById,
      mode = 'equal',
      participants,
      participantIds,
    }: {
      description: string;
      amount: number;
      date: string;
      paidById: string;
      mode?: DivisionMode;
      participants?: DivisionParticipant[];
      participantIds?: string[];
    } = body;

    const expenseId = params.id;

    // Verificar que existe el gasto
    const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!existing) {
      return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 });
    }

    // Calcular divisiones actualizadas
    const divisions = calculateDivisions(mode, amount, participants, participantIds);

    // Actualizar gasto y reemplazar divisiones
    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        description,
        amount,
        date: new Date(date),
        paidById,
        divisions: {
          deleteMany: {},
          create: divisions,
        },
      },
    });

    return NextResponse.json(updated);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR EN PUT /api/expenses/[id]:', error);
    return NextResponse.json({ error: error.message ?? 'Error interno' }, { status: 500 });
  }
}
