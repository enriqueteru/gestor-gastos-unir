import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const divisionId = params.id;

    const updated = await prisma.division.update({
      where: { id: divisionId },
      data: { paid: true },
    });

    return NextResponse.json({ message: 'Deuda saldada', division: updated });
  } catch (error) {
    return NextResponse.json({ error: 'No se pudo actualizar la deuda' }, { status: 500 });
  }
}
