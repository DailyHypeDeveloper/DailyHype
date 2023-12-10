

// Name: Ang Wei Liang
// Admin No: 2227791
// Class: DIT/FT/2B/02
// Date: 1.12.2023
// Description: Model for delivery
// Ver 2


const { query } = require('../database');
const { DUPLICATE_ENTRY_ERROR, EMPTY_RESULT_ERROR, SQL_ERROR_CODE, TABLE_ALREADY_EXISTS_ERROR } = require('../errors');



// This is the Model

//1) Creating Entities - With Checks

module.exports.checkOrderInPaymentTableAsync = async function checkOrderInPaymentTableAsync(orderID) { //at 20
    const sql = 'SELECT COUNT(*) AS count FROM payment WHERE orderID = $1';
    const result = await query(sql, [orderID]);
    const count = result.rows[0].count;
    console.log("Count0 is " + count)
    return count > 0;

}

// Assuming there's a 'payment' table with an 'orderID' column
module.exports.checkOrderExistsWithUserAsync = async function checkOrderExistsWithUserAsync(orderID, userID) {
    const sql = 'SELECT COUNT(*) AS count FROM productorder WHERE orderID = $1 AND userID = $2';
    const result = await query(sql, [orderID, userID]);
    const count = result.rows[0].count;
    console.log("Count is " + count)
    return count > 0;
}


module.exports.createADelivery = function create(deliverydate, deliverystatus, deliveystatusdetail, trackingnumber, shipperid) {

    const sql = `INSERT INTO delivery (deliverydate, deliverystatus, deliverystatusdetail, trackingnumber, shipperid, updatedat, updatedatConfirmed) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING deliveryid`;
    console.log("reached0")
    return query(sql, [deliverydate, deliverystatus, deliveystatusdetail, trackingnumber, shipperid])
        .then(result => {
            // Check if any rows were affected by the insert
            console.log("reached")
            if (result.rowCount > 0 && result.rows.length > 0) {
                // Return the ID of the created delivery
                return result.rows[0].deliveryid;
            } else {
                // If no rows were affected, something went wrong
                throw new Error('Failed to create delivery. No ID returned.');
            }
        })
        .catch(function (error) {
            if (error.errno === DELIVERY_ERROR_CODE.DUPLICATE_ENTRY) {
                throw new DUPLICATE_ENTRY_ERROR(`Delivery already exists`);
            }
            throw error;
        });
};


//2) Updating Entities - With Checks

//check if deliveryid inside orders table, before updating record
module.exports.checkIfDeliveryInOrderTable = async function checkIfDeliveryInOrderTable(deliveryIDs) {
    const results = await Promise.all(
        deliveryIDs.map(async (deliveryID) => {
            const query = `
          SELECT deliveryid
          FROM productorder
          WHERE deliveryid = $1;
        `;

            try {
                const result = await query(query, [deliveryID]);
                if (!result || result.length === 0) {
                    throw new Error(`Delivery ID ${deliveryID} not found in productorder table`);
                }
                console.log(`Delivery ID ${deliveryID} is in productorder table`);
                return { deliveryID, success: true };
            } catch (error) {
                console.error(`Error checking delivery ID ${deliveryID}: ${error.message}`);
                return { deliveryID, success: false, error: error.message };
            }
        })
    );

    return results;
};

module.exports.updateDeliveryUpdateSingleStatus = function updateDeliveryUpdateSingleStatus(deliveryid, newDeliverystatus, deliverystatusdetail) {
    const sql = `UPDATE delivery SET deliverystatus = $1, deliverystatusdetail = $2 WHERE deliveryid = $3`;

    return query(sql, [newDeliverystatus, deliverystatusdetail, deliveryid]).then(function (result) {
        if (result.rowCount === 0) {
            throw new EMPTY_RESULT_ERROR(`Delivery with ID ${deliveryid} not found!`);
        }
    });
};


