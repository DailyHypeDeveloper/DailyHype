// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02
// Date: 6.11.2023
// Description: Router for orders

const express = require('express');
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');
const ordersModel = require('../models/orders');
const productsModel = require('../models/products');
const paymentsModel = require('../models/payments');
const usersModel = require('../models/users');
const validationFn = require('../middlewares/validateToken');

const router = express.Router();

router.get('/orderStatsByMonth', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;

    if (!id || isNaN(id) || !email || !role || role != "admin") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    let month = req.query.month;
    let gender = req.query.gender;

    if (!gender) {
        gender = '';
    }
    else {
        if (gender.toLowerCase() === "male") {
            gender = 'M';
        }
        else {
            gender = 'F';
        }
    }

    if (!month || isNaN(month)) {
        return res.status(400).json({ error: "Invalid Request" });
    }

    return ordersModel
        .getOrderByMonth(month, gender)
        .then((result) => {
            return res.json({ stat: result })
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "Unknown Error" });
        })
})

router.get('/orderCount', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;

    if (!id || isNaN(id) || !email || !role || role != "customer") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    let status = req.query.status;
    let year = req.query.year;
    let month = req.query.month;
    let search = req.query.search;

    if (!status && status !== "delivered" && status !== "in progress" && status !== "confirmed" && status !== "cancelled" && status !== "received" && status !== "all") {
        return res.status(400).json({ error: "Invalid Request" });
    }

    if (status === "all") {
        status = "";
    }

    if (!month || isNaN(month)) {
        month = 0;
    }

    if (!year || isNaN(year)) {
        year = 0;
    }

    if (!search) {
        search = "";
    }
    else {
        search = search.trim();
    }

    return ordersModel.getTotalOrderCountById(id, status, month, year, search)
        .then(function (count) {
            return res.json({ count: count });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
})

router.get('/orders', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;

    if (!id || isNaN(id) || !email || !role || role != "customer") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    let offset = req.query.offset;
    let status = req.query.status;
    let month = req.query.month;
    let year = req.query.year;
    let search = req.query.search;

    if (!offset || isNaN(offset)) {
        offset = 0;
    }

    if (!month || isNaN(month)) {
        month = 0;
    }

    if (!year || isNaN(year)) {
        year = 0;
    }

    if (!search) {
        search = "";
    }
    else {
        search = search.trim();
    }

    if (!status && status !== "delivered" && status !== "in progress" && status !== "confirmed" && status !== "received" && status !== "cancelled" && status !== "all") {
        return res.status(400).json({ error: "Invalid Request" });
    }

    if (status === "all") {
        status = "";
    }

    return ordersModel.getOrderByIdStatusDate(id, offset, status, month, year, search)
        .then(function (order) {
            let orderIDArr = [];

            order.forEach((item) => {
                orderIDArr.push(item.orderid);
            })

            return ordersModel
                .getOrderItemByOrderId(orderIDArr)
                .then(function (orderitem) {
                    let productIDArr = [];

                    orderitem.forEach((item) => {
                        let index = order.findIndex((o) => o.orderid === item.orderid);

                        if (!productIDArr.includes(item.productid)) {
                            productIDArr.push(item.productid);
                        }

                        let product = {
                            productdetailid: item.productdetailid,
                            productname: item.productname,
                            rating: item.rating,
                            qty: item.qty,
                            unitprice: item.unitprice,
                            colour: item.colour,
                            size: item.size,
                            productid: item.productid
                        }

                        if (index !== -1) {
                            if (!order[index].productdetails) {
                                order[index].productdetails = [product];
                            }
                            else {
                                order[index].productdetails.push(product);
                            }
                        }
                    })

                    return productsModel
                        .getProductImageByProductIDArr(productIDArr)
                        .then((productImages) => {
                            for (let i = 0; i < order.length; i++) {
                                let productDetails = order[i].productdetails;
                                for (let j = 0; j < productDetails.length; j++) {
                                    for (let k = 0; k < productImages.length; k++) {
                                        if (productDetails[j].productid === productImages[k].productid) {
                                            order[i].productdetails[j].image = productImages[k].url;
                                            break;
                                        }
                                    }
                                }
                            }
                            return res.json({ order: order });
                        })
                })
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
});

router.get('/ordersCountAdmin', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;

    // checking whether the user token is valid
    if (!id || isNaN(id) || !role || !email || role != "admin") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    return ordersModel
        .getOrderCountByAdmin()
        .then((count) => {
            return res.json({ count: count });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "Unknown Error" });
        })
})

