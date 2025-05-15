const { PrismaClient: BRANCHPrisma } = require('../prisma/branches/generated');
const prisma = new BRANCHPrisma();

async function main() {
  await prisma.branch.createMany({
    data: [
      {
        name: 'name_value',
        slug: 'slug_value',
        code: 'code_value',
        address: 'address_value',
        email: 'test@example.com',
        contact: 'contact_value',
        closingDate: 5,
        isDeleted: false
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seeded branch');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