module.exports.updateDeliveriesBatch = function updateDeliveriesBulk(updatedDeliveries) {
    const promises = updatedDeliveries.map(({ deliveryid, newDeliveryStatus, deliverystatusdetail, selectedDateDelivery }) => {

        const sql0 = `SELECT delivery.deliverystatusdetail FROM delivery WHERE deliveryid = $1`;

        return query(sql0, [deliveryid]).then(function (result) {
            const rows = result.rows;

            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`Delivery with ID ${deliveryid} not found!`);
            }

            const deliveryStatusDetailRetrieved = rows[0].deliverystatusdetail;

            console.log("Retrieved deliverydetailstatus" + deliveryStatusDetailRetrieved);

            console.log("deliverydate is " + selectedDateDelivery);

            let sql = 'UPDATE delivery SET deliverystatus = $1, deliverystatusdetail = $2, deliverydate = $3 WHERE deliveryid = $4';

            if (deliverystatusdetail == "Order confirmed") {
                let sqlAppend = "";
                if (deliveryStatusDetailRetrieved != deliverystatusdetail) {
                    sqlAppend = ", updatedatconfirmed = NOW()"
                }
                sql = 'UPDATE delivery SET deliverystatus = $1, deliverystatusdetail = $2, deliverydate = $3 ' + sqlAppend + ' WHERE deliveryid = $4';
            } else if (deliverystatusdetail == "Ready for pickup by company") {
                let sqlAppend = "";
                if (deliveryStatusDetailRetrieved != deliverystatusdetail) {
                    sqlAppend = ", updatedatcheck = NOW()"
                }
                sql = 'UPDATE delivery SET deliverystatus = $1, deliverystatusdetail = $2, deliverydate = $3 ' + sqlAppend + ' WHERE deliveryid = $4';
            } else if (deliverystatusdetail == "On the way") {
                let sqlAppend = "";
                if (deliveryStatusDetailRetrieved != deliverystatusdetail) {
                    sqlAppend = ", updatedatway = NOW()"
                }
                sql = 'UPDATE delivery SET deliverystatus = $1, deliverystatusdetail = $2, deliverydate = $3 ' + sqlAppend + ' WHERE deliveryid = $4';
            } else if (deliverystatusdetail == "Product delivered") {
                let sqlAppend = "";
                if (deliveryStatusDetailRetrieved != deliverystatusdetail) {
                    sqlAppend = ", updatedatpick = NOW()"
                }
                const sql1 = 'UPDATE delivery SET deliverystatus = $1, deliverystatusdetail = $2, deliverydate = $3 ' + sqlAppend + ' WHERE deliveryid = $4';
                const sql2 = `UPDATE productorder SET orderstatus = \'delivered\' WHERE deliveryid = $1`;

                query(sql1, [newDeliveryStatus, deliverystatusdetail, selectedDateDelivery, deliveryid])
                    .then(function (result1) {
                        if (result1.rowCount === 0) {
                            throw new EMPTY_RESULT_ERROR(`Delivery with ID ${deliveryid} not found!`);
                        }

                        return query(sql2, [deliveryid]);
                    })
                    .then(function (result2) {
                        if (result2.rowCount === 0) {
                            throw new EMPTY_RESULT_ERROR(`Product order for Delivery with ID ${deliveryid} not found!`);
                        }
                    })
                    .catch(error => {
                        throw new Error(`Error updating Product delivered status: ${error.message}`);
                    });
            } else {

            }

            const sqlInsert = sql
            console.log("Actual SQL is " + sqlInsert)


            return query(sqlInsert, [newDeliveryStatus, deliverystatusdetail, selectedDateDelivery, deliveryid])
                .then(function (result) {
                    if (result.rowCount === 0) {
                        throw new EMPTY_RESULT_ERROR(`Delivery with ID ${deliveryid} not found!`);
                    }
                })
                .catch(error => {
                    throw new Error(`Error updating delivery status: ${error.message}`);
                });
        });
    });

    return Promise.all(promises);
};





//3) Get Entities