router.get('/ordersAdmin', validationFn.validateToken, function (req, res) {

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

    return ordersModel
        .getOrderByAdmin(offset)
        .then(function (order) {
            return res.json({ order: order });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Unknown Error" });
        })
})

router.get('/orderDetailAdmin/:orderid', validationFn.validateToken, function (req, res) {
    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;
    const orderid = req.params.orderid;

    // checking whether the user token is valid
    if (!id || isNaN(id) || !role || !email || role != "admin") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    if (!orderid || isNaN(orderid)) {
        return res.status(400).send({ error: 'Invalid OrderID' });
    }

    return Promise.all([ordersModel.getOrderByIDAdmin(orderid), ordersModel.getOrderDetailByAdmin(orderid)])
        .then(function ([order, orderDetail]) {
            const productIDArr = [];
            orderDetail.forEach((detail) => {
                if (!productIDArr.includes(detail.productid))
                    productIDArr.push(detail.productid);
            })
            return productsModel
                .getProductImageByProductIDArr(productIDArr)
                .then((productImages) => {
                    for (let i = 0; i < orderDetail.length; i++) {
                        for (let j = 0; j < productImages.length; j++) {
                            if (orderDetail[i].productid === productImages[j].productid) {
                                orderDetail[i].image = productImages[j].url;
                                break;
                            }
                        }
                    }
                    return res.json({ order: order, orderdetail: orderDetail });
                })
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: "Unknown Error" });
        })
})

// remaining: delete records and add qty if failed
router.post('/orders', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const role = req.body.role;
    const email = req.body.email;
    const { payment, address, order } = req.body;

    // checking whether the user token is valid
    if (!id || isNaN(id) || !role || !email || role != "customer") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    // checking whether all necessary data are provided
    if (!payment || !address || !order || !payment.method || !payment.amount || !payment.status || !payment.transactionid) {
        return res.status(400).json({ error: "Invalid Transaction" });
    }

    // inserting productdetailid from order to productIDArr
    // to get this array format ([1, 2, 3, ...])
    const productIDArr = order.map((item) => item.productdetailid);

    // concurrently doing getting user address and getting product qty and price
    // user address is just for checking whether (need to be changed)
    // getting qty and price to calculate and check the data sent from the frontend
    return Promise.all([usersModel.getUserAddressByIdEmail(id, email), productsModel.getProductQtyPriceByIds(productIDArr)])
        .then(function ([, productResult]) {
            let totalAmount = 0, totalQty = 0;

            // checking every order array elements for quantity and product
            const condition = order.every((item, index) => {
                // check whether product exists in database by matching with retrieved data
                const matchedProduct = productResult.find((item2) => item2.productdetailid === item.productdetailid);
                totalAmount += item.qty * matchedProduct.unitprice;
                order[index].unitprice = matchedProduct.unitprice;
                totalQty += item.qty;

                // check whether the quantity is sufficient
                return !matchedProduct || item.qty <= matchedProduct.qty;
            });

            if (!condition) {
                return res.status(400).json({ error: 'Insufficient Product Quantity' });
            }

            // formatting total amount to 2 decimal places
            totalAmount = parseFloat(totalAmount.toFixed(2));
            // in case if the total qty and total amount become 0, throw error
            if (totalQty <= 0 || totalAmount <= 0) {
                throw new Error("Unknown Error");
            }

            return ordersModel
                .createOrder(totalQty, totalAmount, address, id)
                .then((orderResult) => {

                    const orderid = orderResult.rows[0].orderid;
                    if (orderResult.rowCount !== 1) {
                        throw new Error("Unknown Error");
                    }

                    return Promise.all([ordersModel.createOrderItems(order, orderid), paymentsModel.insertPayment(orderid, payment)])
                        .then(([orderItemResult, paymentResult]) => {
                            if (orderItemResult === order.length && paymentResult === 1) {
                                const updateQtyExecute = [];
                                const updateStatusExecute = [];
                                order.forEach((item) => {
                                    updateQtyExecute.push(productsModel.reduceProductQtyById(item.qty, item.productdetailid));
                                    updateStatusExecute.push(productsModel.updateProductStatus(item.productdetailid));
                                })
                                return Promise.all(updateQtyExecute)
                                    .then((result) => {
                                        // summing all numbers in array
                                        let count = result.reduce((a, b) => a + b, 0);
                                        if (count === order.length) {
                                            return Promise.all(updateStatusExecute)
                                                .then(() => {
                                                    return res.status(201).json({});
                                                })
                                        }
                                        else
                                            throw new Error("Unknown Error");
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        throw error;
                                    })
                            }
                            else {
                                throw new Error("Unknown Error");
                            }
                        })
                        .catch((error) => {
                            console.log("ERROR");
                            console.error(error);
                            throw error;
                        })
                })
                .catch((error) => {
                    console.error(error);
                    throw error;
                })

        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: 'Unknown Error' });
        })
});

