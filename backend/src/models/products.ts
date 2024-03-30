import { QueryResult } from "pg";
import pool from "../database";
import { IGetProduct } from "../types/products";

export async function getProduct(limit: number, offset: number): Promise<IGetProduct[]> {
  let sql = `
        SELECT *
        FROM product
        LIMIT $1 OFFSET $2
    `;

  return pool
    .query(sql, [limit, offset])
    .then((result: QueryResult<IGetProduct>) => result.rows)
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export async function getProductDetailByPIDs(IDs: number[]) {
  let sql = `
        SELECT *
        FROM productdetail 
        WHERE productid ANY ($1)
    `;

  return pool
    .query(sql, [IDs])
    .then((result) => result.rows)
    .catch((error) => {
      console.error(error);
      throw error;
    });
}