module.exports.retrieveOneDelivery = function retrieveByCode(deliveryid) { //User- for single select
    const sql = `SELECT * FROM delivery WHERE deliveryid = $1`;
    return query(sql, [deliveryid]).then(function (result) {
        const rows = result.rows;

        if (rows.length === 0) {
            throw new EMPTY_RESULT_ERROR(`Delivery with ID ${deliveryid} not found!`);
        }

        return rows[0];
    });
};

module.exports.retrieveAllTrackingNumbers = function retrieveAllTrackingNumbers() {
    const sql = `SELECT deliveryid, trackingnumber FROM delivery`;
    return query(sql).then(function (result) {
        const rows = result.rows;
        return rows.map(row => ({ deliveryid: row.deliveryid, trackingnumber: row.trackingnumber }));
    });
};

module.exports.retrieveAllCurrentProductsCat = function retrieveAllCurrentProductsCat() {
    const sql = `SELECT categoryid, categoryname FROM category WHERE categoryname IS NOT NULL`;
    return query(sql).then(function (result) {
        const rows = result.rows;
        return rows.map(row => ({ categoryid: row.categoryid, categoryname: row.categoryname }));
    });
};
module.exports.retrieveAllUsersInRegions = function retrieveAllUsersInRegions() {
    const sql = `SELECT DISTINCT region FROM appuser WHERE region IS NOT NULL`;
    return query(sql).then(function (result) {
        const rows = result.rows;
        return rows.map(row => ({ region: row.region }));
    });
};

module.exports.retrieveAllShipperID = function retrieveAllShipperID() {
    const sql = `SELECT DISTINCT shipperid FROM deliveryshipper`;
    return query(sql).then(function (result) {
        const rows = result.rows;
        return rows.map(row => ({ shipId: row.shipperid }));
    });
};

module.exports.retrieveAllUserIds = function retrieveAllUserIds() {
    const sql = `SELECT DISTINCT userid FROM appuser`;
    return query(sql).then(function (result) {
        const rows = result.rows;
        return rows.map(row => ({ userId: row.userid }));
    });
};

module.exports.retrieveAllDeliveriesForUser = function retrieveAllDeliveriesForUser(userid) {
    const sql = `
        SELECT
            deliveryshipper.name as carrier, 
            deliveryshipper.phone as phone,
            delivery.deliveryid as deliveryId,
            delivery.deliverystatusdetail as deliveryStatusDetail,
            productorder.orderid as orderId,
            delivery.deliverydate as deliveryTime,
            productorder.deliveryaddress as deliveryAddress,
            delivery.deliverydate as estimatedDeliveryDate,
            delivery.deliverystatus as status,
            delivery.trackingnumber as trackingNumber,
            product.productname as name,
            product.description as description,
            image.url as image,
            product.unitprice as price,
            appuser.userid as userId, 
            appuser.name as userName
        
            
        FROM
            appuser
            JOIN productorder ON appuser.userid = productorder.userid
            JOIN delivery ON delivery.deliveryid = productorder.deliveryid
            JOIN productorderitem ON productorder.orderid = productorderitem.orderid
            JOIN productdetail ON productorderitem.productdetailid = productdetail.productdetailid
            JOIN product ON productdetail.productid = product.productid
            JOIN productimage ON productimage.productid = product.productid
            JOIN image ON productimage.imageid = image.imageid
            JOIN deliveryshipper ON delivery.shipperid = deliveryshipper.shipperid
        WHERE
            appuser.userid = $1`;

    return query(sql, [userid]).then(function (result) {
        const rows = result.rows;

        console.log(rows);

        /*if (rows.length === 0) {
            throw new EMPTY_RESULT_ERROR(`No deliveries found for user with ID ${userid}!`);
        }*/

        // If no deliveries found, return an empty array
        if (rows.length === 0) {
            return [];
        }

        // Group deliveries by deliveryId
        const deliveriesDict = rows.reduce((acc, row) => {
            const deliveryId = row.deliveryid;

            if (!acc[deliveryId]) {
                acc[deliveryId] = {
                    deliveryId: row.deliveryid,
                    deliveryStatusDetail: row.deliverystatusdetail,
                    orderId: row.orderid,
                    deliveryTime: row.deliverytime,
                    estimatedDeliveryDate: row.estimateddeliveryDate,
                    deliveryAddress: row.deliveryaddress,
                    shipping: {
                        carrier: row.carrier, // You may need to fetch this information from your database
                        phone: row.phone
                    },
                    status: row.status,
                    trackingNumber: row.trackingnumber,
                    //stepStatus: '2', // You may need to fetch this information from your database
                    items: []
                };
            }

            acc[deliveryId].items.push({
                name: row.name,
                description: row.description,
                image: row.image,
                price: row.price
            });

            return acc;
        }, {});

        // Convert deliveries dictionary to an array
        const deliveries = Object.values(deliveriesDict);

        return deliveries;

    });
};


