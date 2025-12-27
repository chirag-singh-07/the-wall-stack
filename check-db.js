const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.poster.count({
    where: { status: 'active' }
  });
  console.log('Active posters count:', count);
  const posters = await prisma.poster.findMany({
    where: { status: 'active' },
    take: 5
  });
  console.log('Posters sample:', JSON.stringify(posters, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
