import express from "express";
import { getProduct } from "../models/products";
import { ErrorMessages } from "../errors";

const router = express.Router();

router.get("/v1/products/latest", (req, res) => {
  let limit: number = parseInt(req.query.limit as string, 10) ?? 10;
  limit = limit > 0 ? limit : 10;

  return getProduct(limit, 0)
    .then((products) => {
      const productIDs = products.map((p) => p.productid);

      

      res.status(200).json({ data: products });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    });
});

export default router;