module.exports.retrievechartJS1Array = async function retrievechartJS1Array(selectedDropdownValueForm, choiceNum, date1, date2) {

    var sqlstart = " ";
    var sqlend = " ";

    var sqlend2 = " delivery.deliverydate BETWEEN '" + date1 + "' AND '" + date2 + "' ";

    // Append WHERE condition based on selectedDropdownValueForm and choiceNum
    if (choiceNum == 1) {
        if (selectedDropdownValueForm == "Region") {

            sqlstart = "SELECT DISTINCT delivery.deliveryid, appuser.region"
            //sql += " WHERE appuser.userid = 14 AND appuser.region = 'YourRegionValue'";
            sqlend = " WHERE "



        } else if (selectedDropdownValueForm == "Category") {
            sqlstart = "SELECT DISTINCT delivery.deliveryid, category.categoryname"
            sqlend = " WHERE "

        } else if (selectedDropdownValueForm == "Gender") {
            sqlstart = "SELECT DISTINCT delivery.deliveryid, appuser.gender"
            sqlend = " WHERE "

        } else {
            // Default condition if none of the above
            sqlstart = "SELECT DISTINCT delivery.deliveryid, delivery.updatedatpick"
            sqlend = " WHERE delivery.updatedatpick IS NOT NULL AND";
        }

    } else if (choiceNum == 2) {


        console.log(selectedDropdownValueForm)
        sqlstart = "SELECT DISTINCT delivery.deliveryid, product.productname"
        sqlend = " WHERE category.categoryname = '" + selectedDropdownValueForm + "' AND";

    } else if (choiceNum == 3) {

        sqlstart = "SELECT DISTINCT delivery.deliveryid, appuser.name"
        sqlend = " WHERE appuser.region = '" + selectedDropdownValueForm + "' AND"

    } else if (choiceNum == 4) {

        sqlstart = "SELECT DISTINCT delivery.deliveryid, delivery.deliverydate, delivery.updatedatpick"
        sqlend = " WHERE delivery.deliverydate BETWEEN '" + date1 + "' AND '" + date2 + "' AND delivery.updatedatpick IS NOT NULL AND";
        //sqlend2 = " AND delivery.updatedatpick IS NOT NULL";

    } else {

    }

    var sql = sqlstart + " FROM appuser JOIN productorder ON appuser.userid = productorder.userid JOIN delivery ON delivery.deliveryid = productorder.deliveryid JOIN productorderitem ON productorder.orderid = productorderitem.orderid JOIN productdetail ON productorderitem.productdetailid = productdetail.productdetailid JOIN product ON productdetail.productid = product.productid JOIN category ON product.categoryid = category.categoryid JOIN productimage ON productimage.productid = product.productid JOIN image ON productimage.imageid = image.imageid JOIN deliveryshipper ON delivery.shipperid = deliveryshipper.shipperid" + sqlend + sqlend2 + ";";

    console.log("sql: " + sql)

    return query(sql).then(function (result) {
        const rows = result.rows;

        // Map the rows based on the selected field
        return rows.map(row => {
            let fieldValue;

            // Determine the field value based on choiceNum
            if (choiceNum == 1) {
                if (selectedDropdownValueForm == "Region") {
                    fieldValue = row.region;

                } else if (selectedDropdownValueForm == "Category") {
                    fieldValue = row.categoryname;

                } else if (selectedDropdownValueForm == "Gender") {
                    fieldValue = row.gender;

                } else {

                }

                //fieldValue = row.region;
            } else if (choiceNum == 2) {
                fieldValue = row.productname;
            } else if (choiceNum == 3) {
                fieldValue = row.name;
            } else if (choiceNum == 4) {
                fieldValue = categorizeTimeOfDay(row.deliverydate);

                function categorizeTimeOfDay(timestamp) {
                    // Convert the timestamp to a JavaScript Date object
                    const dateObject = new Date(timestamp);

                    // Get the hour from the Date object
                    const hour = dateObject.getHours();

                    // Define the boundaries for each time category
                    const morningStart = 6;
                    const afternoonStart = 12;
                    const eveningStart = 18;


                    // Categorize the time based on the hour
                    if (hour >= morningStart && hour < afternoonStart) {
                        return 'Morning';
                    } else if (hour >= afternoonStart && hour < eveningStart) {
                        return 'Afternoon';
                    } else {
                        console.log("Night hour is: " + hour)
                        return 'Evening/Night';
                    }
                }
            } else {
                // Handle the default case or any other conditions
            }

            // Return an object with both deliveryid and the dynamically selected field
            return { deliveryid: row.deliveryid, chartHeaderValue: fieldValue };
        });
    });
};


