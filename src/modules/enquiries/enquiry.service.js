const { PrismaClient : ENQUIRYPrisma } = require('../../../prisma/enquiries/generated');
const prisma = new ENQUIRYPrisma();

const { PrismaClient: STUDENTPrisma } = require('../../../prisma/students/generated');
const studentprisma = new STUDENTPrisma();

const { PrismaClient: COURSEPrisma } = require('../../../prisma/courses/generated');
const courseprisma = new COURSEPrisma();

const { getMessage } = require('../../utils/constant');

const EnquiryService = {
  
  add: async (data) => {
    try {
      const record = await prisma.enquiry.create({ data });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'enquiries'),
        errorStack: null
      };
    } catch (error) {
      console.error('Enquiry creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'enquiries'),
        errorStack: error
      };
    }
  },
  
  
  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params || Object.keys(params).length === 0) {
        const allRecords = await prisma.enquiry.findMany({
          orderBy: { createdAt: 'desc' }, // Sort by newest first
        });
  
        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'enquiries'),
          errorStack: null,
        };
      }
  
      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;
  
      // Pagination logic
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const skip = (parsedPage - 1) * parsedLimit;
  
      // Default filter conditions (only fetch non-deleted enquiries by default)
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
      const [records, totalCount] = await Promise.all([
        prisma.enquiry.findMany({
          where: whereCondition,
          skip,
          take: parsedLimit,
          orderBy: { createdAt: sort }
        }),
        prisma.enquiry.count({ where: whereCondition })
      ]);
  
      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'enquiries'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Fetching enquiry failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'enquiries'),
        errorStack: error,
      };
    }
  },


  view: async (id) => {
    try {
      const enquiry = await prisma.enquiry.findUnique({ where: { id } });
      if (!enquiry) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', 'enquiries'),
          errorStack: null 
        };
      }

      const courseIds = enquiry.course ? enquiry.course.split(',').map((tag) => tag.trim()) : [];
      const studentIds = enquiry.student ? enquiry.student.split(',').map((tag) => tag.trim()) : [];

      const [invoiceCourses, invoiceStudents] = await Promise.all([
        courseIds.length ? courseprisma.course.findMany({ where: { id: { in: courseIds } } }) : [],
        studentIds.length ? studentprisma.student.findMany({ where: { id: { in: studentIds } } }) : []
      ]);


      return {
        data:{
          ...enquiry,
          student: invoiceStudents,
          course: invoiceCourses
        },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', 'enquiries'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching enquiry failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'enquiries'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      const record = await prisma.enquiry.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'enquiries'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating enquiry failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'enquiries'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.enquiry.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'enquiries'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting enquiry failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'enquiries'),
        errorStack: error
      };
    }
  }
};

module.exports = EnquiryService;
