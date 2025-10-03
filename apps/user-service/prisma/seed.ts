// eslint-disable-next-line @nx/enforce-module-boundaries
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { title: 'admin' },
      { title: 'manager' },
      { title: 'emergency' },
      { title: 'member' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
