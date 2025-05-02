const fs = require('fs');
const path = require('path');
const arguments = process.argv.slice(2);
const mainRouterFilePath = './src/loaders/routes.js';
const modulesPath = './src/modules';

var argsList = {
  moduleName: '',
  dbSchemaFile: '',
  generatorFor: 'all'
};

arguments.forEach((value, index) => {
  if (index == 0) {
    argsList.moduleName = value;
  } else if (index == 1) {
    argsList.dbSchemaFile = value;
  }
  if (index == 2) {
    argsList.generatorFor = value;
  }
});

function generateModuleCode(moduleName) {
  // Convert camelCase or PascalCase to space-separated words
  const words = moduleName.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_-]+/);

  // Get the first letter of each word & convert to uppercase
  const code = words.map((word) => word[0].toUpperCase()).join('');

  return code.length >= 2 ? code : moduleName.substring(0, 2).toUpperCase();
}

function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } else {
    console.log(`Directory already exists: ${dirPath}`);
  }
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

function scaffoldModule() {
  const moduleName = argsList.moduleName;
  const pluralModuleName = moduleName.plural();
  const capitalizeModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const modulePath = path.join(modulesPath, pluralModuleName);

  try {
    // Ensure dbSchemaFile exists
    fs.access(path.join(argsList.dbSchemaFile), fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File does not exist: ${argsList.dbSchemaFile}`);
      } else {
        try {
          fs.access(modulePath);
          console.log('Module already exists');
        } catch (error) {
          // Create the module directory structure
          createDirIfNotExists(modulePath);
          createDirIfNotExists(path.join(modulePath, 'locales'));
          createDirIfNotExists(path.join(modulePath, 'prisma'));

          const files = [
            { name: `${moduleName}.controller.js`, content: getControllerContent(capitalizeModuleName, moduleName) },
            { name: `${moduleName}.middleware.js`, content: getMiddlewareContent(capitalizeModuleName) },
            { name: `${moduleName}.module.js`, content: getModuleContent(capitalizeModuleName, moduleName) },
            { name: `${moduleName}.routes.js`, content: getRoutesContent(capitalizeModuleName) },
            { name: `${moduleName}.service.js`, content: getServiceContent(capitalizeModuleName, pluralModuleName) },
            { name: `${moduleName}.types.js`, content: getTypesContent(capitalizeModuleName, moduleName) },
            { name: `${moduleName}.validator.js`, content: getValidatorContent(argsList.dbSchemaFile) }
          ];

          fs.copyFileSync(
            argsList.dbSchemaFile,
            path.join(modulePath, 'prisma', `${moduleName.toLowerCase()}.schema.prisma`)
          );
          writeFile(
            path.join(modulePath, 'locales', 'en.json'),
            getLocalesContent(moduleName),
            `Created locales/en.json successfully!`
          );

          files.forEach(({ name, content }) => {
            writeFile(path.join(modulePath, name), content, `Created ${name} successfully!`);
          });

          updateMainRouter(mainRouterFilePath, capitalizeModuleName, moduleName, pluralModuleName);
        }
      }
    });
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
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

  const fieldTypeMap = {
    String: "Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'})",
    Int: "Joi.number().integer().messages({'number.base': 'must be an integer', 'any.required': 'is required'})",
    BigInt: "Joi.number().integer().messages({'number.base': 'must be an integer', 'any.required': 'is required'})",
    Float: "Joi.number().precision(2).messages({'number.base': 'must be a decimal', 'any.required': 'is required'})",
    Decimal: "Joi.number().precision(2).messages({'number.base': 'must be a decimal', 'any.required': 'is required'})",
    Boolean: "Joi.boolean().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'})",
    DateTime: "Joi.date().messages({'date.base': 'must be a valid date', 'any.required': 'is required'})",
    Json: "Joi.object().messages({'object.base': 'must be a valid JSON object', 'any.required': 'is required'})"
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
        const fieldType = parts[1];
        const attributes = parts.slice(2);

        if (!['id', 'createdAt', 'updatedAt'].includes(fieldName)) {
          addParams.push(fieldName);
          let validator = fieldTypeMap[fieldType] || "Joi.any().messages({'any.required': 'is required'})";
        
          if (attributes.includes('@default(null)')) {
            validator += ".allow(null, '')";
          } else if (attributes.includes('@default(false)')) {
            if(fieldName.toLowerCase() === 'isdeleted'){
              validator += ".default(false)";
            }else{
              validator += ".default(false).required()";
            }
          } else if (attributes.includes('@default(true)')) {
            if(fieldName.toLowerCase() === 'isdeleted'){
              validator += ".default(true)";
            }else{
              validator += ".default(true).required()";
            }
          } else if (attributes.includes('@default("")')) {
            validator += ".default('').required()";
          } else if (/^@default\((\d+)\)$/.test(attributes)) {
            let defaultValue = attributes.match(/^@default\((\d+)\)$/)[1];
            validator += `.default(${defaultValue}).required()`;
          } else {
            validator += ".required()";
          }
        
          addValidator[fieldName] = validator;
        }
      });
    }
  } else if (fileExtension === '.json') {
    const jsonData = JSON.parse(data);
    jsonData.forEach((field) => {
      if (field.name && field.type) {
        addParams.push(field.name);
        let validator = fieldTypeMap[field.type] || "Joi.any().messages({'any.required': 'is required'})";
        if (field.default === '' || field.default === null) {
          validator += ".allow(null, '')";
        } else {
          validator += '.required()';
        }
        addValidator[field.name] = validator;
      }
    });
  } else if (fileExtension === '.sql') {
    const startIndex = data.indexOf('` (') + '` ('.length;
    const endIndex = data.indexOf(') ENGINE=InnoDB DEFAULT CHARSET');
    const tableData = data.slice(startIndex, endIndex).split('\n').slice(1, -1);

    tableData.forEach((item) => {
      if (item.trim() !== '') {
        const sData = item.trim().split(' ');
        let fieldName = sData[0].replace(/`/g, '').replace(/[-_](\w)/g, (_, w) => w.toUpperCase());

        if (!['id', 'created_at', 'updated_at'].includes(fieldName)) {
          addParams.push(fieldName);
          let validator = "Joi.any().required().messages({'any.required': 'is required'})";

          if (sData[1].includes('decimal')) {
            validator = `Joi.number().precision(${
              sData[1].match(/\d+,\d+/)[0].split(',')[1]
            }).required().messages({'number.base': 'must be a decimal', 'any.required': 'is required'})`;
          } else if (sData[1].includes('int')) {
            validator =
              "Joi.number().integer().required().messages({'number.base': 'must be an integer', 'any.required': 'is required'})";
          } else if (sData[1].includes('varchar') || sData[1].includes('text')) {
            validator =
              "Joi.string().required().messages({'string.base': 'must be a string', 'any.required': 'is required'})";
          } else if (sData[1].includes('boolean')) {
            if(fieldName.toLowerCase()=='isdeleted'){
              validator =
              "Joi.boolean().default(false).required().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'})";
            }else{
              validator =
              "Joi.boolean().required().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'})";
            }
          } else if (sData[1].includes('datetime') || sData[1].includes('timestamp')) {
            validator =
              "Joi.date().required().messages({'date.base': 'must be a valid date', 'any.required': 'is required'})";
          }
          addValidator[fieldName] = validator;
        }
      }
    });
  }

  return `const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const options = {
    errors: {
        wrap: {
            label: ''
        }
    },
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}

module.exports = {
    add: (httpRequest) => {
        const schema = Joi.object(
            ${JSON.stringify(addValidator).replace(/"/g, '')}
        );
        return schema.validate(httpRequest.body, options);
    },
    update: (httpRequest) => {
        const schema = Joi.object(
             ${JSON.stringify(addValidator).replace(/"/g, '')}
        );
        return schema.validate(httpRequest.body, options);
    }
}
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

  return this; // Return the original string if no transformation occurs
};

scaffoldModule();