module.exports.retrievechartJS3Array = async function retrievechartJS2Array(deliveryIdsString, chartHeaderString) {

    console.log("RetrievechartJS3ArrayEncoded" + deliveryIdsString);

    const allDeliveryIdsArr = JSON.parse(decodeURIComponent(deliveryIdsString));

    const sqlBase = `
    SELECT GREATEST(
        ROUND(EXTRACT(EPOCH FROM (delivery.updatedatpick - delivery.deliverydate)) / 3600, 2),
        0
    ) AS hour_difference
FROM delivery
WHERE delivery.deliveryid = 
`;

    const promises = allDeliveryIdsArr.map(async function (deliveryId) {
        const sql = sqlBase + deliveryId;
        const result = await query(sql);
        const rows = result.rows;

        console.log("========================= ROWS2nd: " + rows.length);

        if (rows.length > 0) {
            console.log(rows[0].hour_difference);
            const fieldValue = {
                hour_difference: rows[0].hour_difference
            };

            console.log(fieldValue == null);

            return { deliveryid: deliveryId, chartHeaderValue: fieldValue };
        } else {

            return { deliveryid: deliveryId, chartHeaderValue: null };
        }
    });

    return Promise.all(promises);
};


module.exports.retrievechartJS2Array = async function retrievechartJS3Array(deliveryIdsString, chartHeaderString) {

    console.log("RetrievechartJS2ArrayEncoded" + deliveryIdsString);

    allDeliveryIdsArr = JSON.parse(decodeURIComponent(deliveryIdsString));

    //const allDeliveryIdsArr = deliveryIdsString.split('#');

    //const headersArr = chartHeaderString.split('#');

    const sqlBase = "SELECT" +
        " ROUND(GREATEST(COALESCE(EXTRACT(EPOCH FROM (delivery.updatedatcheck - delivery.updatedatconfirmed)) / 3600, 0), 0), 2) AS diff_ab_hours," +
        " ROUND(GREATEST(COALESCE(EXTRACT(EPOCH FROM (delivery.updatedatway - delivery.updatedatcheck)) / 3600, 0), 0), 2) AS diff_bc_hours," +
        " ROUND(GREATEST(COALESCE(EXTRACT(EPOCH FROM (delivery.updatedatpick - delivery.updatedatway)) / 3600, 0), 0), 2) AS diff_cd_hours " +
        " FROM delivery WHERE delivery.deliveryid = ";

    const promises = allDeliveryIdsArr.map(async function (deliveryId) {
        const sql = sqlBase + deliveryId;
        const result = await query(sql);
        const rows = result.rows;

        console.log("========================= ROWS: " + rows.length)

        if (rows.length > 0) {
            console.log(rows[0].diff_ab_hours + rows[0].diff_bc_hours + rows[0].diff_cd_hours)
            const fieldValue = {
                diff_ab_hours: rows[0].diff_ab_hours,
                diff_bc_hours: rows[0].diff_bc_hours,
                diff_cd_hours: rows[0].diff_cd_hours
            };

            console.log(fieldValue == null)

            return { deliveryid: deliveryId, chartHeaderValue: fieldValue };
        } else {

            // Handle the case when no rows are returned for a delivery ID
            return { deliveryid: deliveryId, chartHeaderValue: null };
        }
    });

    return Promise.all(promises);
};





