const { PrismaClient: RECEIPTPrisma } = require('../../../prisma/receipts/generated');
const prisma = new RECEIPTPrisma();

const { PrismaClient: COURSEPrisma } = require('../../../prisma/courses/generated');
const courseprisma = new COURSEPrisma();

const { PrismaClient: MODEOFPAYMENTPrisma } = require('../../../prisma/modeofpayments/generated');
const modeofpaymentprisma = new MODEOFPAYMENTPrisma();

const { PrismaClient: BANKTYPEPrisma } = require('../../../prisma/banktypes/generated');
const banktypeprisma = new BANKTYPEPrisma();

const { PrismaClient: STUDENTPrisma } = require('../../../prisma/students/generated');
const studentprisma = new STUDENTPrisma();

const { getMessage } = require('../../utils/constant');

const ReceiptService = {
  add: async (data) => {
    try {
      //find existing invoice no
      const latestReceipt = await prisma.receipt.findFirst({
        orderBy: { receiptNo: 'desc' },
        select: { receiptNo: true },
        where: { isDeleted: false }
      });

      //generate random invoice no
      let newNumber = 1;
      if (latestReceipt?.receiptNo) {
        const parts = latestReceipt.receiptNo.split('-');
        if (parts.length === 2 && !isNaN(parts[1])) {
          newNumber = parseInt(parts[1]) + 1;
        }
      }

      const receiptNo = `INV-${newNumber.toString().padStart(5, '0')}`;

      const record = await prisma.receipt.create({ data: { ...data, receiptNo } });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'receipts'),
        errorStack: null
      };
    } catch (error) {
      console.error('Receipt creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'receipts'),
        errorStack: error
      };
    }
  },

  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params || Object.keys(params).length === 0) {
        const allRecords = await prisma.receipt.findMany({
          orderBy: { createdAt: 'desc' } // Sort by newest first
        });

        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'receipts'),
          errorStack: null
        };
      }

      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;

      // Pagination logic
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const skip = (parsedPage - 1) * parsedLimit;

      // Default filter conditions (only fetch non-deleted receipts by default)
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
        prisma.receipt.findMany({
          where: whereCondition,
          skip,
          take: parsedLimit,
          orderBy: { createdAt: sort }
        }),
        prisma.receipt.count({ where: whereCondition })
      ]);

      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'receipts'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(totalCount / parsedLimit)
        }
      };
    } catch (error) {
      console.error('Fetching receipt failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'receipts'),
        errorStack: error
      };
    }
  },

  view: async (id) => {
    try {
      const receipt = await prisma.receipt.findUnique({ where: { id } });
      if (!receipt) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'receipts'),
          errorStack: null
        };
      }

      const courseIds = receipt.course ? receipt.course.split(',').map((tag) => tag.trim()) : [];

      const modeofpaymentId = receipt.paymentMode;
      const banktypeId = receipt.bankType;
      const studentId = receipt.studentName;

      const [courses, paymentMode, bankType, student] = await Promise.all([
        courseIds.length ? courseprisma.course.findMany({ where: { id: { in: courseIds } } }) : [],
        modeofpaymentId ? modeofpaymentprisma.modeofpayment.findUnique({ where: { id: modeofpaymentId } }) : null,
        banktypeId ? banktypeprisma.banktype.findUnique({ where: { id: banktypeId } }) : null,
        studentId ? studentprisma.student.findUnique({ where: { id: studentId } }) : null
      ]);

      return {
        data: {
          ...receipt,
          course: courses,
          paymentMode:paymentMode,
          bankType:bankType,
          studentName: student
        },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'receipts'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching receipt failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'receipts'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      if (data.receiptNo) {
        const existingReceipt = await prisma.receipt.findUnique({
          where: { receiptNo: data.receiptNo }
        });

        if (existingReceipt && String(existingReceipt.id) !== String(id)) {
          return {
            data: null,
            statusCode: 400,
            isError: true,
            message: getMessage('en', 'error', 'DUPLICATE_RECORD'),
            errorStack: null
          };
        }
      }

      const record = await prisma.receipt.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'receipts'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating receipt failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'receipts'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.receipt.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'receipts'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting receipt failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'receipts'),
        errorStack: error
      };
    }
  }
};

module.exports = ReceiptService;
