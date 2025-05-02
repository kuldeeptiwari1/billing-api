// Routes
const { AuthRoutes } = require('../modules/auth/auth.module');
const { RoleRoutes } = require('../modules/roles/role.module');
const { MtrRoutes } = require('../modules/modulestorole/mtr.module');
const { StudentRoutes } = require('../modules/students/student.module');
const { CourseRoutes } = require('../modules/courses/course.module');
const { ExpenseRoutes } = require('../modules/expenses/expense.module');
const { InvoiceRoutes } = require('../modules/invoices/invoice.module');
const { ReceiptRoutes } = require('../modules/receipts/receipt.module');
const { ReportRoutes } = require('../modules/reports/report.module');
const API_PREFIX = '/api/v1';
const routes = [
{
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/roles',
    route: RoleRoutes
  },
  {
    path: '/mtr',
    route: MtrRoutes
  },
  {
    path: '/students',
    route: StudentRoutes
  },
  {
    path: '/courses',
    route: CourseRoutes
  },
  {
    path: '/expenses',
    route: ExpenseRoutes
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
    path: '/reports',
    route: ReportRoutes
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
