const { PrismaClient : BANKPrisma } = require('../prisma/banks/generated');
const prisma = new BANKPrisma();

async function main() {
  await prisma.bank.createMany({
    data: [
      {
      name: "name_value",
      slug: "slug_value",
      branch: "branch_value",
      isDeleted: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded bank");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
