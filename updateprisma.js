require('dotenv').config(); // Load environment variables from .env file
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

// Parse command-line arguments
const args = process.argv.slice(2);
const allModules = args.includes('--all');
const allPrisma = args.includes('--all-prisma');
const specificModule = args.find((arg) => arg.startsWith('--module='));
const db = args.find((arg) => arg.startsWith('--db='));
const moduleName = specificModule ? specificModule.split('=')[1].replace(/[^a-zA-Z0-9]/g, '') : null;
const dbSchemaFile = db ? db.split('=')[1] : null;
const provider = process.env.DATABASE_PROVIDER || 'mongodb';
const mainRouterFilePath = './src/loaders/routes.js';
const modulesPath = path.resolve(__dirname, 'src', 'modules');
const prismaDir = path.resolve(__dirname, 'prisma');
const testRoot = path.join(__dirname, 'tests');
if (args.includes('--help')) {
  console.log(`
Usage:
  --module=<name>        Generate a module for a specific name
  --all                  Generate all modules
  --db=<schema-file>     Provide the .prisma/.json/.sql schema to use
  --all-prisma           Only generate Prisma files for all modules
  --help                 Show this help menu
`);
  process.exit(0);
}
if (!moduleName && !allModules && !allPrisma) {
  console.error('❌ Please provide either --module=<name> or --all');
  process.exit(1);
}

