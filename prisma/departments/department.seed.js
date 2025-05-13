const { PrismaClient : DEPARTMENTPrisma } = require('../prisma/departments/generated');
const prisma = new DEPARTMENTPrisma();

async function main() {
  await prisma.department.createMany({
    data: [
      {
      name: "name_value",
      slug: "slug_value",
      code: "code_value",
      description: null,
      isDeleted: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded department");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
