// allowCorsMiddleware.js
module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow common HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allow common headers
  
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200); // Preflight requests handling
    }
    next(); // Proceed to the next middleware or route handler
  };