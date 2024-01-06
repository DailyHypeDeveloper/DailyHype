const jwtFunctions = require("../functions/jwt-token");
const { parse } = require("cookie");

module.exports.validateToken = (req, res, next) => {
  let urlPath = req.route.path.split("/")[1];
  let token = parse(req.headers.cookie || "").authToken;

  if (token) {
    jwtFunctions.verifyJWTToken(token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") {
          if (urlPath === "validateToken") {
            req.body.tokenExpired = true;
            next();
          } else {
            return res.status(401).send({ error: "Token has expired" });
          }
        } else if (err.name === "JsonWebTokenError") {
          return res.status(401).send({ error: "Invalid token" });
        } else {
          return res.status(403).send({ error: "Unauthorized Access" });
        }
      } else {
        // change this according to jwt generation

        req.body.id = data.userId;
        req.body.role = data.role;
        req.body.email = data.email;

        next();
      }
    });
  } else {
    res.status(403).send({ error: "Unauthorized Access" });
  }
};