//4) Delete Entities

module.exports.checkOrderCancelledFirst = function checkOrderCancelledFirst(deliveryid) {
    const sql = `
        SELECT productorder.orderstatus 
        FROM productorder 
        JOIN delivery ON productorder.deliveryid = delivery.deliveryid 
        WHERE delivery.deliveryid = $1;
    `;

    return query(sql, [deliveryid]).then(function (result) {
        if (result.rowCount === 0) {
            throw new EMPTY_RESULT_ERROR(`Delivery with ID ${deliveryid} not found!`);
        }

        const orderStatus = result.rows[0].orderstatus;

        if (orderStatus !== 'cancelled') {
            throw new Error(`Order is not cancelled for Delivery with ID ${deliveryid}`);
        }
    });
};


module.exports.removeDeliveryIDFromOrder = function removeDeliveryIDFromOrder(deliveryid) {
    const sql = `
    UPDATE productorder
    SET deliveryid = null
    WHERE deliveryid = $1;
    `;

    console.log("removing deliveryid to NULL")

    return query(sql, [deliveryid]).then(function (result) {
        if (result.rowCount === 0) {
            throw new Error(`No order found with associated delivery ID ${deliveryid}`);
        }

        return { message: 'Delivery ID removed from order successfully' };
    });
};

module.exports.deleteDelivery = function deleteByCode(deliveryid) {
    const sql = `DELETE FROM delivery WHERE deliveryid = $1`;
    return query(sql, [deliveryid]).then(function (result) {
        if (result.rowCount === 0) {
            throw new EMPTY_RESULT_ERROR(`Delivery with ID ${deliveryid} not found!`);
        }
    });
};




























/*module.exports.retrieveAllDeliveriesForUser4 = function retrieveAllDeliveriesForUser(userid) {
    const sql = `
        SELECT
            deliveryshipper.name,
            deliveryshipper.phone
            appuser.userid,
            appuser.name,
            product.productname,
            product.unitprice,
            delivery.deliveryid,
            delivery.deliverydate,
            delivery.deliverystatus,
            delivery.shippingcarrierphone,
            delivery.trackingnumber
        FROM
            appuser
            JOIN productorder ON appuser.userid = productorder.userid
            JOIN delivery ON delivery.deliveryid = productorder.deliveryid
            JOIN productorderitem ON productorder.orderid = productorderitem.orderid
            JOIN productdetail ON productorderitem.productdetailid = productdetail.productdetailid
            JOIN product ON productdetail.productid = product.productid
            JOIN deliveryshipper ON delivery.shipperid = deliveryshipper.shipperid
        WHERE
            appuser.userid = $1`;

    return query(sql, [userid]).then(function (result) {
        const rows = result.rows;

        if (rows.length === 0) {
            throw new EMPTY_RESULT_ERROR(`No deliveries found for user with ID ${userid}!`);
        }

        return rows;
    });
};*/


// OR
// Idea - delivery history - pending - SELECT all, under call to
// check if order exists and payment id exists, if order created - if not - then add create delivery - order first
// payment checked to order
// to create delivery - CHECK 1) Cocurrent check the orderID is in payment table, SAME TIME 2) orderID exists with user 

