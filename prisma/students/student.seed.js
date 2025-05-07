const { PrismaClient : STUDENTPrisma } = require('../prisma/students/generated');
const prisma = new STUDENTPrisma();

async function main() {
  await prisma.student.createMany({
    data: [
      {
      name: "name_value",
      email: "test@example.com",
      phone: "phone_value",
      gender: "gender_value",
      dateOfBirth: "2025-05-07T18:44:22.525Z",
      state: "state_value",
      city: "city_value",
      degreee: "degreee_value",
      courseName: "courseName_value",
      cllegeName: "cllegeName_value",
      passingYear: "passingYear_value",
      modeOfClass: "modeOfClass_value",
      department: "department_value",
      totalFees: "totalFees_value",
      paidAmount: "paidAmount_value",
      remainingFees: "remainingFees_value",
      feesDueDate: "2025-05-07T18:44:22.525Z",
      preferredBranch: "preferredBranch_value",
      paymentMode: "paymentMode_value",
      documentType: "documentType_value",
      documentNo: "documentNo_value",
      profession: "profession_value",
      preferredBatch: "preferredBatch_value",
      counsellorName: "counsellorName_value",
      isDeleted: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded student");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
