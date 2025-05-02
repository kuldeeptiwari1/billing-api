const fs = require('fs');
const path = require('path');

module.exports = (controller) => async (req, res) => {
  const httpRequest = {
    body: req.body,
    query: req.query,
    params: req.params,
    session: req.session,
    ip: req.ip,
    method: req.method,
    path: req.path,
    file: req.file,
    files: req.files,
    headers: {
      'Content-Type': req.get('Content-Type'),
      Authorization: req.get('Authorization'),
      Referer: req.get('Referer'),
      'User-Agent': req.get('User-Agent')
    }
  };

  try {
    const httpResponse = await controller(httpRequest, req);

    const baseResponse = {
      statusCode: httpResponse.statusCode || 200,
      isError: !!httpResponse.isError,
      data: httpResponse.data || null,
      message: httpResponse.message || 'Request completed successfully'
    };

    // Set headers if present
    if (httpResponse.headers) {
      res.set(httpResponse.headers);
    }
    if (httpResponse.pagination) {
      return res.status(baseResponse.statusCode).json({ ...baseResponse, pagination: httpResponse.pagination });
    } else {
      return res.status(baseResponse.statusCode).json(baseResponse);
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      isError: true,
      data: null,
      message: `Server error: ${error.message}`
    });
  }
};
