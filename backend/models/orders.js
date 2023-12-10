// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02
// Date: 15.11.2023
// Description: Connect to database to manage order information

const { query } = require('../database');
const { DUPLICATE_ENTRY_ERROR, EMPTY_RESULT_ERROR, SQL_ERROR_CODE, INVALID_INPUT_ERROR, UNEXPECTED_ERROR } = require('../errors');

module.exports.getOrderByMonth = function getOrderByMonth(month, gender) {
    const sql = `
        SELECT po.orderid, u.name, u.gender, po.totalqty, po.totalamount
        FROM ProductOrder po, AppUser u
        WHERE po.userid = u.userid
        AND ($2 = '' OR u.gender = $2)
        AND EXTRACT(MONTH FROM po.createdat) = $1
    `;

    return query(sql, [month, gender])
        .then((result) => {
            return result.rows;
        })
}

module.exports.createOrder = function createOrder(qty, amount, deliveryAddress, userid) {
    const sql = `
        INSERT INTO ProductOrder (updatedAt, totalQty, totalAmount, deliveryAddress, orderStatus, userID) VALUES (NOW(), $1, $2, $3, $4, $5) RETURNING orderID;
    `;
    return query(sql, [qty, amount, deliveryAddress, "in progress", userid])
        .catch(function (error) {
            console.error(error);
            throw error;
        });
}

module.exports.createOrderItems = function createOrderItems(orderitems, orderid) {

    const placeholders = orderitems.map((item, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ');

    const sql = `
        INSERT INTO ProductOrderItem (productdetailid, orderid, qty, unitprice)
        VALUES ${placeholders};
    `;

    // combining all arrarys into a single array
    const params = orderitems.flatMap(item => [item.productdetailid, orderid, item.qty, item.unitprice]);

    return query(sql, params)
        .then(function (result) {
            return result.rowCount;
        })
        .catch(function (error) {
            console.error(error);
            throw error;
        })
}

module.exports.getOrderByIdStatusDate = function getOrderByIdStatusDate(userid, offset, status, month, year, search) {
    const sql = `
        SELECT DISTINCT po.orderid, po.totalqty, po.totalamount, po.deliveryaddress, po.orderstatus, po.createdat
        FROM ProductOrder po, Product p, ProductOrderItem poi, ProductDetail pd
        WHERE po.orderid = poi.orderid
        AND poi.productdetailid = pd.productdetailid
        AND pd.productid = p.productid
        AND po.userid = $1
        AND ($2 = '' OR po.orderstatus = $2)
        AND ($4 = 0 OR EXTRACT(MONTH FROM po.createdat) = $4)
        AND ($5 = 0 OR EXTRACT(YEAR FROM po.createdat) = $5)
        AND p.productname ILIKE $6
        ORDER BY po.createdat DESC
        LIMIT 5 OFFSET $3
    `;

    return query(sql, [userid, status, offset, month, year, '%' + search + '%'])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`User Order Not Found`);
            }
            return rows;
        })
}

// retrieve 10 orders for admin dashboard with offset
module.exports.getOrderByAdmin = function getOrderByAdmin(offset) {
    const sql = `
        SELECT o.orderid, o.totalqty, o.totalamount, o.deliveryaddress, o.orderstatus, u.name, o.createdat, p.paymentMethod, u.userid
        FROM ProductOrder o, Payment p, AppUser u
        WHERE o.orderid = p.orderid
        AND o.userid = u.userid
        ORDER BY o.createdat DESC
        LIMIT 10 OFFSET $1
    `;

    return query(sql, [offset])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`Order Not Found`);
            }
            return rows;
        })
}

// get total order count for admin dashboard
module.exports.getOrderCountByAdmin = function getOrderCountByAdmin() {
    const sql = `
        SELECT COUNT(*) AS count FROM ProductOrder 
    `;

    return query(sql, [])
        .then((result) => {
            const rows = result.rows;
            return rows[0].count;
        })
}

module.exports.getOrderByIDAdmin = function getOrderByIDAdmin(orderid) {
    const sql = `
        SELECT o.orderid, o.totalqty, o.totalamount, o.deliveryaddress, o.orderstatus, u.name, o.createdat, p.paymentMethod, u.userid
        FROM ProductOrder o, Payment p, AppUser u
        WHERE o.orderid = p.orderid
        AND o.userid = u.userid
        AND o.orderid = $1
    `;

    return query(sql, [orderid])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`Order Not Found`);
            }
            return rows[0];
        })
}

// get order detail by admin
module.exports.getOrderDetailByAdmin = function getOrderDetailByAdmin(orderid) {
    const sql = `
        SELECT pd.productdetailid, poi.qty, poi.unitprice, p.productname, s.name AS size, c.name AS colour, p.productid
        FROM ProductDetail pd, Product p, ProductOrderItem poi, Size s, Colour c
        WHERE poi.productdetailid = pd.productdetailid
        AND poi.orderid = $1
        AND pd.productid = p.productid
        AND pd.sizeid = s.sizeid
        AND pd.colourid = c.colourid
    `;

    return query(sql, [orderid])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`Order Not Found`);
            }
            return rows;
        })
}

