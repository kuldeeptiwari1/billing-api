const { PrismaClient: CONTACTPERSONPrisma } = require('../../../prisma/contactpersons/generated');
const prisma = new CONTACTPERSONPrisma();
const { getMessage } = require('../../utils/constant');

const ContactpersonService = {
  add: async (data) => {
    try {
      const record = await prisma.contactperson.create({ data });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', 'contactpersons'),
        errorStack: null
      };
    } catch (error) {
      console.error('Contactperson creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', 'contactpersons'),
        errorStack: error
      };
    }
  },

  list: async (params) => {
    try {
      // If no params, return all records
      if (!params) {
        const allRecords = await prisma.contactperson.findMany({
          orderBy: { createdAt: 'desc' }
        });

        const enrichedRecords = await Promise.all(
          allRecords.map(async (contact) => {
            const branchIdsArray = contact.branchIds.split(',').map((id) => id.trim());

            const branches = await prisma.branch.findMany({
              where: {
                id: { in: branchIdsArray }
              }
            });

            return {
              ...contact,
              branchIds: branches
            };
          })
        );

        return {
          data: enrichedRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', 'contactpersons'),
          errorStack: null
        };
      }

      // Destructure params
      const { page = 1, limit = 10, search = '', searchField = 'name', isDeleted = false, sort = 'desc' } = params;

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

      const records = await prisma.contactperson.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }
      });

      // Enrich with branch details
      const enrichedRecords = await Promise.all(
        records.map(async (contact) => {
          const branchIdsArray = contact.branchIds.split(',').map((id) => id.trim());

          const branches = await prisma.branch.findMany({
            where: {
              id: { in: branchIdsArray }
            }
          });

          return {
            ...contact,
            branchIds: branches
          };
        })
      );

      const totalCount = await prisma.contactperson.count({ where: whereCondition });

      return {
        data: enrichedRecords,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', 'contactpersons'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take)
        }
      };
    } catch (error) {
      console.error('Fetching contactperson failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', 'contactpersons'),
        errorStack: error
      };
    }
  },

  view: async (id) => {
    try {
      const record = await prisma.contactperson.findUnique({ where: { id } });

      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'recordNotFound', 'contactpersons'),
          errorStack: null
        };
      }

      // Enrich with branch data
      const branchIdsArray = record.branchIds.split(',').map((id) => id.trim());

      const branches = await prisma.branch.findMany({
        where: {
          id: { in: branchIdsArray }
        }
      });

      const enrichedRecord = {
        ...record,
        branchIds: branches // Now this is an array of branch objects
      };

      return {
        data: enrichedRecord,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'viewSuccess', 'contactpersons'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching contactperson failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', 'contactpersons'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      const record = await prisma.contactperson.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', 'contactpersons'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating contactperson failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', 'contactpersons'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.contactperson.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', 'contactpersons'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting contactperson failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', 'contactpersons'),
        errorStack: error
      };
    }
  }
};

module.exports = ContactpersonService;
