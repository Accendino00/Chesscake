const jwt = require('jsonwebtoken');
var config = require("../config")


// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
  
      jwt.verify(token, config.SECRET_KEY, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
  
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

module.exports = {
    authenticateJWT : authenticateJWT
};