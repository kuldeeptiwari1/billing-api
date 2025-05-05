const { PrismaClient: COURSEPrisma } = require('../../../prisma/courses/generated');
const prisma = new COURSEPrisma();

const { PrismaClient: DEPARTMENTPrisma } = require('../../../prisma/departments/generated');
const departmentprisma = new DEPARTMENTPrisma();

const { getMessage } = require('../../utils/constant');

const CourseService = {
  add: async (data) => {
    try {
      const record = await prisma.course.create({ data });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'courses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Course creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'courses'),
        errorStack: error
      };
    }
  },

  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params || Object.keys(params).length === 0) {
        const allRecords = await prisma.course.findMany({
          orderBy: { createdAt: 'desc' } // Sort by newest first
        });

        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'courses'),
          errorStack: null
        };
      }

      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;

      // Pagination logic
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const skip = (parsedPage - 1) * parsedLimit;

      // Default filter conditions (only fetch non-deleted courses by default)
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
        prisma.course.findMany({
          where: whereCondition,
          skip,
          take: parsedLimit,
          orderBy: { createdAt: sort }
        }),
        prisma.course.count({ where: whereCondition })
      ]);

      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'courses'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(totalCount / parsedLimit)
        }
      };
    } catch (error) {
      console.error('Fetching course failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'courses'),
        errorStack: error
      };
    }
  },

  view: async (id) => {
    try {
      const course = await prisma.course.findUnique({ where: { id } });
      if (!course) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'courses'),
          errorStack: null
        };
      }

      const departmentIds = course.department ? course.department.split(',').map((tag) => tag.trim()) : [];
      const department = departmentIds.length
        ? await departmentprisma.department.findMany({ where: { id: { in: departmentIds } } })
        : [];

      return {
        data: {
          ...course,
          department: department
        },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'courses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching course failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'courses'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      const record = await prisma.course.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'courses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating course failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'courses'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.course.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'courses'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting course failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'courses'),
        errorStack: error
      };
    }
  }
};

module.exports = CourseService;
