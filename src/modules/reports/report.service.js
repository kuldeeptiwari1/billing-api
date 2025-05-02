const { PrismaClient : REPORTPrisma } = require('../../../prisma/reports/generated');
const prisma = new REPORTPrisma();
const { getMessage } = require('../../utils/constant');

const ReportService = {
  
  add: async (data) => {
    try {
      const record = await prisma.report.create({ data });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'reports'),
        errorStack: null
      };
    } catch (error) {
      console.error('Report creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'reports'),
        errorStack: error
      };
    }
  },
  
  
  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params) {
        const allRecords = await prisma.report.findMany({
          orderBy: { createdAt: 'desc' }, // Sort by newest first
        });
  
        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'reports'),
          errorStack: null,
        };
      }
  
      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;
  
      // Pagination logic
      const skip = (page - 1) * limit;
      const take = parseInt(limit);
  
      // Default filter conditions (only fetch non-deleted reports by default)
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
      const records = await prisma.report.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }, // Newest first
      });
  
      // Get total count for pagination
      const totalCount = await prisma.report.count({ where: whereCondition });
  
      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'reports'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Fetching report failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'reports'),
        errorStack: error,
      };
    }
  },


  view: async (id) => {
    try {
      const record = await prisma.report.findUnique({ where: { id } });
      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'reports'),
          errorStack: null
        };
      }
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'reports'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching report failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'reports'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      const record = await prisma.report.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'reports'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating report failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'reports'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.report.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'reports'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting report failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'reports'),
        errorStack: error
      };
    }
  }
};

module.exports = ReportService;
