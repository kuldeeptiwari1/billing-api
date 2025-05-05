const { PrismaClient: INVOICEPrisma } = require('../../../prisma/invoices/generated');
const prisma = new INVOICEPrisma();

const { PrismaClient: COURSEPrisma } = require('../../../prisma/courses/generated');
const courseprisma = new COURSEPrisma();

const { PrismaClient: STUDENTPrisma } = require('../../../prisma/students/generated');
const studentprisma = new STUDENTPrisma();

const { getMessage } = require('../../utils/constant');

const InvoiceService = {
  add: async (data) => {
    //find existing invoice no
    const latestInvoice = await prisma.invoice.findFirst({
      orderBy: { invoiceNo: 'desc' },
      select: { invoiceNo: true },
      where: { isDeleted: false }
    });

    //generate random invoice no
    let newNumber = 1;
    if (latestInvoice?.invoiceNo) {
      const parts = latestInvoice.invoiceNo.split('-');
      if (parts.length === 2 && !isNaN(parts[1])) {
        newNumber = parseInt(parts[1]) + 1;
      }
    }

    const invoiceNo = `INV-${newNumber.toString().padStart(5, '0')}`;

    try {
      const record = await prisma.invoice.create({
        data: {
          ...data,
          invoiceNo
        }
      });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'invoices'),
        errorStack: null
      };
    } catch (error) {
      console.error('Invoice creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'invoices'),
        errorStack: error
      };
    }
  },

  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params || Object.keys(params).length === 0) {
        const allRecords = await prisma.invoice.findMany({
          orderBy: { createdAt: 'desc' } // Sort by newest first
        });

        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'invoices'),
          errorStack: null
        };
      }

      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;

      // Pagination logic
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const skip = (parsedPage - 1) * parsedLimit;

      // Default filter conditions (only fetch non-deleted invoices by default)
      let whereCondition = {
        isDeleted: isDeleted === 'true' || isDeleted === true // Ensure boolean conversion
      };

      // Handle search filter
      if (search && searchField) {
        whereCondition[searchField] = {
          contains: search,
          mode: 'insensitive' // Case-insensitive search
        };
      }

      // Fetch filtered & paginated records
      const [records, totalCount] = await Promise.all([
        prisma.invoice.findMany({
          where: whereCondition,
          skip,
          take: parsedLimit,
          orderBy: { createdAt: sort }
        }),
        prisma.invoice.count({ where: whereCondition })
      ]);


      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'invoices'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(totalCount / parsedLimit)
        }
      };
    } catch (error) {
      console.error('Fetching invoice failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'invoices'),
        errorStack: error
      };
    }
  },

  view: async (id) => {
    try {
      const invoice = await prisma.invoice.findUnique({ where: { id } });

      if (!invoice) {
        console.warn('Invoice not found for id:', id);
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'recordNotFound', 'invoices'),
          errorStack: null
        };
      }

      const courseIds = invoice.course ? invoice.course.split(',').map((tag) => tag.trim()) : [];
      const studentIds = invoice.studentName ? invoice.studentName.split(',').map((tag) => tag.trim()) : [];

      const [invoiceCourses, invoiceStudents] = await Promise.all([
        courseIds.length ? courseprisma.course.findMany({ where: { id: { in: courseIds } } }) : [],
        studentIds.length ? studentprisma.student.findMany({ where: { id: { in: studentIds } } }) : []
      ]);

      return {
        data: {
          ...invoice,
          course:invoiceCourses,
          studentName: invoiceStudents
        },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'viewSuccess', 'invoices'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching invoice failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'invoices'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {

      if (data.invoiceNo) {
        const existingInvoice = await prisma.invoice.findUnique({
          where: { invoiceNo:data.invoiceNo}
        });

        if (existingInvoice && String(existingInvoice.id) !== String(id)) {
          return {
            data: null,
            statusCode: 400,
            isError: true,
            message: getMessage('en', 'error', 'DUPLICATE_RECORD'),
            errorStack: null
          };
        }
      }

      const record = await prisma.invoice.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'invoices'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating invoice failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'invoices'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.invoice.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'invoices'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting invoice failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'invoices'),
        errorStack: error
      };
    }
  }
};

module.exports = InvoiceService;
