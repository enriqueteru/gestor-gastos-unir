
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.division.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.user.deleteMany();

  const users = await prisma.user.createMany({
    data: [
      { id: 'u1', name: 'Ana', email: 'ana@example.com', passwordHash: 'hashed123' },
      { id: 'u2', name: 'Luis', email: 'luis@example.com', passwordHash: 'hashed123' },
      { id: 'u3', name: 'Sofía', email: 'sofia@example.com', passwordHash: 'hashed123' },
      { id: 'u4', name: 'Carlos', email: 'carlos@example.com', passwordHash: 'hashed123' },
      { id: 'u5', name: 'Marina', email: 'marina@example.com', passwordHash: 'hashed123' },
      { id: 'u6', name: 'Javi', email: 'javi@example.com', passwordHash: 'hashed123' },
      { id: 'u7', name: 'Elena', email: 'elena@example.com', passwordHash: 'hashed123' },
      { id: 'u8', name: 'Tomás', email: 'tomas@example.com', passwordHash: 'hashed123' }
    ]
  });

  await prisma.expense.create({
    data: {
      description: 'Cena del grupo completo',
      amount: 160,
      date: new Date('2025-05-10T21:00:00.000Z'),
      paidById: 'u1',
      divisions: {
        create: [
          { userId: 'u1', amountOwed: 20, paid: true },
          { userId: 'u2', amountOwed: 20 },
          { userId: 'u3', amountOwed: 20 },
          { userId: 'u4', amountOwed: 20 },
          { userId: 'u5', amountOwed: 20 },
          { userId: 'u6', amountOwed: 20 },
          { userId: 'u7', amountOwed: 20 },
          { userId: 'u8', amountOwed: 20 }
        ]
      }
    }
  });

  await prisma.expense.create({
    data: {
      description: 'Compra en supermercado',
      amount: 90,
      date: new Date('2025-05-11T10:30:00.000Z'),
      paidById: 'u4',
      divisions: {
        create: [
          { userId: 'u1', amountOwed: 15 },
          { userId: 'u4', amountOwed: 15, paid: true },
          { userId: 'u6', amountOwed: 30 },
          { userId: 'u8', amountOwed: 30 }
        ]
      }
    }
  });
}

main()
  .then(() => {
    console.log('Seed completed.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Error during seed:', e);
    return prisma.$disconnect();
  });
