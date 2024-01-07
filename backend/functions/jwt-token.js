const jwt = require("jsonwebtoken");

module.exports.generateRefreshToken = function generateRefreshToken(obj, secretKey) {
  return jwt.sign(obj, secretKey, { expiresIn: "7d" });
};

module.exports.generateAuthToken = function generateAuthToken(obj, secretKey) {
  return jwt.sign(obj, secretKey, { expiresIn: "1h" });
};

module.exports.verifyJWTToken = function verifyJWTToken(token, secretKey, callback) {
  jwt.verify(token, secretKey, (err, data) => {
    if(err) {
      return callback(err, null);
    }
    else {
      return callback(null, data);
    }
  })
}