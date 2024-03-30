import jwt, { JwtPayload, VerifyCallback } from "jsonwebtoken";
import { IAuthToken, IRefreshToken } from "../types/auth";

/**
 *
 * @param obj
 * @returns
 */
export function generateRefreshToken(obj: IRefreshToken): string {
  if (!process.env.JWT_REFRESH_KEY) throw new Error("JWT_REFRESH_KEY is not defined");

  return jwt.sign(obj, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" });
}

/**
 *
 * @param obj
 * @returns
 */
export function generateAuthToken(obj: IAuthToken): string {
  if (!process.env.JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY is not defined");

  return jwt.sign(obj, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });
}

/**
 *
 * @param token
 * @param callback
 */
export function verifyJWTToken(token: string, callback: VerifyCallback<JwtPayload | string>): void {
  if (!process.env.JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY is not defined");

  jwt.verify(token, process.env.JWT_SECRET_KEY, callback);
}

/**
 *
 * @param token
 * @returns
 */
export function decodeJWTToken(token: string) {
  return jwt.decode(token);
}
