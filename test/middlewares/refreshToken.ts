// import { verifyJWTToken, generateAuthToken, generateRefreshToken } from "../functions/jwt-token";
// import { setHttpOnlyCookieHeader } from "../functions/cookies";
// import { errorMessages } from "../errors";
// import { Request, Response, NextFunction } from "express";
// import { IRefreshToken } from "../types/auth";

// export function refreshToken(req: Request, res: Response, next: NextFunction) {
//   const userID = req.body.id;
//   if (userID === null) {
//     return res.status(403).send({ error: errorMessages.UNAURHOTIZED });
//   }

//   // if token is expired, refresh the token
//   if (req.body.tokenExpired) {
//     delete req.body.tokenExpired;
//     console.log("\nExpired Token");

//     Promise.all([userModel.getRefreshToken(userID), userModel.getUserByUserID(userID)])
//       .then(([result1, result2]) => {
//         verifyJWTToken(result1.refreshtoken, (err, data) => {
//           if (err) {
//             console.error(`\n${err}`);
//             if (err.name === "TokenExpiredError") {
//               return res.status(401).send({ error: errorMessages.TOKEN_EXPIRED });
//             } else {
//               return res.status(403).send({ error: errorMessages.UNAURHOTIZED });
//             }
//           } else {
//             const refreshToken = data as IRefreshToken;
//             const lastCreatedAt = new Date(refreshToken.lastcreatedat);
//             lastCreatedAt.setDate(lastCreatedAt.getDate() + 7);

//             const diff = Math.floor((lastCreatedAt.getTime() - new Date().getTime()) / (1000 * 60));
//             const newAuthToken = generateAuthToken({ email: result2.email, id: result2.userid, role: result2.rolename });

//             if (diff < 0) {
//               return res.status(403).send({ error: errorMessages.TOKEN_EXPIRED });
//             }

//             req.body.email = result2.email;
//             req.body.role = result2.rolename;
//             if (diff > 0 && diff < 60 * 24) {
//               // generate a new refresh token if two days left
//               const newRefreshToken = generateRefreshToken({ lastcreatedat: new Date().toISOString() });
//               userModel
//                 .storeRefreshToken(result2.userid, newRefreshToken)
//                 .then((result) => {
//                   if (result === 1) {
//                     setHttpOnlyCookieHeader("authToken", newAuthToken, res);
//                     next();
//                   } else {
//                     return res.status(500).send({ error: errorMessages.UNKNOWN_ERROR });
//                   }
//                 })
//                 .catch((error) => {
//                   console.error(`\n${error}`);
//                   return res.status(500).send({ error: errorMessages.UNKNOWN_ERROR });
//                 });
//             } else {
//               setHttpOnlyCookieHeader("authToken", newAuthToken, res);
//               next();
//             }
//           }
//         });
//       })
//       .catch((error) => {
//         console.error(`\n${error}`);
//         return res.status(500).send({ error: errorMessages.UNKNOWN_ERROR });
//       });
//   } else {
//     delete req.body.tokenExpired;
//     next();
//   }
// }
