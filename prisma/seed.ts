import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'ana@example.com' },
    update: {},
    create: {
      name: 'Ana',
      email: 'ana@example.com',
      passwordHash: 'hashed-password-ana',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'luis@example.com' },
    update: {},
    create: {
      name: 'Luis',
      email: 'luis@example.com',
      passwordHash: 'hashed-password-luis',
    },
  });

  const expense = await prisma.expense.create({
    data: {
      description: 'Pizza y refrescos',
      amount: 40,
      date: new Date(),
      paidById: user1.id,
      participants: {
        create: [
          { userId: user1.id, amountOwed: 20 },
          { userId: user2.id, amountOwed: 20 },
        ],
      },
    },
  });

  console.log('Seed completo con datos de ejemplo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
