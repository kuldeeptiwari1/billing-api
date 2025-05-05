const { PrismaClient: STUDENTPrisma } = require('../../../prisma/students/generated');
const prisma = new STUDENTPrisma();

const { PrismaClient: COURSEPrisma } = require('../../../prisma/courses/generated');
const courseprisma = new COURSEPrisma();

const { PrismaClient: DEPARTMENTPrisma } = require('../../../prisma/departments/generated');
const departmentprisma = new DEPARTMENTPrisma();

const { PrismaClient: BRANCHPrisma } = require('../../../prisma/branches/generated');
const branchprisma = new BRANCHPrisma();

const { PrismaClient: MODEOFPAYMENTPrisma } = require('../../../prisma/modeofpayments/generated');
const modeofpaymentsprisma = new MODEOFPAYMENTPrisma();

const { getMessage } = require('../../utils/constant');

const StudentService = {
  add: async (data) => {
    try {
      const record = await prisma.student.create({ data });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'students'),
        errorStack: null
      };
    } catch (error) {
      console.error('Student creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'students'),
        errorStack: error
      };
    }
  },

  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params || Object.keys(params).length === 0) {
        const allRecords = await prisma.student.findMany({
          orderBy: { createdAt: 'desc' } // Sort by newest first
        });

        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'students'),
          errorStack: null
        };
      }

      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;

      // Pagination logic
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const skip = (parsedPage - 1) * parsedLimit;

      // Default filter conditions (only fetch non-deleted students by default)
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
        prisma.student.findMany({
          where: whereCondition,
          skip,
          take: parsedLimit,
          orderBy: { createdAt: sort }
        }),
        prisma.student.count({ where: whereCondition })
      ]);

      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'students'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(totalCount / parsedLimit)
        }
      };
    } catch (error) {
      console.error('Fetching student failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'students'),
        errorStack: error
      };
    }
  },

  view: async (id) => {
    try {
      const student = await prisma.student.findUnique({ where: { id } });
      if (!student) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'students'),
          errorStack: null
        };
      }

      const courseIds = student.courseName ? student.courseName.split(',').map((tag) => tag.trim()) : [];
      const departmentIds = student.department ? student.department.split(',').map((tag) => tag.trim()) : [];
      const branchIds = student.preferredBranch ? student.preferredBranch.split(',').map((tag) => tag.trim()) : [];
      const paymentModeIds = student.paymentType ? student.paymentType.split(',').map((tag) => tag.trim()) : [];

      const [courses, department, preferredBranch, modeofpayments] = await Promise.all([
        courseIds.length ? courseprisma.course.findMany({ where: { id: { in: courseIds } } }) : [],
        departmentIds.length ? departmentprisma.department.findMany({ where: { id: { in: departmentIds } } }) : [],
        branchIds.length ? branchprisma.branch.findMany({ where: { id: { in: branchIds } } }) : [],
        paymentModeIds.length
          ? modeofpaymentsprisma.modeofpayment.findMany({ where: { id: { in: paymentModeIds } } })
          : []
      ]);

      return {
        data: {
          ...student,
          courseName: courses,
          department: department,
          preferredBranch: preferredBranch,
          paymentType: modeofpayments
        },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'students'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching student failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'students'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      const record = await prisma.student.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'students'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating student failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'students'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.student.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'students'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting student failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'students'),
        errorStack: error
      };
    }
  }
};

module.exports = StudentService;
