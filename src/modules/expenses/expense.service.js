const { PrismaClient : EXPENSEPrisma } = require('../../../prisma/expenses/generated');
const prisma = new EXPENSEPrisma();
const { getMessage } = require('../../utils/constant');

const ExpenseService = {
  
  add: async (data) => {
    try {
      const record = await prisma.expense.create({ data });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'expenses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Expense creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'expenses'),
        errorStack: error
      };
    }
  },
  
  
  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params) {
        const allRecords = await prisma.expense.findMany({
          orderBy: { createdAt: 'desc' }, // Sort by newest first
        });
  
        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'expenses'),
          errorStack: null,
        };
      }
  
      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;
  
      // Pagination logic
      const skip = (page - 1) * limit;
      const take = parseInt(limit);
  
      // Default filter conditions (only fetch non-deleted expenses by default)
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
      const records = await prisma.expense.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }, // Newest first
      });
  
      // Get total count for pagination
      const totalCount = await prisma.expense.count({ where: whereCondition });
  
      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'expenses'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Fetching expense failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'expenses'),
        errorStack: error,
      };
    }
  },


  view: async (id) => {
    try {
      const record = await prisma.expense.findUnique({ where: { id } });
      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'expenses'),
          errorStack: null
        };
      }
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'expenses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching expense failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'expenses'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      const record = await prisma.expense.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'expenses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating expense failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'expenses'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.expense.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'expenses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting expense failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'expenses'),
        errorStack: error
      };
    }
  }
};

module.exports = ExpenseService;
