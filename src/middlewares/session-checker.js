const jwt = require("jsonwebtoken");
const { PrismaClient: AUTHPrisma } = require("../../prisma/auth/generated");
const prisma = new AUTHPrisma();
// const { PrismaClient: MTRPrisma } = require("../../prisma/modulestorole/generated");
// const prismamtr = new MTRPrisma();
const { getMessage } = require("../utils/constant");
const accessConfig = require("../config/access.json");

const sessionChecker = async (req, res, next) => {
  next(); 
  // try {
  //   const authHeader = req.headers["authorization"];
  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({
  //       data: null,
  //       statusCode: 401,
  //       isError: true,
  //       message: getMessage("en", "error", "NO_TOKEN"),
  //       errorStack: null,
  //     });
  //   }

  //   const accessToken = authHeader.split(" ")[1];

  //   let decoded;
  //   try {
  //     decoded = jwt.verify(accessToken, (process.env.JWT_ACCESS_TOKEN_SECRET || 'test2342323232scdcdvdsvfgvfvfdsvder4324234'), { expiresIn: (process.env.JWT_EXPIRE_IN || 7200) });
  //   } catch (error) {
  //     if (error.name === "TokenExpiredError") {
  //       console.warn("Access token expired, attempting to refresh...");

  //       const refreshToken = req.headers["x-refresh-token"]; // Get refresh token from headers
  //       if (!refreshToken) {
  //         return res.status(401).json({
  //           data: null,
  //           statusCode: 401,
  //           isError: true,
  //           message: getMessage("en", "error", "TOKEN_EXPIRED"),
  //           errorStack: null,
  //         });
  //       }

  //       try {
  //         const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

  //         // Generate new tokens
  //         const newAccessToken = jwt.sign(
  //           { id: refreshDecoded.id },
  //           process.env.JWT_ACCESS_TOKEN_SECRET,
  //           { expiresIn: process.env.JWT_EXPIRE_IN || 7200 }
  //         );

  //         res.setHeader("x-access-token", newAccessToken); // Send new access token to client

  //         // Decode newly issued access token
  //         decoded = jwt.verify(newAccessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
  //       } catch (refreshError) {
  //         console.error("Refresh token invalid:", refreshError);
  //         return res.status(401).json({
  //           data: null,
  //           statusCode: 401,
  //           isError: true,
  //           message: getMessage("en", "error", "INVALID_REFRESH_TOKEN"),
  //           errorStack: null,
  //         });
  //       }
  //     } else {
  //       return res.status(401).json({
  //         data: null,
  //         statusCode: 401,
  //         isError: true,
  //         message: getMessage("en", "error", "UNAUTHORIZED"),
  //         errorStack: error.message,
  //       });
  //     }
  //   }

  //   if (!decoded || !decoded.id) {
  //     return res.status(401).json({
  //       data: null,
  //       statusCode: 401,
  //       isError: true,
  //       message: getMessage("en", "error", "FORBIDDEN"),
  //       errorStack: null,
  //     });
  //   }

  //   const user = await prisma.user.findUnique({
  //     where: { id: decoded.id },
  //     select: { id: true, email: true, role: true },
  //   });

  //   if (!user) {
  //     return res.status(401).json({
  //       data: null,
  //       statusCode: 401,
  //       isError: true,
  //       message: getMessage("en", "error", "USER_NOT_FOUND", "auth"),
  //       errorStack: null,
  //     });
  //   }

  //   req.user = user;

  //   // **Superadmin Bypass**
  //   if (user.role.toLowerCase() === "superadmin") {
  //     return next();
  //   }

  //   // Fetch allowed modules and operations for the role
  //   const allowedModulesToRole = await prismamtr.mtr.findUnique({
  //     where: { role: user.role.toLowerCase() },
  //     select: { modules: true },
  //   });

  //   if (!allowedModulesToRole || !allowedModulesToRole.modules) {
  //     return res.status(403).json({
  //       data: null,
  //       statusCode: 403,
  //       isError: true,
  //       message: getMessage("en", "error", "FORBIDDEN_ROLE"),
  //       errorStack: null,
  //     });
  //   }

  //   // **Extract module and method**
  //   const { moduleMapping, methodMapping, customOperations } = accessConfig;
  //   const requestedMethod = req.method;
  //   const requestedPath = req.baseUrl + req.path;

  //   const moduleName = req.baseUrl.split("/").pop();
  //   const mappedModule = moduleMapping[moduleName] || moduleName;
  //   const defaultOperation = methodMapping[requestedMethod] || methodMapping.wildcard;

  //   // **Check custom operations first**
  //   for (const operationKey in customOperations) {
  //     const operation = customOperations[operationKey];
  //     const regex = new RegExp(operation.pathPattern);

  //     if (operation.method === requestedMethod && regex.test(requestedPath)) {
  //       return checkPermission(allowedModulesToRole.modules, mappedModule, operation.operation, res, next);
  //     }
  //   }

  //   return checkPermission(allowedModulesToRole.modules, mappedModule, defaultOperation, res, next);
  // } catch (error) {
  //   console.error("SessionChecker Error:", error);
  //   return res.status(401).json({
  //     data: null,
  //     statusCode: 401,
  //     isError: true,
  //     message: getMessage("en", "error", "UNAUTHORIZED"),
  //     errorStack: error.message,
  //   });
  // }
};

// **Helper Function to Check Permissions**
// const checkPermission = (modules, moduleName, operation, res, next) => {
//   const moduleAccess = modules.find((mod) => mod.value === moduleName);

//   if (!moduleAccess) {
//     return res.status(403).json({
//       data: null,
//       statusCode: 403,
//       isError: true,
//       message: `Forbidden: You do not have access to ${moduleName}`,
//       errorStack: null,
//     });
//   }

//   if (!moduleAccess.operations.includes(operation)) {
//     return res.status(403).json({
//       data: null,
//       statusCode: 403,
//       isError: true,
//       message: `Forbidden: You do not have permission to ${operation} on ${moduleName}`,
//       errorStack: null,
//     });
//   }

//   next();
// };

module.exports = sessionChecker;
