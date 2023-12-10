// Name: Angie Toh Anqi
// Admin No: 2227915
// Class: DIT/FT/2B/02
// Date: 20.11.2023
// Description: Router for reviews

const express = require('express');
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');
const reviewsModel = require('../models/reviews');
const imageModel = require('../models/images');
const validationFn = require('../middlewares/validateToken');
const router = express.Router();

// for users
// create review
router.post('/review/:productID', validationFn.validateToken, function (req, res) {

    const productID = req.params.productID;

    const rating = req.body.rating;
    const reviewDescription = req.body.reviewDescription;
    
    const userID = req.body.id;
    const productDetailID = req.body.productDetailID;
    const orderID = req.body.orderID;

    // const reviewDescription = "hardcoded";
    //const userID = 29;
    // const productDetailID = 2;
    // const orderID = 16;

    // image = ???;
    return reviewsModel
        .createReview(rating, reviewDescription, userID, productID, productDetailID, orderID)
        .then(function (review) {
            console.log("createReview() called.")
            return res.json({ review });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
});

// retrieve reviews for one product
router.get('/review/:productID', function (req, res) {

    const productID = req.params.productID;

    return reviewsModel
        .getReviewByProductId(productID)
        .then(function (review) {
            console.log("getReviewByProductId() called.")
            return res.json({ review });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
});

// update review
router.put('/review/:reviewID', function (req, res) {

    const reviewID = req.params.reviewID;

    const rating = req.body.rating;
    const reviewDescription = req.body.description;
    // image = ???;

    return reviewsModel
        .createReview(rating, reviewDescription, reviewID)
        .then(function (review) {
            console.log("updateReview() called.")
            return res.json({ review });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
});

// delete review
router.delete('/deleteReview/:reviewID', function (req, res) {
    
    const reviewID = req.params.reviewID;

    return reviewsModel
        .deleteReview(reviewID)
        .then(function (review) {
            console.log("deleteReview() called.")
            return res.json({ review });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
});


// for admins
router.get('/reviewsCountAdmin', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;

    // checking whether the user token is valid
    if (!id || isNaN(id) || !role || !email || role != "admin") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    return reviewsModel
        .getTotalReviewCount()
        .then((count) => {
            return res.json({ count: count });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "Unknown Error" });
        })
})

router.get('/reviewsAdmin', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;
    const offset = req.query.offset;

    // checking whether the user token is valid
    if (!id || isNaN(id) || !role || !email || role != "admin") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    if (!offset || isNaN(offset)) {
        offset = 0;
    }

    return reviewsModel
        .getReviewsByLimit(offset, 10)
        .then(function (review) {
            return res.json({ review: review });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
})
module.exports = router;