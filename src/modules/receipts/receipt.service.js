const { PrismaClient: RECEIPTPrisma } = require('../../../prisma/receipts/generated');
const prisma = new RECEIPTPrisma();
const { getMessage } = require('../../utils/constant');

const ReceiptService = {
  add: async (data) => {
    try {
      const record = await prisma.receipt.create({ data });
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
      const {
        page = 1,
        limit = 10,
        search = '',
        searchField = 'receiptNo',
        isDeleted = false,
        sort = 'desc'
      } = params || {};
      const skip = (page - 1) * limit;
      const take = parseInt(limit);

      let whereCondition = {
        isDeleted: isDeleted === 'true' || isDeleted === true
      };

      if (search && searchField) {
        whereCondition[searchField] = {
          contains: search,
          mode: 'insensitive'
        };
      }

      const records = await prisma.receipt.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }
      });

      const enrichedRecords = await Promise.all(
        records.map(async (receipt) => {
          // Fetch student object
          const student = await prisma.student.findUnique({ where: { id: receipt.studentId } });

          // Fetch contact persons
          const contactIds = receipt.contactPersonIds.split(',').map((id) => id.trim());
          const contactPersons = await prisma.contactperson.findMany({
            where: { id: { in: contactIds } }
          });

          return {
            ...receipt,
            student,
            contactPersonIds: contactPersons
          };
        })
      );

      const totalCount = await prisma.receipt.count({ where: whereCondition });

      return {
        data: enrichedRecords,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'receipts'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take)
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
          message: getMessage('en', 'error', 'recordNotFound', 'receipts'),
          errorStack: null
        };
      }

      const student = await prisma.student.findUnique({ where: { id: receipt.studentId } });

      const contactIds = receipt.contactPersonIds.split(',').map((id) => id.trim());

      const contactPersons = await prisma.contactperson.findMany({
        where: { id: { in: contactIds } }
      });

      const enrichedReceipt = {
        ...receipt,
        student,
        contactPersonIds: contactPersons
      };

      return {
        data: enrichedReceipt,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'viewSuccess', 'receipts'),
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
