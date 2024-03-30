import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import createHttpError from "http-errors";
import productsRoute from "./routes/products";

const app = express();

const corsOptions = {
  origin: process.env.FRONT_END_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

app.use("/api", productsRoute);

app.use(function (req: Request, res: Response, next: NextFunction) {
  return next(createHttpError(404, `Unknown Resource ${req.method} ${req.originalUrl}`));
});

const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
  return res.status(err.status || 500).json({ error: err.message || "Unknown Server Error!" });
};

app.use(errorHandler);

export default app;