// get order status by order id for checking update order status
module.exports.getOrderStatusById = function getOrderStatusById(orderid) {
    const sql = `
        SELECT orderstatus FROM ProductOrder WHERE orderid = $1
    `;

    return query(sql, [orderid])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`Order Not Found`);
            }
            return rows[0].orderstatus;
        })
}

// update order status from admin (confirmed, delivered, cancelled)
module.exports.updateOrderStatusByAdmin = function updateOrderStatusByAdmin(orderid, status) {
    const sql = `
        UPDATE ProductOrder SET orderstatus = $1 WHERE orderid = $2
    `;

    return query(sql, [status, orderid])
        .then(function (result) {
            const rows = result.rowCount;
            if (rows === 0) {
                throw new EMPTY_RESULT_ERROR(`Order ${orderid} Not Found`);
            }
            return rows;
        })
}


module.exports.getOrderItemQtyByOrderId = function getOrderItemQtyByOrderId(orderid) {
    const sql = `
        SELECT qty, productdetailid
        FROM ProductOrderItem
        WHERE orderid = $1
    `;

    return query(sql, [orderid])
        .then(function (result) {
            return result.rows;
        })
}

// retrieving individual order items by order id array 
// example order id array: [1, 2, 3]
module.exports.getOrderItemByOrderId = function getOrderItemByOrderId(orderidarr) {
    const sql = `
        SELECT poi.productdetailid, poi.qty, poi.unitprice, p.productname, p.rating, c.name AS colour, s.name AS size, poi.orderid, p.productid
        FROM ProductOrderItem poi, Colour c, Size s, ProductDetail pd, Product p
        WHERE pd.productid = p.productid
        AND pd.productdetailid = poi.productdetailid
        AND c.colourid = pd.colourid
        AND s.sizeid = pd.sizeid
        AND poi.orderid IN (SELECT UNNEST($1::int[]))
    `;

    return query(sql, [orderidarr])
        .then(function (result) {
            return result.rows;
        })
}

// get total number of order by user id and order status
module.exports.getTotalOrderCountById = function getTotalOrderCountById(userid, status, month, year, search) {
    const sql = `
        SELECT COUNT(DISTINCT po.*) AS count 
        FROM ProductOrder po, ProductOrderItem poi, Product p, ProductDetail pd
        WHERE po.orderid = poi.orderid
        AND poi.productdetailid = pd.productdetailid
        AND pd.productid = p.productid
        AND po.userid = $1 
        AND ($2 = '' OR po.orderstatus = $2)
        AND ($3 = 0 OR EXTRACT(MONTH FROM po.createdat) = $3)
        AND ($4 = 0 OR EXTRACT(YEAR FROM po.createdat) = $4)
        AND p.productname LIKE $5;
    `;

    return query(sql, [userid, status, month, year, '%' + search + '%'])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`User Order Not Found`);
            }
            return rows[0].count;
        })
}

// module.exports.updateOrder = function updateOrder(orderstatus, orderid) {

//     const status = ["in progress", "confirmed", "delivered", "cancelled", "order received"];
//     if (!status.includes(orderstatus)) {
//         throw new INVALID_INPUT_ERROR(`Invalid Order Status`);
//     }

//     const sql = `
//         UPDATE ProductOrder SET orderstatus = $1 WHERE orderid = $2
//     `;

//     return query(sql, [orderstatus, orderid])
//         .then(function (result) {
//             const rows = result.rowCount;
//             if (rows === 0) {
//                 throw new EMPTY_RESULT_ERROR(`Order Not Found`);
//             }
//             else if (rows !== 1) {
//                 throw new UNEXPECTED_ERROR(`Server Error`);
//             }
//             return rows;
//         })
// }

module.exports.updateOrderStatusByUser = function updateOrderStatusByUser(orderid, status, userid) {
    const sql = `
        UPDATE ProductOrder SET orderstatus = $1 WHERE orderid = $2 AND userid = $3
    `;

    return query(sql, [status, orderid, userid])
        .then((result) => {
            const rows = result.rowCount;
            if (rows === 0) {
                throw new EMPTY_RESULT_ERROR(`Order Not Found`);
            }
            return rows;
        })
}

module.exports.generateStats = function generateStats(startdate, enddate, region, gender, categoryid, productid) {
    const sql = `
        SELECT EXTRACT(MONTH FROM po.createdat) AS month, COUNT(DISTINCT po.*) AS count, u.gender
        FROM ProductOrder po
        JOIN AppUser u ON u.userid = po.userid
        JOIN ProductOrderItem poi ON poi.orderid = po.orderid
        JOIN ProductDetail pd ON pd.productdetailid = poi.productdetailid
        JOIN Product p ON p.productid = pd.productid
        JOIN Category c ON c.categoryid = p.categoryid
        WHERE ($1 = '' OR po.createdat >= $1::timestamp)
        AND ($2 = '' OR po.createdat <= $2::timestamp)
        AND ($3 = '' OR u.region = $3)
        AND ($4 = '' OR u.gender = $4)
        AND ($5 = 0 OR c.categoryid = $5)
        AND ($6 = 0 OR p.productid = $6)
        GROUP BY u.gender, EXTRACT(MONTH FROM po.createdat)
        ORDER BY 1
    `;

    return query(sql, [startdate, enddate, region, gender, categoryid, productid])
        .then((result) => {
            const rows = result.rows;
            return rows;
        })
}