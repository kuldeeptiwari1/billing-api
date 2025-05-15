const { PrismaClient: COURSEPrisma } = require('../../../prisma/courses/generated');
const prisma = new COURSEPrisma();
const { PrismaClient: BRANCHPrisma } = require('../../../prisma/branches/generated');
const branchprisma = new BRANCHPrisma();
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
      const {
        page = 1,
        limit = 10,
        search = '',
        searchField = 'title',
        isDeleted = false,
        sort = 'desc'
      } = params || {};
      const skip = (page - 1) * limit;
      const take = parseInt(limit);

      const whereCondition = {
        isDeleted: isDeleted === 'true' || isDeleted === true
      };

      if (search && searchField) {
        whereCondition[searchField] = {
          contains: search,
          mode: 'insensitive'
        };
      }

      const records = await prisma.course.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }
      });

      const enrichedRecords = await Promise.all(
        records.map(async (course) => {
          const branchIdsArray = course.branchIds.split(',').map((id) => id.trim());

          const branches = await branchprisma.branch.findMany({
            where: {
              id: { in: branchIdsArray }
            }
          });

          return {
            ...course,
            branchIds: branches
          };
        })
      );

      const totalCount = await prisma.course.count({ where: whereCondition });

      return {
        data: enrichedRecords,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'courses'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take)
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
      const record = await prisma.course.findUnique({ where: { id } });

      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'recordNotFound', 'courses'),
          errorStack: null
        };
      }

      const branchIdsArray = record.branchIds.split(',').map((id) => id.trim());

      const branches = await branchprisma.branch.findMany({
        where: {
          id: { in: branchIdsArray }
        }
      });

      const enrichedRecord = {
        ...record,
        branchIds: branches
      };

      return {
        data: enrichedRecord,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'viewSuccess', 'courses'),
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
