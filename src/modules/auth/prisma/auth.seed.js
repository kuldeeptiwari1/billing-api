const { PrismaClient : AUTHPrisma } =  require('../generated/auth');
const prisma = new AUTHPrisma();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
    },
  });
  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });