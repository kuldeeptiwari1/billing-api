const { PrismaClient : CONTACTPERSONPrisma } = require('../prisma/contactpersons/generated');
const prisma = new CONTACTPERSONPrisma();

async function main() {
  await prisma.ContactPerson.createMany({
    data: [
      {
      name: "name_value",
      phone: "phone_value",
      email: "test@example.com",
      isDeleted: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded ContactPerson");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