router.put('/orders/:orderid/:status/updateOrderByUser', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const role = req.body.role;
    const email = req.body.email;
    const orderid = req.params.orderid;
    const status = req.params.status;

    if (!id || !role || !email || role != "customer" || !orderid) {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    if (!orderid || isNaN(orderid) || !status || (status !== "cancelled" && status !== "received")) {
        return res.status(400).send({ error: 'Invalid Request' });
    }

    return ordersModel
        .getOrderStatusById(orderid)
        .then((orderstatus) => {
            orderstatus = orderstatus.toLowerCase();
            if (orderstatus === "in progress" && status === "cancelled") {
                return Promise.all([ordersModel.updateOrderStatusByUser(orderid, status, id), ordersModel.getOrderItemQtyByOrderId(orderid)])
                    .then(function ([updateStatus, orderitems]) {
                        if (orderitems) {
                            const updateProductQtyExecute = [];
                            const updateProductStatusExecute = [];
                            orderitems.forEach((item) => {
                                updateProductQtyExecute.push(productsModel.increaseProductQtyById(item.qty, item.productdetailid));
                                updateProductStatusExecute.push(productsModel.updateProductStatus(item.productdetailid));
                            })
                            return Promise.all(updateProductQtyExecute)
                                .then(function (result) {
                                    let count = result.reduce((a, b) => a + b, 0);
                                    if (count !== orderitems.length)
                                        throw new Error("Unknown Error");
                                    else {
                                        return Promise.all(updateProductStatusExecute)
                                            .then(() => {
                                                return res.status(201).json({ message: "Update Success" });
                                            })
                                    }

                                })
                                .catch(function (error) {
                                    console.error(error);
                                    throw error;
                                })
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                        return res.status(500).json({ error: "Unknown Error" });
                    })
            }
            else if (orderstatus === "delivered" && status === "received") {
                return Promise.all([ordersModel.updateOrderStatusByUser(orderid, status, id), productsModel.getProductIDByOrderID(orderid)])
                    .then(([, productResult]) => {
                        if (productResult && productResult.length > 0) {
                            let soldqtyupdate = [];
                            productResult.forEach((product) => {
                                soldqtyupdate.push(productsModel.increaseSoldQty(product.qty, product.productid));
                            })
                            return Promise.all(soldqtyupdate)
                                .then(() => {
                                    return res.status(201).json({ message: "Update Success" });
                                })
                        }
                        else {
                            throw new Error(`Order Item Retrieve Error`);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).json({ error: "Unknown Error" });
                    })
            }
            return res.status(400).json({ error: "Invalid Status" });
        })
})

router.put('/orders/:orderid/:status/updateOrderByAdmin', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;
    const orderid = req.params.orderid;
    const status = req.params.status;

    if (!id || isNaN(id) || !email || !role || role !== "admin") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    if (!orderid || isNaN(orderid) || !status || (status !== "confirmed" && status !== "delivered" && status !== "cancelled")) {
        return res.status(400).send({ error: 'Invalid Request' });
    }

    return ordersModel
        .getOrderStatusById(orderid)
        .then(function (orderstatus) {
            orderstatus = orderstatus.toLowerCase();
            // checking order status before updating status
            if (orderstatus === "in progress" && status === "confirmed") {
                return ordersModel.
                    updateOrderStatusByAdmin(orderid, status)
                    .then(function (count) {
                        if (count === 1) {
                            return res.sendStatus(201);
                        }
                    })
            }
            else if (orderstatus === "in progress" && status === "cancelled") {
                return Promise.all([ordersModel.updateOrderStatusByAdmin(orderid, status), ordersModel.getOrderItemQtyByOrderId(orderid)])
                    .then(function ([updateStatus, orderitems]) {
                        if (orderitems) {
                            const updateProductQtyExecute = [];
                            const updateProductStatusExecute = [];
                            orderitems.forEach((item) => {
                                updateProductQtyExecute.push(productsModel.increaseProductQtyById(item.qty, item.productdetailid));
                                updateProductStatusExecute.push(productsModel.updateProductStatus(item.productdetailid));
                            })
                            return Promise.all(updateProductQtyExecute)
                                .then(function (result) {
                                    let count = result.reduce((a, b) => a + b, 0);
                                    if (count !== orderitems.length)
                                        throw new Error("Unknown Error");
                                    else {
                                        return Promise.all(updateProductStatusExecute)
                                            .then(() => {
                                                return res.status(201).json({ message: "Update Success" });
                                            })
                                    }

                                })
                                .catch(function (error) {
                                    console.error(error);
                                    throw error;
                                })
                        }
                    })
                    .catch(function (error) {
                        console.error(error);
                        return res.status(500).json({ error: "Unknown Error" });
                    })
            }
            return res.status(400).json({ error: "Invalid Status" });
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: "Unknown Error" });
        })
})

