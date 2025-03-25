const jwt = require('jsonwebtoken');

// Middleware to authenticate the token
exports.auth = async (req, res, next) => {
  let token = req.header('x-api-key'); // Token is expected in the x-api-key header
  
  // Check if token is provided
  if (!token) {
    return res.status(401).json({ msg: 'Authentication token is required.' });
  }

  try {
    // Verify the token and extract data (payload) from it
    let tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use environment variable for the secret key

    // Attach the token data to the request object for use in the next middleware or route handler
    req.tokenData = tokenData;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ msg: 'Invalid or expired token.' });
  }
};
