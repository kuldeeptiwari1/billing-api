const { PrismaClient : INVOICEPrisma } = require('../prisma/invoices/generated');
const prisma = new INVOICEPrisma();

async function main() {
  await prisma.invoice.createMany({
    data: [
      {
      invoiceNo: "invoiceNo_value",
      studentName: "studentName_value",
      studentId: "studentId_value",
      issueDate: "2025-05-08T11:49:40.303Z",
      taxPercentage: "taxPercentage_value",
      discount: "discount_value",
      totalPrice: "totalPrice_value",
      couresAmount: "couresAmount_value",
      totalDiscount: "totalDiscount_value",
      subTotal: "subTotal_value",
      totalTaxes: "totalTaxes_value",
      finalAmount: "finalAmount_value",
      isDeleted: false
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded invoice");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
