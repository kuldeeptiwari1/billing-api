// Routes
const { AuthRoutes } = require('../modules/auth/auth.module');
const { StudentRoutes } = require('../modules/students/student.module');
const { InvoiceRoutes } = require('../modules/invoices/invoice.module');
const { ReceiptRoutes } = require('../modules/receipts/receipt.module');
const { ContactpersonRoutes } = require('../modules/contactpersons/contactperson.module');
const { BranchRoutes } = require('../modules/branches/branch.module');
const { DepartmentRoutes } = require('../modules/departments/department.module');
const { CourseRoutes } = require('../modules/courses/course.module');
const { UserRoutes } = require('../modules/users/user.module');
const API_PREFIX = '/api/v1';
const routes = [
{
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/students',
    route: StudentRoutes
  },
  {
    path: '/invoices',
    route: InvoiceRoutes
  },
  {
    path: '/receipts',
    route: ReceiptRoutes
  },
  {
    path: '/contactpersons',
    route: ContactpersonRoutes
  },
  {
    path: '/branches',
    route: BranchRoutes
  },
  {
    path: '/departments',
    route: DepartmentRoutes
  },
  {
    path: '/courses',
    route: CourseRoutes
  },
  {
    path: '/users',
    route: UserRoutes
  },
];

/**
 * Register routes with the app
 * @param {object} app - The Express app object
 */
module.exports = (app) => {
  routes.forEach(({ path, route, excludeAPIPrefix }) => {
    // If excludeAPIPrefix is true, use the path as is.
    // Otherwise, prepend the API_PREFIX to the path.
    const routePath = excludeAPIPrefix ? path : API_PREFIX + path;
    // Mount the route on the app using the determined route path.
    app.use(routePath, route);
  });
};