router.get('/orderstats', validationFn.validateToken, function (req, res) {

    const id = req.body.id;
    const email = req.body.email;
    const role = req.body.role;
    let productid = req.query.productid;
    let startdate = req.query.startdate;
    let enddate = req.query.enddate;
    let region = req.query.region;
    let gender = req.query.gender;
    let categoryid = req.query.categoryid;
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Assuming a format like YYYY-MM-DD

    if (!id || isNaN(id) || !email || !role || role !== "admin") {
        return res.status(403).send({ error: 'Unauthorized Access' });
    }

    if (!startdate) {
        startdate = '';
    }
    else {
        if (!(regex.test(startdate) && !isNaN(new Date(startdate)))) {
            startdate = '';
        }
        else {
            startdate = new Date(startdate).toISOString();
        }
    }

    if (!enddate) {
        enddate = '';
    }
    else {
        if (!(regex.test(enddate) && !isNaN(new Date(enddate)))) {
            enddate = '';
        }
        else {
            enddate = new Date(enddate).toISOString();
        }
    }

    if (!productid && isNaN(productid)) {
        productid = 0;
    }

    if (!categoryid && isNaN(categoryid)) {
        categoryid = 0;
    }

    if (!region) {
        region = '';
    }
    else {
        region = region.toLowerCase();
        if (region === "all") {
            region = '';
        }
        if (!(region === "west" || region === "central" || region === "east" || region === "south" || region === "north")) {
            region = '';
        }
    }

    if (!gender) {
        gender = '';
    }
    else {
        gender = gender.toUpperCase();
        if (gender !== "M" && gender !== "F") {
            gender = '';
        }
    }

    return ordersModel
        .generateStats(startdate, enddate, region, gender, categoryid, productid)
        .then((result) => {
            return res.status(200).json({ stat: result });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "Unknown Error" });
        })
})

module.exports = router;