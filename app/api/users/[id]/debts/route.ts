/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const debts = await prisma.division.findMany({
      where: {
        userId: params.id,
        paid: false,
      },
      include: {
        expense: {
          select: {
            description: true,
            date: true,
            paidBy: {
              select: { name: true }
            }
          }
        }
      }
    });

    return NextResponse.json(
      debts.map((d) => ({
        id: d.id,
        amount: d.amountOwed,
      }))
    );
  } catch (err) {
    return NextResponse.json({ error: 'Error al obtener deudas' }, { status: 500 });
  }
}
