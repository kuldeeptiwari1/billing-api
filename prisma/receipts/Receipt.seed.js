const { PrismaClient : RECEIPTPrisma } = require('../prisma/receipts/generated');
const prisma = new RECEIPTPrisma();

async function main() {
  await prisma.Receipt.createMany({
    data: [
      {
      receiptNo: "receiptNo_value",
      receiptDate: "2025-05-08T12:21:19.857Z",
      studentId: "studentId_value",
      contactPersonIds: "contactPersonIds_value",
      totalAmount: "totalAmount_value",
      paidReceiptAmount: "paidReceiptAmount_value",
      paidAmount: "paidAmount_value",
      remainingAmount: "remainingAmount_value",
      fineAmount: "fineAmount_value",
      paymentMode: "paymentMode_value",
      paymentModeType: "paymentModeType_value",
      paymentModeName: "paymentModeName_value",
      bookIssue: "bookIssue_value",
      bookCode: "bookCode_value",
      ReceiptType: "ReceiptType_value",
      paymentDetails: "paymentDetails_value",
      notes: "notes_value",
      isDeleted: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded Receipt");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
