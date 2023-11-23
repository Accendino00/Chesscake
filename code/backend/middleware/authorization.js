const jwt = require("jsonwebtoken");
var config = require("../config");

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header: " + authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403).send();
      }

      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401).send();
  }
};

module.exports = {
  authenticateJWT: authenticateJWT,
};