String.prototype.plural = function (revert) {
  // Plural and singular conversion rules
  const plural = {
    '(quiz)$': '$1zes',
    '^(ox)$': '$1en',
    '([m|l])ouse$': '$1ice',
    '(matr|vert|ind)ix|ex$': '$1ices',
    '(x|ch|ss|sh)$': '$1es',
    '([^aeiouy]|qu)y$': '$1ies',
    '(hive)$': '$1s',
    '(?:([^f])fe|([lr])f)$': '$1$2ves',
    '(shea|lea|loa|thie)f$': '$1ves',
    sis$: 'ses',
    '([ti])um$': '$1a',
    '(tomat|potat|ech|her|vet)o$': '$1oes',
    '(bu)s$': '$1ses',
    '(alias)$': '$1es',
    '(octop)us$': '$1i',
    '(ax|test)is$': '$1es',
    '(us)$': '$1es',
    '([^s]+)$': '$1s'
  };

  const singular = {
    '(quiz)zes$': '$1',
    '(matr)ices$': '$1ix',
    '(vert|ind)ices$': '$1ex',
    '^(ox)en$': '$1',
    '(alias)es$': '$1',
    '(octop|vir)i$': '$1us',
    '(cris|ax|test)es$': '$1is',
    '(shoe)s$': '$1',
    '(o)es$': '$1',
    '(bus)es$': '$1',
    '([m|l])ice$': '$1ouse',
    '(x|ch|ss|sh)es$': '$1',
    '(m)ovies$': '$1ovie',
    '(s)eries$': '$1eries',
    '([^aeiouy]|qu)ies$': '$1y',
    '([lr])ves$': '$1f',
    '(tive)s$': '$1',
    '(hive)s$': '$1',
    '(li|wi|kni)ves$': '$1fe',
    '(shea|loa|lea|thie)ves$': '$1f',
    '(^analy)ses$': '$1sis',
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
    '([ti])a$': '$1um',
    '(n)ews$': '$1ews',
    '(h|bl)ouses$': '$1ouse',
    '(corpse)s$': '$1',
    '(us)es$': '$1',
    s$: ''
  };

  const irregular = {
    move: 'moves',
    foot: 'feet',
    goose: 'geese',
    sex: 'sexes',
    child: 'children',
    man: 'men',
    tooth: 'teeth',
    person: 'people'
  };

  const uncountable = ['sheep', 'fish', 'deer', 'series', 'species', 'money', 'rice', 'information', 'equipment'];

  // If the word is uncountable, return it as is
  if (uncountable.includes(this.toLowerCase())) return this;

  // Check for irregular forms
  for (let word of Object.keys(irregular)) {
    let pattern, replace;

    if (revert) {
      pattern = new RegExp(irregular[word] + '$', 'i');
      replace = word;
    } else {
      pattern = new RegExp(word + '$', 'i');
      replace = irregular[word];
    }

    if (pattern.test(this)) return this.replace(pattern, replace);
  }

  // Choose whether to apply singular or plural transformation based on 'revert'
  const transformationRules = revert ? singular : plural;

  // Check for matches using regular expressions
  for (let reg of Object.keys(transformationRules)) {
    let pattern = new RegExp(reg, 'i');

    if (pattern.test(this)) return this.replace(pattern, transformationRules[reg]);
  }

  return this.toString(); // Return the original string if no transformation occurs
};
(async () => {
  // Main control
  if (allPrisma) {
    const findPrismaFiles = (dir) => {
      let results = [];
      const items = fs.readdirSync(dir);
      for (const file of items) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results = results.concat(findPrismaFiles(fullPath));
        } else if (file.endsWith('.prisma')) {
          results.push(fullPath);
        }
      }
      return results;
    };

    const prismaFiles = findPrismaFiles(prismaDir); // ← use the actual directory path

    prismaFiles.forEach((schemaFile) => {
      console.log(`🔧 Running prisma generate for: ${schemaFile}`);
      try {
        execSync(`npx prisma generate --schema="${schemaFile}"`, { stdio: 'inherit' });
      } catch (err) {
        console.error(`❌ Failed for: ${schemaFile}\n${err.message}`);
      }
    });
    console.log('All modules processed.');
    return;
  }


  let pluralModuleName = '';
  let capitalizeModuleName = '';
  let modulePath = '';

  if (moduleName) {
    pluralModuleName = moduleName.plural() // ✅ ensure primitive
    capitalizeModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    modulePath = path.join(modulesPath, pluralModuleName);
  }

  function createDirIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    } else {
      console.log(`Directory already exists: ${dirPath}`);
    }
  }

  function generateModuleCode(moduleName) {
    // Convert camelCase or PascalCase to space-separated words
    const words = moduleName.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_-]+/);

    // Get the first letter of each word & convert to uppercase
    const code = words.map((word) => word[0].toUpperCase()).join('');

    return code.length >= 2 ? code : moduleName.substring(0, 2).toUpperCase();
  }


  function writeFile(filePath, content, successMessage) {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(`Error creating ${filePath}:`, err);
      } else {
        console.log(successMessage);
      }
    });
  }

  async function scaffoldModuleAsync() {
    return new Promise((resolve, reject) => {

      // Ensure dbSchemaFile exists
      fs.access(path.join(dbSchemaFile), fs.constants.F_OK, (err) => {
        if (err) {
          console.error(`File does not exist: ${dbSchemaFile}`);
          return reject(err);
        }

        try {
          fs.accessSync(modulePath);
          console.log('Module already exists');
          return resolve();
        } catch (error) {
          createDirIfNotExists(modulePath);
          createDirIfNotExists(path.join(modulePath, 'locales'));
          createDirIfNotExists(path.join(modulePath, 'prisma'));

          fs.copyFileSync(
            dbSchemaFile,
            path.join(modulePath, 'prisma', `${moduleName.toLowerCase()}.schema.prisma`)
          );

          writeFile(
            path.join(modulePath, 'locales', 'en.json'),
            getLocalesContent(moduleName),
            `Created locales/en.json successfully!`
          );


          const files = [
            { name: `${moduleName}.controller.js`, content: getControllerContent(capitalizeModuleName, moduleName) },
            { name: `${moduleName}.middleware.js`, content: getMiddlewareContent(capitalizeModuleName) },
            { name: `${moduleName}.module.js`, content: getModuleContent(capitalizeModuleName, moduleName) },
            { name: `${moduleName}.routes.js`, content: getRoutesContent(capitalizeModuleName) },
            { name: `${moduleName}.service.js`, content: getServiceContent(capitalizeModuleName, pluralModuleName) },
            { name: `${moduleName}.types.js`, content: getTypesContent(capitalizeModuleName, moduleName) },
            { name: `${moduleName}.validator.js`, content: getValidatorContent(dbSchemaFile) }
          ];

          files.forEach(({ name, content }) => {
            writeFile(path.join(modulePath, name), content, `Created ${name} successfully!`);
          });

          updateMainRouter(mainRouterFilePath, capitalizeModuleName, moduleName, pluralModuleName);
          return resolve();
        }
      });
    });
  }


  function getControllerContent(capitalizeModuleName, moduleName) {
    return `const ${capitalizeModuleName}Service = require('./${moduleName}.service');
const helper = require('../../utils/helper');

const ${capitalizeModuleName}Controller = {

  add: async (httpRequest) => {
    const response = await ${capitalizeModuleName}Service.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await ${capitalizeModuleName}Service.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await ${capitalizeModuleName}Service.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await ${capitalizeModuleName}Service.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await ${capitalizeModuleName}Service.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = ${capitalizeModuleName}Controller;
`;
  }

  function getMiddlewareContent(capitalizeModuleName) {
    return ``;
  }

  function getModuleContent(capitalizeModuleName, moduleName) {
    return `const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const ${capitalizeModuleName}Validator = require('./${moduleName}.validator');

// service
const ${capitalizeModuleName}Service = require('./${moduleName}.service');

// controller
const ${capitalizeModuleName}Controller = require('./${moduleName}.controller');

// routes
const routes = require('./${moduleName}.routes')({
    router,
    ${capitalizeModuleName}Controller,
    ${capitalizeModuleName}Validator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    ${capitalizeModuleName}Controller,
    ${capitalizeModuleName}Service,
    ${capitalizeModuleName}Routes: routes
};`;
  }

  function getRoutesContent(capitalizeModuleName) {
    return `module.exports = ({
router,
${capitalizeModuleName}Controller,
${capitalizeModuleName}Validator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(${capitalizeModuleName}Validator.add),
        makeExpressCallback(${capitalizeModuleName}Controller.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(${capitalizeModuleName}Controller.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(${capitalizeModuleName}Controller.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(${capitalizeModuleName}Validator.update),
        makeExpressCallback(${capitalizeModuleName}Controller.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(${capitalizeModuleName}Controller.delete)
    );

    return router;
};`;
  }

  function getServiceContent(capitalizeModuleName, pluralModuleName) {
    '../../../prisma/tools/generated/tool'
    return `const { PrismaClient : ${capitalizeModuleName.toUpperCase()}Prisma } = require('../../../prisma/${pluralModuleName}/generated');
const prisma = new ${capitalizeModuleName.toUpperCase()}Prisma();
const { getMessage } = require('../../utils/constant');

const ${capitalizeModuleName}Service = {
  
  add: async (data) => {
    try {
      const record = await prisma.${capitalizeModuleName.toLowerCase()}.create({ data });
      return {
        data: record,
        statusCode: 201,
        isError: false,
        message: getMessage('en', 'success', 'createSuccess', '${pluralModuleName.toLowerCase()}'),
        errorStack: null
      };
    } catch (error) {
      console.error('${capitalizeModuleName} creation failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'createFailed', '${pluralModuleName.toLowerCase()}'),
        errorStack: error
      };
    }
  },
  
  
  list: async (params) => {
    try {
      // If no params, return all records without filtering
      if (!params) {
        const allRecords = await prisma.${capitalizeModuleName.toLowerCase()}.findMany({
          orderBy: { createdAt: 'desc' }, // Sort by newest first
        });
  
        return {
          data: allRecords,
          statusCode: 200,
          isError: false,
          message: getMessage('en', 'success', 'listSuccess', '${pluralModuleName.toLowerCase()}'),
          errorStack: null,
        };
      }
  
      // Destructure params with default values
      const { page = 1, limit = 10, search = '', searchField = 'title', isDeleted = false, sort = 'desc' } = params;
  
      // Pagination logic
      const skip = (page - 1) * limit;
      const take = parseInt(limit);
  
      // Default filter conditions (only fetch non-deleted ${pluralModuleName.toLowerCase()} by default)
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
      const records = await prisma.${capitalizeModuleName.toLowerCase()}.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: sort }, // Newest first
      });
  
      // Get total count for pagination
      const totalCount = await prisma.${capitalizeModuleName.toLowerCase()}.count({ where: whereCondition });
  
      return {
        data: records,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'listSuccess', '${pluralModuleName.toLowerCase()}'),
        errorStack: null,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: take,
          totalPages: Math.ceil(totalCount / take),
        },
      };
    } catch (error) {
      console.error('Fetching ${capitalizeModuleName.toLowerCase()} failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'listFailed', '${pluralModuleName.toLowerCase()}'),
        errorStack: error,
      };
    }
  },


  view: async (id) => {
    try {
      const record = await prisma.${capitalizeModuleName.toLowerCase()}.findUnique({ where: { id } });
      if (!record) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'viewSuccess', '${pluralModuleName.toLowerCase()}'),
          errorStack: null
        };
      }
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'recordNotFound', '${pluralModuleName.toLowerCase()}'),
        errorStack: null
      };
    } catch (error) {
      console.error('Fetching ${capitalizeModuleName.toLowerCase()} failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'viewFailed', '${pluralModuleName.toLowerCase()}'),
        errorStack: error
      };
    }
  },

  update: async (id, data) => {
    try {
      const record = await prisma.${capitalizeModuleName.toLowerCase()}.update({ where: { id }, data });
      return {
        data: record,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'updateSuccess', '${pluralModuleName.toLowerCase()}'),
        errorStack: null
      };
    } catch (error) {
      console.error('Updating ${capitalizeModuleName.toLowerCase()} failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'updateFailed', '${pluralModuleName.toLowerCase()}'),
        errorStack: error
      };
    }
  },

  delete: async (id) => {
    try {
      await prisma.${capitalizeModuleName.toLowerCase()}.delete({ where: { id } });
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'deleteSuccess', '${pluralModuleName.toLowerCase()}'),
        errorStack: null
      };
    } catch (error) {
      console.error('Deleting ${capitalizeModuleName.toLowerCase()} failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'deleteFailed', '${pluralModuleName.toLowerCase()}'),
        errorStack: error
      };
    }
  }
};

module.exports = ${capitalizeModuleName}Service;
`;
  }

  function getTypesContent(capitalizeModuleName, moduleName) {
    return `/**
* ${capitalizeModuleName}Controller
* @typedef {import('./${moduleName}.controller')} ${capitalizeModuleName}Controller
*/

/**
* ${capitalizeModuleName}Service
* @typedef {import('./${moduleName}.service')} ${capitalizeModuleName}Service
*/

/**
* ${capitalizeModuleName}Validator
* @typedef {import('./${moduleName}.validator')} ${capitalizeModuleName}Validator
*/`;
  }


  function getValidatorContent(schemaFilePath) {
    let addValidator = {};
    let addParams = [];

    const fileExtension = path.extname(schemaFilePath).toLowerCase();
    const data = fs.readFileSync(schemaFilePath, 'utf8');

    // Type-to-validator map with field-name based error messages
    const fieldTypeMap = {
      String: (name) => `Joi.string().messages({'string.base': '${name} must be a string', 'any.required': '${name} is required'})`,
      Int: (name) => `Joi.number().integer().messages({'number.base': '${name} must be an integer', 'any.required': '${name} is required'})`,
      BigInt: (name) => `Joi.number().integer().messages({'number.base': '${name} must be an integer', 'any.required': '${name} is required'})`,
      Float: (name) => `Joi.number().precision(2).messages({'number.base': '${name} must be a decimal', 'any.required': '${name} is required'})`,
      Decimal: (name) => `Joi.number().precision(2).messages({'number.base': '${name} must be a decimal', 'any.required': '${name} is required'})`,
      Boolean: (name) => `Joi.boolean().messages({'boolean.base': '${name} must be true or false', 'any.required': '${name} is required'})`,
      DateTime: (name) => `Joi.date().messages({'date.base': '${name} must be a valid date', 'any.required': '${name} is required'})`,
      Json: (name) => `Joi.object().messages({'object.base': '${name} must be a valid JSON object', 'any.required': '${name} is required'})`
    };

    const getValidatorWithDefaults = (fieldName, baseValidator, defaultValue) => {
      if (defaultValue === null || defaultValue === '') {
        return baseValidator + `.allow(null, '')`;
      } else if (defaultValue === false || defaultValue === 'false') {
        return fieldName.toLowerCase() === 'isdeleted'
          ? baseValidator + `.default(false)`
          : baseValidator + `.default(false).required()`;
      } else if (defaultValue === true || defaultValue === 'true') {
        return fieldName.toLowerCase() === 'isdeleted'
          ? baseValidator + `.default(true)`
          : baseValidator + `.default(true).required()`;
      } else if (defaultValue === '""') {
        return baseValidator + `.default('').required()`;
      } else if (!isNaN(defaultValue)) {
        return baseValidator + `.default(${defaultValue}).required()`;
      }
      return baseValidator + `.required()`;
    };

    if (fileExtension === '.prisma') {
      const modelRegex = /model\s+(\w+)\s+\{([^}]*)\}/g;
      let match;
      while ((match = modelRegex.exec(data)) !== null) {
        const modelBody = match[2].trim().split('\n');
        modelBody.forEach((line) => {
          line = line.trim();
          if (line === '' || line.startsWith('@@')) return;

          const parts = line.split(/\s+/);
          const fieldName = parts[0];
          let fieldType = parts[1];
          const attributes = parts.slice(2);

          if (['id', 'createdAt', 'updatedAt'].includes(fieldName)) return;
          if (fieldType.includes('?') || attributes.some(attr => attr.includes('@relation'))) return;

          fieldType = fieldType.replace('?', '');
          addParams.push(fieldName);

          const baseValidator = (fieldTypeMap[fieldType] || ((name) =>
            `Joi.any().messages({'any.required': '${name} is required'})`))(fieldName);

          const defaultAttr = attributes.find(attr => attr.startsWith('@default('));
          let defaultValue = null;
          if (defaultAttr) {
            const match = defaultAttr.match(/@default\(([^)]+)\)/);
            if (match) defaultValue = match[1].replace(/"/g, '');
          }

          addValidator[fieldName] = getValidatorWithDefaults(fieldName, baseValidator, defaultValue);
        });
      }
    } else if (fileExtension === '.json') {
      const jsonData = JSON.parse(data);
      jsonData.forEach((field) => {
        if (field.name && field.type) {
          const fieldName = field.name;
          addParams.push(fieldName);

          const baseValidator = (fieldTypeMap[field.type] || ((name) =>
            `Joi.any().messages({'any.required': '${name} is required'})`))(fieldName);

          addValidator[fieldName] = getValidatorWithDefaults(fieldName, baseValidator, field.default ?? undefined);
        }
      });
    } else if (fileExtension === '.sql') {
      const startIndex = data.indexOf('` (') + '` ('.length;
      const endIndex = data.indexOf(') ENGINE=InnoDB');
      const tableData = data.slice(startIndex, endIndex).split('\n').slice(1, -1);

      tableData.forEach((line) => {
        if (!line.trim()) return;

        const sData = line.trim().split(/\s+/);
        let rawFieldName = sData[0].replace(/`/g, '');
        let fieldName = rawFieldName.replace(/[-_](\w)/g, (_, w) => w.toUpperCase());

        if (['id', 'created_at', 'updated_at'].includes(rawFieldName.toLowerCase())) return;
        addParams.push(fieldName);

        let baseValidator = `Joi.any().messages({'any.required': '${fieldName} is required'})`;
        const typeString = sData[1].toLowerCase();

        if (typeString.includes('decimal')) {
          const precisionMatch = typeString.match(/\((\d+),(\d+)\)/);
          const precision = precisionMatch ? precisionMatch[2] : '2';
          baseValidator = `Joi.number().precision(${precision}).messages({'number.base': '${fieldName} must be a decimal', 'any.required': '${fieldName} is required'})`;
        } else if (typeString.includes('int')) {
          baseValidator = `Joi.number().integer().messages({'number.base': '${fieldName} must be an integer', 'any.required': '${fieldName} is required'})`;
        } else if (typeString.includes('varchar') || typeString.includes('text')) {
          baseValidator = `Joi.string().messages({'string.base': '${fieldName} must be a string', 'any.required': '${fieldName} is required'})`;
        } else if (typeString.includes('boolean') || typeString.includes('tinyint(1)')) {
          baseValidator = `Joi.boolean().messages({'boolean.base': '${fieldName} must be true or false', 'any.required': '${fieldName} is required'})`;
        } else if (typeString.includes('datetime') || typeString.includes('timestamp')) {
          baseValidator = `Joi.date().messages({'date.base': '${fieldName} must be a valid date', 'any.required': '${fieldName} is required'})`;
        }

        const isNullable = line.includes('DEFAULT NULL') || line.includes('NULL');
        addValidator[fieldName] = isNullable
          ? baseValidator + `.allow(null, '')`
          : baseValidator + `.required()`;
      });
    }

    const joiSchemaString = Object.entries(addValidator)
      .map(([key, val]) => `    ${key}: ${val}`)
      .join(',\n');

    return `const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const options = {
  errors: { wrap: { label: '' } },
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true
};

module.exports = {
  add: (httpRequest) => {
    const schema = Joi.object({
${joiSchemaString}
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
${joiSchemaString}
    });
    return schema.validate(httpRequest.body, options);
  }
};
`;
  }

  function getLocalesContent(moduleName) {
    const moduleCode = generateModuleCode(moduleName);

    return `{
  "success": {
    "createSuccess": {
      "code": "${moduleCode}S001",
      "message": "${moduleName} created successfully.",
      "ariaLabel": "Notification: ${moduleName} created successfully"
    },
    "updateSuccess": {
      "code": "${moduleCode}S002",
      "message": "${moduleName} updated successfully.",
      "ariaLabel": "Notification: ${moduleName} updated successfully"
    },
    "listSuccess": {
      "code": "${moduleCode}S003",
      "message": "${moduleName} list retrieved successfully.",
      "ariaLabel": "Notification: ${moduleName} list retrieved successfully"
    },
    "viewSuccess": {
      "code": "${moduleCode}S004",
      "message": "${moduleName} details fetched successfully.",
      "ariaLabel": "Notification: ${moduleName} details fetched successfully"
    },
    "deleteSuccess": {
      "code": "${moduleCode}S005",
      "message": "${moduleName} deleted successfully.",
      "ariaLabel": "Notification: ${moduleName} deleted successfully"
    }
  },
  "error": {
    "recordNotFound": {
      "code": "${moduleCode}E404",
      "message": "${moduleName} not found.",
      "ariaLabel": "Error: ${moduleName} not found"
    },
    "createFailed": {
      "code": "${moduleCode}E403",
      "message": "${moduleName} not created.",
      "ariaLabel": "Notification: ${moduleName} not created"
    },
    "updateFailed": {
      "code": "${moduleCode}E402",
      "message": "${moduleName} update failed.",
      "ariaLabel": "Notification: ${moduleName} update failed"
    },
    "listFailed": {
      "code": "${moduleCode}E405",
      "message": "${moduleName} list retrieval failed.",
      "ariaLabel": "Notification: ${moduleName} list retrieval failed"
    },
    "viewFailed": {
      "code": "${moduleCode}E406",
      "message": "${moduleName} details fetch failed.",
      "ariaLabel": "Notification: ${moduleName} details fetch failed"
    },
    "deleteFailed": {
      "code": "${moduleCode}E407",
      "message": "${moduleName} deletion failed.",
      "ariaLabel": "Notification: ${moduleName} deletion failed"
    }
  }
}
`;
  }

  function updateMainRouter(mainRouterFilePath, capitalizeModuleName, moduleName, pluralModuleName) {
    let mainRouterData = fs.readFileSync(mainRouterFilePath, 'utf8');

    // Create the import statement and route entry dynamically
    const importStatement = `const { ${capitalizeModuleName}Routes } = require('../modules/${pluralModuleName}/${moduleName}.module');`;
    const routeEntry = `{\n    path: '/${pluralModuleName}',\n    route: ${capitalizeModuleName}Routes\n  },`;


    // Ensure the import is **not duplicated**
    if (!mainRouterData.includes(importStatement)) {
      // Add import statement after existing imports (but before the `const API_PREFIX` line)
      mainRouterData = mainRouterData.replace(
        /const API_PREFIX/,
        `${importStatement}\nconst API_PREFIX`
      );
    }

    // Ensure the route is **not duplicated**
    if (!mainRouterData.includes(routeEntry)) {
      // Add route entry before the closing bracket `];` of the `routes` array
      mainRouterData = mainRouterData.replace(
        /const routes = \[\s*/, // Find routes array start
        "const routes = [\n"
      ).replace(
        /\];/, // Find closing bracket of routes array
        `  ${routeEntry}\n];`
      );
    }

    // Write the updated content back to the file
    fs.writeFileSync(mainRouterFilePath, mainRouterData);
    console.log('Main Router updated successfully!');
  }

  await scaffoldModuleAsync();


  if (!['mongodb', 'mysql', 'postgresql'].includes(provider)) {
    console.error(`Unsupported provider: ${provider}`);
    process.exit(1);
  }

  let datasourceBlock = '';

  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
    datasourceBlock += `datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}`;
  } else {
    const fallbackUrl =
      provider === 'mongodb'
        ? 'mongodb://localhost:27017/billing'
        : provider === 'mysql'
          ? 'mysql://user:password@localhost:3306/billing'
          : 'postgresql://user:password@localhost:5432/billing';

    datasourceBlock += `datasource db {
  provider = "${provider}"
  url      = "${fallbackUrl}"
}`;
  }

  datasourceBlock += `

generator client {
  provider = "prisma-client-js"
  output   = "./generated"
}
`;
  async function processModuleAsync(module = null) {
    return new Promise((resolve, reject) => {
      const prismaDir = path.resolve(__dirname, 'prisma', pluralModuleName);
      if (!fs.existsSync(prismaDir)) {
        fs.mkdirSync(prismaDir, { recursive: true });
      }

      const moduleSchemaDir = path.join(modulesPath, pluralModuleName, 'prisma');
      createDirIfNotExists(moduleSchemaDir);

      updatePrismaSchemas(moduleSchemaDir, prismaDir);
      resolve(); // Don't return resolve() directly
    });
  }

  // Recursive function to scan .schema.prisma files
  function updatePrismaSchemas(dirPath, prismaDir) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        updatePrismaSchemas(fullPath, prismaDir);
      } else if (file.endsWith('.schema.prisma')) {
        updateSchemaFile(fullPath, prismaDir);
      }
    });
  }


  function updateSchemaFile(filePath, prismaDir) {
    let schemaContent = fs.readFileSync(filePath, 'utf8');

    // Insert datasource & generator at the top
    schemaContent = datasourceBlock + '\n\n' + schemaContent.trim();

    // Modify each model block
    schemaContent = schemaContent.replace(/model\s+(\w+)\s*{([^}]*)}/gs, (match, modelName, modelBody) => {
      let lines = modelBody.trim().split('\n').map(line => line.trim());

      let mapDirective = '';
      let modelLines = [];

      // Extract @@map directive if present
      lines = lines.filter(line => {
        if (line.startsWith('@@map')) {
          mapDirective = line;
          return false;
        }
        return true;
      });

      // Check and insert ID field if missing
      const hasId = lines.some(line => line.startsWith('id '));
      if (!hasId) {
        let idField = '';
        if (provider === 'mongodb') {
          idField = 'id String @id @default(auto()) @map("_id") @db.ObjectId';
        } else if (provider === 'mysql' || provider === 'postgresql') {
          idField = 'id Int @id @default(autoincrement())';
        }
        lines.unshift(idField);
      }

      // Add system fields if missing
      if (!lines.some(line => line.startsWith('isDeleted '))) {
        lines.push('isDeleted       Boolean  @default(false)');
      }
      if (!lines.some(line => line.startsWith('createdAt '))) {
        lines.push('createdAt       DateTime @default(now())');
      }
      if (!lines.some(line => line.startsWith('updatedAt '))) {
        lines.push('updatedAt       DateTime @updatedAt');
      }

      // Indent all model lines
      modelLines = lines.map(line => '  ' + line);

      // Place @@map directive at the very end (after a blank line)
      if (mapDirective) {
        modelLines.push('', '  ' + mapDirective);
      }

      return `model ${modelName} {\n${modelLines.join('\n')}\n}`;
    });

    const fileName = path.basename(filePath);
    const newFilePath = path.join(prismaDir, fileName);
    fs.writeFileSync(newFilePath, schemaContent + '\n', 'utf8');
    console.log(`✅ Prisma schema created/updated in: ${newFilePath}`);
    const prismaFormatPath = path.resolve(newFilePath);
    // Format the generated schema file using Prisma CLI
    try {
      execSync(`npx prisma format --schema="${prismaFormatPath}"`, { stdio: 'inherit' });
      console.log(`🧼 Formatted schema: ${fileName}`);
    } catch (err) {
      console.warn(`⚠️ Failed to format Prisma schema: ${fileName}`);
    }

  }


  await processModuleAsync();

  console.log(`✅ Operation completed. Provider: ${provider}, URL: ${process.env.DATABASE_URL || '(default)'}`);



  const dummyByType = {
    String: (field) => field.toLowerCase().includes('email') ? '"test@example.com"' : `"${field}_value"`,
    Int: () => 1,
    Boolean: () => false,
    DateTime: () => `"${new Date().toISOString()}"`,
  };

  function parseModels(schemaContent) {
    const models = [];
    const modelRegex = /model\s+(\w+)\s*{([\s\S]+?)}/g;
    let match;

    while ((match = modelRegex.exec(schemaContent)) !== null) {
      const [, name, body] = match;
      const fields = body.trim().split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'))
        .map(line => {
          const [name, type] = line.split(/\s+/);
          return { name, type };
        });
      models.push({ name, fields });
    }

    return models;
  }

  function generateSeedContent(model) {
    const fieldEntries = model.fields
      .filter(f => !['id', 'createdAt', 'updatedAt'].includes(f.name) && !f.name.startsWith('@@map'))
      .map(f => {
        const val = dummyByType[f.type] ? dummyByType[f.type](f.name) : 'null';
        return `      ${f.name}: ${val}`;
      });

    return `const { PrismaClient : ${capitalizeModuleName.toUpperCase()}Prisma } = require('../prisma/${pluralModuleName}/generated');
const prisma = new ${capitalizeModuleName.toUpperCase()}Prisma();

async function main() {
  await prisma.${model.name}.createMany({
    data: [
      {
${fieldEntries.join(',\n')}
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded ${model.name}");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
`;
  }

  function generateTestContent(model) {
    const route = `/api/v1/${pluralModuleName}`;
    const idField = model.fields.find(f => f.name === 'id')?.type === 'String' ? '"some-id"' : '1';

    const payload = model.fields
      .filter(f => !['id', 'createdAt', 'updatedAt', '@@map'].includes(f.name) && !f.name.startsWith('@@map'))
      .map(f => {
        const val = dummyByType[f.type] ? dummyByType[f.type](f.name) : 'null';
        return `      ${f.name}: ${val}`;
      }).join(',\n');

    return `const request = require('supertest');
const app = require('../../app');

describe('${model.name} API', () => {
  let createdId;

  it('should create a ${model.name}', async () => {
    const res = await request(app)
      .post('${route}')
      .send({
${payload}
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('should fetch all ${pluralize(model.name)}', async () => {
    const res = await request(app).get('${route}');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch ${model.name} by ID', async () => {
    const res = await request(app).get(\`${route}/\${createdId}\`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update ${model.name}', async () => {
    const res = await request(app)
      .put(\`${route}/\${createdId}\`)
      .send({});

    expect([200, 204]).toContain(res.statusCode);
  });

  it('should delete ${model.name}', async () => {
    const res = await request(app).delete(\`${route}/\${createdId}\`);
    expect([200, 204]).toContain(res.statusCode);
  });
});
`;
  }

  function generateForModule() {
    const files = fs.readdirSync(path.join(prismaDir, pluralModuleName)).filter(f => f.endsWith('.schema.prisma'));

    files.forEach(file => {
      const schemaPath = path.join(prismaDir, pluralModuleName, file);
      const content = fs.readFileSync(schemaPath, 'utf8');
      const models = parseModels(content);

      models.forEach(model => {
        const testDir = path.join(testRoot, pluralModuleName);
        const seedDir = path.join(prismaDir, pluralModuleName);

        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
        if (!fs.existsSync(seedDir)) fs.mkdirSync(seedDir, { recursive: true });

        const testFile = path.join(testDir, `${model.name}.test.js`);
        const seedFile = path.join(seedDir, `${model.name}.seed.js`);

        fs.writeFileSync(testFile, generateTestContent(model), 'utf8');
        fs.writeFileSync(seedFile, generateSeedContent(model, moduleName), 'utf8');

        console.log(`✅ Generated: ${testFile}`);
        console.log(`✅ Generated: ${seedFile}`);
      });
    });
  }

  const moduleArg = args.find(arg => arg.startsWith('--module='));
  const all = args.includes('--all');

  if (all) {
    const modules = fs.readdirSync(modulePath).filter(f =>
      fs.statSync(path.join(modulePath, f)).isDirectory()
    );
    modules.forEach(generateForModule);
  } else if (moduleArg) {
    const moduleName = moduleArg.split('=')[1];
    generateForModule(moduleName);
  } else {
    console.error('❌ Please use --all or --module=<module_name>');
    process.exit(1);
  }

  try {
    // Blocking call, runs sequentially
    execSync(`npx prisma generate --schema="prisma/${pluralModuleName}/${moduleName}.schema.prisma"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`❌ Failed for: ${path.join(prismaDir, pluralModuleName, moduleName + '.schema.prisma')}\n${err}`);
  }


})()

