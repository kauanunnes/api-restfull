const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
  if (req.url.includes("/user/login")) {
    return next();
  } else {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send("You aren't logged in")
    }

    const parts = authHeader.split(" ");

    if (!parts.length === 2) {
      return res.status(401).send("Your token isn't in the patterns.");
    } else {
      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send("Token bad formatted.");
      } else {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
          if (err) {
            return res.status(401).send("Invalid token.");
          } else {
            req.login = decoded.login;
            req.admin = decoded.admin;
            req.id = decoded.id;

            next();
          }
        });
      }
    }
  }
};