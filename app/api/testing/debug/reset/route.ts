import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'No permitido en producción' },
        { status: 403 }
      );
    }

    await prisma.division.deleteMany({});
    await prisma.expense.deleteMany({});
    await prisma.user.deleteMany({});

    return NextResponse.json({
      message: '✅ Base de datos reseteada (testing)',
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR EN /api/debug/reset:', error);
    return NextResponse.json(
      { error: 'Error al resetear la base de datos' },
      { status: 500 }
    );
  }
}
