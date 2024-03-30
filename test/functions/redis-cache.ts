// import { client as redis } from "../redis";

// /**
//  * get or set cache
//  * @param {*} key cache name you want to set
//  * @param {*} callback function that returns data from database
//  * @returns stored data from key
//  */
// export function getOrSetCache(key: string, callback: () => Promise<any>) {
//   console.log(`\nCACHE ${key}`);
//   return new Promise(async (resolve, reject) => {
//     if (redis.isOpen && redis.isReady) {
//       const value = await redis.get(key);
//       if (value === null || value === undefined) {
//         console.log("CACHE MISS");
//         callback()
//           .then((newData) => {
//             redis.setEx(key, process.env.DEFAULT_EXPIRATION_TIME ?? 3600, JSON.stringify(newData));
//             resolve(newData);
//           })
//           .catch((error) => {
//             reject(error);
//           });
//       } else {
//         console.log("CACHE HIT");
//         resolve(JSON.parse(value));
//       }
//     } else {
//       callback()
//         .then((newData) => {
//           redis.setEx(key, process.env.DEFAULT_EXPIRATION_TIME, JSON.stringify(newData));
//           resolve(newData);
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     }
//   });
// }

// /**
//  * delete redis cache with key
//  * @param {*} key cache key that you want to delete
//  * @returns Prosmie<boolean> - (true, false)
//  * @example
//  */
// export function deleteCache(key: string) {
//   return new Promise(async (resolve) => {
//     const result = await redis.del(key);
//     if (result) {
//       console.log(`\nCACHE DELETE ${key}`);
//       resolve(true);
//     } else {
//       resolve(false);
//     }
//   });
// }

// /**
//  * set cache data
//  * @param {*} key cache key name (string)
//  * @param {*} data cache data (object)
//  * @returns Promise
//  */
// export function setCache(key: string, data: any) {
//   console.log(`\nCACHE SET ${key}`);
//   return redis.setEx(key, process.env.DEFAULT_EXPIRATION_TIME, JSON.stringify(data));
// }

// module.exports.setCache = (key, data) => {
//   console.log(`\nCACHE SET ${key}`);
//   return redis.setEx(key, process.env.DEFAULT_EXPIRATION_TIME, JSON.stringify(data));
// };

// /**
//  * get cache data
//  * @param {*} key cache key name (string)
//  * @returns Promise
//  *
//  */
// module.exports.getCache = (key) => {
//   console.log(`\nCACHE GET ${key}`);
//   return redis.get(key);
// };
