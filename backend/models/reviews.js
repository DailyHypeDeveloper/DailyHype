// Name: Angie Toh Anqi
// Admin No: 2227915
// Class: DIT/FT/2B/02
// Date: 16.11.2023
// Description: Connect to database to manage review information

const { query } = require('../database');
const { DUPLICATE_ENTRY_ERROR, EMPTY_RESULT_ERROR, SQL_ERROR_CODE, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');

// create review
// make sure order is completed (concurrent: 2 sql statements)
// also ensure order belongs to the user
module.exports.createReview = function createReview(rating, reviewDescription, userID, productID, productDetailID, orderID) {
    const sql = `INSERT INTO review (rating, reviewDescription, userID, productID, updatedAt, productDetailID, orderID) 
    VALUES ($1, $2, $3, $4, NOW(), $5, $6);`;
    return query(sql, [rating, reviewDescription, userID, productID, productDetailID, orderID])
        .catch(function (error) {
            throw error;
        });
}

// retrieve reviews for one product
module.exports.getReviewByProductId = function getReviewByProductId(productID) {
    console.log('module.exports.getReviewByProductId', productID);
    // const sql = `SELECT * FROM review WHERE productID = $1`;
    const sql = `SELECT AU.name, R.rating, R.reviewDescription, ARRAY_AGG(I.url ORDER BY I.imageID) AS urls, R.createdAt, R.updatedAt
    FROM
        review R
        LEFT JOIN reviewimage RI ON R.reviewID = RI.reviewID
        LEFT JOIN image I ON RI.imageID = I.imageID
        LEFT JOIN appuser AU ON R.userid = AU.userid
    WHERE R.productID = $1
    GROUP BY R.reviewid, R.rating, R.reviewDescription, AU.name
    ORDER BY R.reviewid DESC`;

    return query(sql, [productID])
        .then(function (result) {
            const rows = result.rows;
            // if (rows.length === 0) {
            //     throw new EMPTY_RESULT_ERROR(`Review not found!`);
            // }
            return rows;
        });
}

// update review
// remove in ca2 - change to "repost", connect to old review
// also maybe reply to review like comments in ca2
module.exports.updateReview = function updateReview(rating, reviewDescription, reviewID) {
    // const sql = `UPDATE review SET rating = $1, reviewDescription = $2, updatedAt = NOW() 
    // WHERE reviewID = $3;`;
    const sql = `UPDATE review SET rating = $1, reviewDescription = $2, updatedAt = NOW() 
    WHERE reviewID = 4;`;
    return query(sql, [rating, reviewDescription, reviewID])
        .catch(function (error) {
            throw error;
        });
}

// delete review
// change to soft delete in ca2
module.exports.deleteReview = function deleteReview(reviewID) {
    const sql = `DELETE FROM review WHERE reviewID = $1`;
    return query(sql, [reviewID])
        .then((result) => {
            const rows = result.rowCount;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`Review Not Found`);
            }
            return rows;
        })
}

module.exports.getTotalReviewCount = function getTotalReviewCount() {
    const sql = `SELECT COUNT(*) AS total FROM review;`;

    return query(sql)
        .then(result => {
            //console.log(result.rows[0].total);
            return result.rows[0].total;
        })
        .catch(error => {
            throw new Error(`Error retrieving total review count: ${error.message}`);
        });
};

module.exports.getReviewsByLimit = function getReviewsByLimit(offset, limit) {

    const sql = `SELECT R.reviewid, AU.name, P.productname, R.rating, ARRAY_AGG(I.url ORDER BY I.imageID) AS urls, R.reviewdescription
    FROM
        review R
        LEFT JOIN reviewimage RI ON R.reviewID = RI.reviewID
        LEFT JOIN image I ON RI.imageID = I.imageID
        LEFT JOIN appuser AU ON R.userid = AU.userid
        LEFT JOIN product P ON R.productid = P.productid
    GROUP BY R.reviewid, R.rating, R.reviewdescription, AU.name, P.productname
    ORDER BY R.reviewid DESC
    LIMIT $1 OFFSET $2;`;

    return query(sql, [limit, offset])
        .then(result => {
            return result.rows;
        })
        .catch(error => {
            throw new Error(`Error retrieving reviews: ${error.message}`);
        });
};