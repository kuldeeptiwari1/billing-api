// prismaClient.js
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */ 

const { PrismaClient } = require('@prisma/client');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env]['database'];

const db = {}; 

let prisma;

if (config.dialect === 'mongodb') {
  const connectionString = config.username && config.password
    ? `${config.dialect}://${config.username}:${config.password}@${config.host}/${config.databaseName}`
    : `${config.dialect}://${config.host}/${config.databaseName}`;

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });
} else if (config.dialect === 'mysql') {
  const connectionString = config.username && config.password
    ? `mysql://${config.username}:${config.password}@${config.host}/${config.databaseName}`
    : `mysql://${config.host}/${config.databaseName}`;

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });
}

db.prisma = prisma;
module.exports = db;
