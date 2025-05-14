const { PrismaClient : USERPrisma } = require('../prisma/users/generated');
const prisma = new USERPrisma();

async function main() {
  await prisma.User.createMany({
    data: [
      {
      email: "test@example.com",
      roles: "roles_value",
      password: "password_value",
      firstName: null,
      lastName: null,
      isDeleted: false,
      contact: null,
      employeeId: "employeeId_value",
      managerEmail: "test@example.com",
      manager: "manager_value",
      displayName: "displayName_value",
      isSuperAdmin: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded User");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
