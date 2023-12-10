// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02
// Date: 17.11.2023
// Description: Connect to database to manage payment information and stripe payment

const { query } = require('../database');
const { DUPLICATE_ENTRY_ERROR, EMPTY_RESULT_ERROR, SQL_ERROR_CODE, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// generating payment intent when the user plans to checkout
module.exports.getPaymentIntent = function getPaymentIntent(amount, id) {

    return stripe.paymentIntents.create({
        amount: amount,
        currency: 'sgd'
    });
}

module.exports.insertPayment = function insertPayment(orderid, paymentObj) {

    const sql = `
        INSERT INTO Payment (orderid, paymentmethod, amount, paymentstatus, transactionid)
        VALUES ($1, $2, $3, $4, $5);
    `;

    return query(sql, [orderid, paymentObj.method, paymentObj.amount / 100, paymentObj.status, paymentObj.transactionid])
        .then(function (result) {
            return result.rowCount;
        })
        .catch(function (error) {
            console.error(error);
            throw error;
        });
}