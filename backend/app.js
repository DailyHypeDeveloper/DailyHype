const express = require("express");
const path = require("path");
const cors = require("cors");
const createHttpError = require("http-errors");
const usersRoute = require("./routes/users");
const ordersRoute = require("./routes/orders");
const productRoute = require("./routes/products");
const paymentRoute = require("./routes/payments");
const profileRoute = require("./routes/profile");
const deliveryRoute = require("./routes/delivery");
const reviewRoute = require("./routes/reviews");
const sendmail = require("./nodemailer/sendmail");

const app = express();
app.use(cors());
app.use(express.json()); // to process JSON in request body

// Q: What is this for?
// A: This code segment is meant to serve static files (CSS and JavaScript) located in the "public/user" directory and explicitly sets the Content-Type in the response headers for CSS and JavaScript files.

app.use(
  express.static(path.join(__dirname, "public"), {
    // Set the MIME type explicitly for .css and .js files
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);


// Q: What is this for?
// A: This will go to user and orders route in user.js and order.js (route folder).

app.use("/api", usersRoute);
app.use("/api", ordersRoute);
app.use("/api", productRoute);
app.use("/api", paymentRoute);
app.use("/api", profileRoute);
app.use("/api", deliveryRoute);
app.use("/api", reviewRoute);
// 404 handler
// Q: What happens if we do not have this middleware?
// A: If you do not have this middleware, requests for unknown resources (those that do not match any route or file in your application) will not be handled explicitly. Without a 404 handler middleware, the server would typically respond with a default response, such as a generic 404 error page or a minimal response indicating that the resource was not found.

app.use(function (req, res, next) {
  return next(
    createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`)
  );
});

// Error handler
// Q: What happens if we do not have this middleware?
// A: the above 404 error message will not be shown because it uses next() which is go to next middleware
// since this is the last middleware, it will show 404 if it includes from the previous middleware and 500
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  return res
    .status(err.status || 500)
    .json({ error: err.message || "Unknown Server Error!" });
});

// Q: Why must the 404 and error handler be the last middleware?
// A: we want them to work after the system checks every route
// if we put them in front of the other routes, these two will work first which we don't want
// these two middlewares accept every routes including modules route

module.exports = app;