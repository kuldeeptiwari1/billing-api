const { PrismaClient : MTRPrisma } = require('../../../prisma/modulestorole/generated');
const prisma = new MTRPrisma();
const { getMessage } = require('../../utils/constant');

const MtrService = {
  
  add: async (data) => {
    try {
      // Check if the role already exists in mtr
      const existingMtr = await prisma.mtr.findUnique({
        where: { role: data.role },
      });

      if (existingMtr) {
        return {
          data: null,
          statusCode: 400,
          isError: true,
          message: getMessage('en', 'error', 'DUPLICATE_RECORD'),
          errorStack: null
        };
      }

      // Create new mtr entry if role is unique
      const record = await prisma.mtr.create({ data });

      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'modulestorole'),
        errorStack: null
      };

    } catch (error) {
      console.error('Mtr creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'modulestorole'),
        errorStack: error
      };
    }
  },

  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params) {
        const allRecords = await prisma.mtr.findMany({
          orderBy: { createdAt: 'desc' }, // Sort by newest first
        });
  
        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'modulestorole'),
          errorStack: null,
        };
      }
  
      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;
  
      // Pagination logic
      const skip = (page - 1) * limit;
      const take = parseInt(limit);
  
      // Default filter conditions (only fetch non-deleted mtrs by default)
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
      const records = await prisma.mtr.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }, // Newest first
      });
  
      // Get total count for pagination
      const totalCount = await prisma.mtr.count({ where: whereCondition });
  
      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'modulestorole'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Fetching mtr failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'modulestorole'),
        errorStack: error,
      };
    }
  },

  view: async (id) => {
    try {
      const record = await prisma.mtr.findUnique({ where: { id } });
      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'modulestorole'),
          errorStack: null
        };
      }
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'modulestorole'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching mtr failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'modulestorole'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      // Check if the role is being updated
      if (data.role) {
        const existingMtr = await prisma.mtr.findUnique({
          where: { role: data.role },
        });

        // If the role exists and belongs to a different mtr, return an error
        if (existingMtr && existingMtr.id !== id) {
          return {
            data: null,
            statusCode: 400,
            isError: true,
            message: getMessage('en', 'error', 'DUPLICATE_RECORD'),
            errorStack: null
          };
        }
      }

      // Update the mtr entry if the role is unique or unchanged
      const record = await prisma.mtr.update({ where: { id }, data });

      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'modulestorole'),
        errorStack: null
      };

    } catch (error) {
      console.error('Updating mtr failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'modulestorole'),
        errorStack: error
      };
    }
  },


  delete: async (id) => {
    try {
      await prisma.mtr.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'modulestorole'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting mtr failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'modulestorole'),
        errorStack: error
      };
    }
  }
};

module.exports = MtrService;
