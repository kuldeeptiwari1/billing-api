const { PrismaClient : INVOICEPrisma } = require('../../../prisma/invoices/generated');
const prisma = new INVOICEPrisma();
const { getMessage } = require('../../utils/constant');

const InvoiceService = {
  
  add: async (data) => {
    try {
      const record = await prisma.invoice.create({ data });
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
      if (!params) {
        const allRecords = await prisma.invoice.findMany({
          orderBy: { createdAt: 'desc' }, // Sort by newest first
        });
  
        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'invoices'),
          errorStack: null,
        };
      }
  
      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;
  
      // Pagination logic
      const skip = (page - 1) * limit;
      const take = parseInt(limit);
  
      // Default filter conditions (only fetch non-deleted invoices by default)
      let whereCondition = {
        isDeleted: isDeleted === 'true' || isDeleted === true, // Ensure boolean conversion
      };
  
      // Handle search filter
      if (search && searchField) {
        whereCondition[searchField] = {
          contains: search,
          mode: 'insensitive', // Case-insensitive search
        };
      }
  
      // Fetch filtered & paginated records
      const records = await prisma.invoice.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }, // Newest first
      });
  
      // Get total count for pagination
      const totalCount = await prisma.invoice.count({ where: whereCondition });
  
      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'invoices'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Fetching invoice failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'invoices'),
        errorStack: error,
      };
    }
  },


  view: async (id) => {
    try {
      const record = await prisma.invoice.findUnique({ where: { id } });
      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'invoices'),
          errorStack: null
        };
      }
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'invoices'),
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
