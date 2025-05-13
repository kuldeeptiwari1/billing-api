const { PrismaClient : COURSEPrisma } = require('../prisma/courses/generated');
const prisma = new COURSEPrisma();

async function main() {
  await prisma.Course.createMany({
    data: [
      {
      code: "code_value",
      name: "name_value",
      departmentIds: null,
      branchIds: null,
      durationInMonths: 1,
      courseFees: null,
      courseDescription: "courseDescription_value",
      isDeleted: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded Course");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
