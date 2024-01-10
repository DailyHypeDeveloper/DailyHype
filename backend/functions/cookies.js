const { serialize } = require("cookie");

module.exports.setHttpOnlyCookieHeader = function setHttpOnlyCookieHeader(name, value, res) {
  const cookieValue = serialize(name, value, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  res.setHeader("Set-Cookie", cookieValue);
};

module.exports.clearHttpOnlyCookieHeader = function clearHttpOnlyCookieHeader(name, res) {
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
};
