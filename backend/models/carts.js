// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

const { query } = require("../database");

/**
 * get cart data by user id
 * @param {*} userID userid (int)
 * @returns Promise(array of objects) - [{cartid, productdetailid, qty, userid, createdat}]
 * @example
 * getCart(userid).then((data) => {
 *      data.forEach((item) => {
 *        console.log(item.qty)   // this is the quantity from cart
 *      })
 * })
 */
module.exports.getCart = function getCart(userID) {
  const sql = `
        SELECT * FROM cart WHERE userid = $1
    `;

  return query(sql, [userID]).then((result) => {
    const rows = result.rows;
    return rows;
  });
};
