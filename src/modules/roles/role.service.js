const { PrismaClient : ROLEPrisma } = require('../../../prisma/roles/generated');
const prisma = new ROLEPrisma();
const { getMessage } = require('../../utils/constant');

const RoleService = {
  
  add: async (data) => {
    try {
      // Check if the slug already exists
      const existingRole = await prisma.role.findUnique({
        where: { slug: data.slug },
      });

      if (existingRole) {
        return {
          data: null,
          statusCode: 400,
          isError: true,
          message: getMessage('en', 'error', 'DUPLICATE_RECORD'),
          errorStack: null
        };
      }

      // Create new role if slug is unique
      const record = await prisma.role.create({ data });

      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'roles'),
        errorStack: null
      };

    } catch (error) {
      console.error('Role creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'roles'),
        errorStack: error
      };
    }
  },

  
  
  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params) {
        const allRecords = await prisma.role.findMany({
          orderBy: { createdAt: 'desc' }, // Sort by newest first
        });
  
        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'roles'),
          errorStack: null,
        };
      }
  
      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;
  
      // Pagination logic
      const skip = (page - 1) * limit;
      const take = parseInt(limit);
  
      // Default filter conditions (only fetch non-deleted roles by default)
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
      const records = await prisma.role.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }, // Newest first
      });
  
      // Get total count for pagination
      const totalCount = await prisma.role.count({ where: whereCondition });
  
      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'roles'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Fetching role failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'roles'),
        errorStack: error,
      };
    }
  },


  view: async (id) => {
    try {
      const record = await prisma.role.findUnique({ where: { id } });
      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'roles'),
          errorStack: null
        };
      }
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'roles'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching role failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'roles'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      // Check if the slug is being updated
      if (data.slug) {
        const existingRole = await prisma.role.findUnique({
          where: { slug: data.slug },
        });

        // If the slug exists and belongs to a different role, return an error
        if (existingRole && existingRole.id !== id) {
          return {
            data: null,
            statusCode: 400,
            isError: true,
            message: getMessage('en', 'error', 'DUPLICATE_RECORD'),
            errorStack: null
          };
        }
      }

      // Update the role if the slug is unique or unchanged
      const record = await prisma.role.update({ where: { id }, data });

      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'roles'),
        errorStack: null
      };

    } catch (error) {
      console.error('Updating role failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'roles'),
        errorStack: error
      };
    }
  },


  delete: async (id) => {
    try {
      await prisma.role.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'roles'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting role failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'roles'),
        errorStack: error
      };
    }
  }
};

module.exports = RoleService;
