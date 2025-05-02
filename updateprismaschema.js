require('dotenv').config(); // Load environment variables from .env file

const fs = require('fs');
const path = require('path');

// Get environment variables
const provider = process.env.DATABASE_PROVIDER || 'mongodb';

let datasourceBlock = '';

if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
  datasourceBlock += `datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}`;
} else {
  datasourceBlock += `datasource db {
  provider = "${provider}"
  url      = "mongodb://localhost:27017/billing"
}`;
}

// Path to the source schema directory
const schemaDir = path.resolve(__dirname, 'src', 'modules');

// Parse command-line arguments
const args = process.argv.slice(2);
const allModules = args.includes('--all');
const specificModule = args.find((arg) => arg.startsWith('--module='));

// Extract module name if provided, otherwise fall back to a default
const moduleName = specificModule ? specificModule.split('=')[1] : null;

// Check if moduleName is provided
if (!moduleName && !allModules) {
  console.error('ERROR: Please specify either --all or --module=<module_name>.');
  process.exit(1);
}

datasourceBlock += `

generator client {
  provider = "prisma-client-js"
  output   = "./generated"
}

`;

// Function to process a specific module directory
function processModule(moduleName) {
  const prismaDir = path.resolve(__dirname, 'prisma', moduleName);

  // Ensure the specific Prisma directory exists
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }

  // Start processing the schema files for the specific module
  const moduleSchemaDir = path.join(schemaDir, moduleName, 'prisma');
  if (fs.existsSync(moduleSchemaDir)) {
    updatePrismaSchemas(moduleSchemaDir, prismaDir);
     // Copy the seed file (auth.seed.js) to the target Prisma directory
     const seedFilePath = path.join(moduleSchemaDir, `${moduleName}.seed.js`);
     const targetSeedFilePath = path.join(prismaDir, `${moduleName}.seed.js`);
 
     if (fs.existsSync(seedFilePath)) {
       fs.copyFileSync(seedFilePath, targetSeedFilePath);
       console.log(`Seed file copied to: ${targetSeedFilePath}`);
     } else {
       console.log(`No seed file found for ${moduleName}.`);
     }
     
  } else {
    console.error(`ERROR: Module directory "${moduleSchemaDir}" does not exist.`);
    process.exit(1);
  }
}

// Function to update all .schema.prisma files in the directory
function updatePrismaSchemas(dirPath, prismaDir) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    // If it's a directory, recurse into it
    if (fs.statSync(fullPath).isDirectory()) {
      updatePrismaSchemas(fullPath, prismaDir);
    } else if (file.endsWith('.schema.prisma')) {
      // Update .schema.prisma files
      updateSchemaFile(fullPath, prismaDir);
    }
  });
}

// Function to update a specific schema file
function updateSchemaFile(filePath, prismaDir) {
  // Read the content of the schema file
  let schemaContent = fs.readFileSync(filePath, 'utf8');

  // Dynamically decide on the correct ID field type based on the provider
  let idField = '';
  if (provider === 'mongodb') {
    idField = 'String @id @default(auto()) @map("_id") @db.ObjectId';
  } else if (provider === 'mysql' || provider === 'postgresql') {
    idField = 'Int @id @default(autoincrement())';
  } else {
    console.error(`Unsupported provider: ${provider}`);
    process.exit(1);
  }

  // Add the datasource and generator block at the top of the schema content
  schemaContent = datasourceBlock + schemaContent;

  // Add the id field to each model in the schema file
  schemaContent = schemaContent.replace(/model\s+(\w+)\s*{([^}]+)}/g, (match, modelName, modelBody) => {
    // Add the id field to the model body
    const updatedModelBody = `id ${idField}\n  ${modelBody.trim()}`;
    return `model ${modelName} {\n  ${updatedModelBody}\n}`;
  });

  // Write the updated schema content to a new file in the specific prisma directory
  const fileName = path.basename(filePath);
  const newFilePath = path.join(prismaDir, fileName);

  fs.writeFileSync(newFilePath, schemaContent, 'utf8');

  console.log(`Prisma schema created/updated in: ${newFilePath}`);
}

// Main operation based on arguments
if (allModules) {
  // Process all modules in the modules directory
  const modules = fs.readdirSync(schemaDir).filter((file) => fs.statSync(path.join(schemaDir, file)).isDirectory());
  modules.forEach((module) => processModule(module));
  console.log('All modules processed.');
} else if (moduleName) {
  // Process the specific module
  processModule(moduleName);
} else {
  console.error('ERROR: Please specify either --all or --module=<module_name>.');
  process.exit(1);
}

console.log(`Operation completed. Provider: ${provider}, URL: ${process.env.DATABASE_URL || 'mongodb'}`);
