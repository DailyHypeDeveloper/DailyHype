import { serialize } from "cookie";
import { Response } from "express";

export function setHttpOnlyCookieHeader(name: string, value: string, res: Response): void {
  const cookieValue = serialize(name, value, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    maxAge: 1000 * 3600 * 24 * 5,
  });
  res.setHeader("Set-Cookie", cookieValue);
}

export function clearHttpOnlyCookieHeader(name: string, res: Response): void {
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
}
