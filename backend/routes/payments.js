// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02
// Date: 17.11.2023
// Description: Router for payments

const express = require('express');
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');
const paymentsModel = require('../models/payments');
const productsModel = require('../models/products');
const usersModel = require('../models/users');
const validationFn = require('../middlewares/validateToken');

const router = express.Router();

router.post('/payment-intent', validationFn.validateToken, function (req, res) {

    const data = req.body.data;
    const id = req.body.id;
    const role = req.body.role;
    const email = req.body.email;

    if (!id || !role || !email || role != "customer") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    // retrieve a list of product id
    const productDetailIDArr = data.map((item) => item.productdetailid);

    return productsModel.getProductDetailByIds(productDetailIDArr)
        .then(function (product) {

            const productIDArr = [];
            product.forEach((item) => {
                productIDArr.push(item.productid);
            })

            let totalAmount = 0;

            const condition = data.every((item) => {
                // check whether product exists in database
                const matchedProduct = product.find((item2) => item2.productdetailid === item.productdetailid);
                totalAmount += item.qty * matchedProduct.unitprice;

                // check whether the quantity is available
                return !matchedProduct || item.qty <= matchedProduct.qty;
            });

            if (!condition) {
                return res.status(400).json({ error: 'Insufficient Product Quantity' });
            }

            // round decimal points to 2 place
            totalAmount = Math.floor(parseFloat(totalAmount.toFixed(2)) * 100);
            return Promise.all([paymentsModel.getPaymentIntent(totalAmount), usersModel.getUserAddressByIdEmail(id, email), productsModel.getProductImageByProductIDArr(productIDArr)])
                .then(([payment, user, image]) => {
                    // console.log(image);
                    for (let i = 0; i < product.length; i++) {
                        for (let j = 0; j < image.length; j++) {
                            if (product[i].productid === image[j].productid) {
                                product[i].image = image[j].url;
                                break;
                            }
                        }
                    }
                    if (payment && user) {
                        return res.status(201).json({ clientSecret: payment.client_secret, address: user.address, email: email, product: product });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    error.errMessage = error.message;
                    if (error.errMessage != "Unknown Error" && error.errMessage != "User Not Found")
                        error.errMessage = "Payment Error";
                    throw error;
                })
        })

    // return productsModel
    //     .getProductDetailByIds(productIDArr)
    //     .then(function (product) {

    //         console.log(product);


    //     })
    //     .catch(function (error) {
    //         console.error(error);
    //         return res.status(error.statusCode || 500).json({ error: error.errMessage || 'Unknown Error' });
    //     });
});

module.exports = router;