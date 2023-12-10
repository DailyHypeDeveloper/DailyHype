
// Name: Ang Wei Liang
// Admin No: 2227791
// Class: DIT/FT/2B/02
// Date: 1.12.2023
// Description: Router for delivery
// Ver 2

const express = require('express');

const router = express.Router();

const userModel = require('../models/users');
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR } = require('../errors');
const deliveryController = require('../models/deliveries');

const validationFn = require('../middlewares/validateToken');



//1) Insert Controllers

router.post('/deliveries', validationFn.validateToken, async (req, res) => {
  try {

    const { orderID, userID, deliverydate, deliverystatus, deliverystatusdetail, trackingnumber, shipperid } = req.body;
    console.log("userID is " + userID);

    // Concurrently check if the orderID is in the payment table and orderID exists with the user
    // ** Important
    const [isOrderPaid, isOrderExistsWithUser] = await Promise.all([
      await deliveryController.checkOrderInPaymentTableAsync(orderID),
      await deliveryController.checkOrderExistsWithUserAsync(orderID, userID)
    ]);

    console.log("userID2 is " + userID);
    // Proceed with creating the delivery if both checks pass
    if (isOrderPaid && isOrderExistsWithUser) {
      console.log("reached-1")
      const newDelivery = await deliveryController.createADelivery(deliverydate, deliverystatus, deliverystatusdetail, trackingnumber, shipperid);
      res.status(201).json(newDelivery);
    } else {
      // Handle the case where one or both checks fail
      res.status(400).json({ error: "Failed to create delivery. Check payment and user information." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//2) Update Controllers

// Update Deliveries in Batch -- Admin - multiple edits
router.put('/updateDeliveryStatusBatch', validationFn.validateToken, async (req, res) => {
  try {
    const updatedDeliveries = req.body; // An array of { id, newStatus } objects

    // Assuming there is a function in your controller to handle batch updates

    //console.log("1")
    await deliveryController.checkIfDeliveryInOrderTable(updatedDeliveries)
    //console.log("2")
    await deliveryController.updateDeliveriesBatch(updatedDeliveries);
    //console.log("3")

    res.json({ message: 'Deliveries updated successfully' });
  } catch (error) {
    console.log("failed")
    res.status(400).json({ error: error.message });
  }
});



//3) Get Controllers

// Retrieve a Delivery by ID - For Customer
router.get('/deliveries/:deliveryid', validationFn.validateToken, async (req, res) => {
  try {
    const deliveryid = req.params.deliveryid;
    const delivery = await deliveryController.retrieveOneDelivery(deliveryid);
    res.json(delivery);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/categoriesForDelivery', validationFn.validateToken, async (req, res) => {
  try {
    const categories = await deliveryController.retrieveAllCurrentProductsCat();
    res.json(categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/userRegionsForDelivery', validationFn.validateToken, async (req, res) => {
  try {
    const regionUser = await deliveryController.retrieveAllUsersInRegions();
    res.json(regionUser);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/shipperIdForDelivery', validationFn.validateToken, async (req, res) => {
  try {
    const shipperIdList = await deliveryController.retrieveAllShipperID();
    res.json(shipperIdList);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve all Tracking Numbers for update
router.get('/trackingnumbers', validationFn.validateToken, async (req, res) => {
  try {
    const trackingNumbers = await deliveryController.retrieveAllTrackingNumbers();
    res.json(trackingNumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aim: Obtain delivery Ids.
router.get('/chartJS1', validationFn.validateToken, async (req, res) => {
  try {

    const selectedDropdownValueForm = req.query.selectedDropdownValueForm;

    const choiceNum = req.query.choiceNum;

    const date1 = req.query.date1;
    const date2 = req.query.date2;

    const chartJS1Array = await deliveryController.retrievechartJS1Array(selectedDropdownValueForm, choiceNum, date1, date2);
    res.json(chartJS1Array);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/chartJSPart2', validationFn.validateToken, async (req, res) => {
  try {

    //const deliveryIdsString = decodeURIComponent(req.query.deliveryIds);
    //const chartHeaderString = decodeURIComponent(req.query.chartHeaderString);

    const deliveryIdsString = req.query.deliveryIds;
    const chartHeaderString = req.query.chartHeaderString;

    console.log("dID" + deliveryIdsString)
    console.log("CStr" + chartHeaderString)

    const chartJS1Array2Execute = deliveryController.retrievechartJS2Array(deliveryIdsString, chartHeaderString);
    const chartJS2Array3Execute = deliveryController.retrievechartJS3Array(deliveryIdsString, chartHeaderString);

    const [chartJS1Array2, chartJS2Array3] = await Promise.all([chartJS1Array2Execute, chartJS2Array3Execute]);

    const namesArr = JSON.parse(decodeURIComponent(chartHeaderString))


    console.log("nameArr is" + namesArr)

    const averagedDiffHours = {};

    console.log("Array 2 Print: ");
    console.log(chartJS1Array2);

    // Iterate through the namesArray
    console.log("names length " + namesArr.length);
    for (let i = 0; i < namesArr.length; i++) {
      const name = namesArr[i];
      console.log("reached pre header value");
      const diffHours = chartJS1Array2[i].chartHeaderValue;
      console.log("reached pass header value");

      // Check if the name already exists in the averagedDiffHours object
      if (averagedDiffHours.hasOwnProperty(name)) {
        // If the name exists, increment the count and update the running total
        averagedDiffHours[name].count++;
        averagedDiffHours[name].diff_ab_hours += parseFloat(diffHours.diff_ab_hours);
        averagedDiffHours[name].diff_bc_hours += parseFloat(diffHours.diff_bc_hours);
        averagedDiffHours[name].diff_cd_hours += parseFloat(diffHours.diff_cd_hours);
      } else {
        // If the name doesn't exist, create a new entry in the averagedDiffHours object
        averagedDiffHours[name] = {
          count: 1,
          diff_ab_hours: parseFloat(diffHours.diff_ab_hours),
          diff_bc_hours: parseFloat(diffHours.diff_bc_hours),
          diff_cd_hours: parseFloat(diffHours.diff_cd_hours),
        };
      }
    }

    // Calculate averages for each category
    Object.keys(averagedDiffHours).forEach(name => {
      // Check if all diff_hours values are 0 for the name
      const allZero = (
        averagedDiffHours[name].diff_ab_hours === 0 &&
        averagedDiffHours[name].diff_bc_hours === 0 &&
        averagedDiffHours[name].diff_cd_hours === 0
      );

      // If all values are 0, skip this name from the average calculation
      if (!allZero) {
        averagedDiffHours[name].diff_ab_hours /= averagedDiffHours[name].count;
        averagedDiffHours[name].diff_bc_hours /= averagedDiffHours[name].count;
        averagedDiffHours[name].diff_cd_hours /= averagedDiffHours[name].count;
      }
    });

    // Convert the averagedDiffHours object into an array of objects with averages
    const averagedDiffHoursArray = Object.entries(averagedDiffHours).map(([name, diffHours]) => ({
      name,
      diff_ab_hours: diffHours.diff_ab_hours,
      diff_bc_hours: diffHours.diff_bc_hours,
      diff_cd_hours: diffHours.diff_cd_hours,
    }));


    const averagedDiffHoursJSON = JSON.stringify(averagedDiffHoursArray);


    console.log(averagedDiffHoursJSON);

    const summedLateHours = {};
    console.log("Array 3 Print: ");
    console.log(chartJS2Array3);

    console.log("names length " + namesArr.length);
    for (let i = 0; i < namesArr.length; i++) {
      const name = namesArr[i];
      console.log("reached pre header value");
      const lateHours = chartJS2Array3[i].chartHeaderValue;
      console.log("reached pass header value");

      // Check if the name already exists in the summedLateHours object
      if (summedLateHours.hasOwnProperty(name)) {
        // If the name exists, update the running total
        summedLateHours[name].hour_difference += parseFloat(lateHours.hour_difference);
      } else {
        // If the name doesn't exist, create a new entry in the summedLateHours object
        summedLateHours[name] = {
          hour_difference: parseFloat(lateHours.hour_difference),
        };
      }
    }

    // Convert the summedLateHours object into an array of objects with sums
    const summedLateHoursArray = Object.entries(summedLateHours).map(([name, lateHours]) => ({
      name,
      hour_difference: lateHours.hour_difference,
    }));

    // Convert the summedLateHoursArray to JSON
    const summedLateHoursJSON = JSON.stringify(summedLateHoursArray);


    // Output the resulting JSON object
    console.log(summedLateHoursJSON);

    const combinedJSON = {
      averagedDiffHours: JSON.parse(averagedDiffHoursJSON),
      summedLateHours: JSON.parse(summedLateHoursJSON)
    };

    res.json(combinedJSON);

  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Retrieve all deliveries for a user
router.get('/Alldeliveries/user/:part', validationFn.validateToken, async (req, res) => {
  try {
    console.log("hello")
    var userid = req.body.id;
    console.log("decoded userid: " + userid)
    const deliveries = await deliveryController.retrieveAllDeliveriesForUser(userid);
    res.status(200).json(deliveries);
  } catch (error) {
    console.log("Error caught: " + error.message);
    res.status(404).json({ error: error.message });
  }
});



router.get('/listOfUserIds', validationFn.validateToken, async (req, res) => {
  try {
    const categories = await deliveryController.retrieveAllUserIds();
    res.json(categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/*Line 311*/ router.get('/allDeliveriesAllUsers', validationFn.validateToken, async (req, res) => {

  userIDStringEncode = req.query.userIDString;
  userIDStringArr = JSON.parse(decodeURIComponent(userIDStringEncode));

  console.log("Array of userIds is " + userIDStringArr)

  try {
    // Use Promise.all to concurrently retrieve deliveries for all users
    const allDeliveries = await Promise.all(
      userIDStringArr.map(async (userID) => {
        try {
          const deliveriesForUser = await deliveryController.retrieveAllDeliveriesForUser(userID);
          // Check if deliveriesForUser is not empty before adding to the result
          if (deliveriesForUser.length > 0) {
            return { userId: userID, deliveries: deliveriesForUser };
          } else {
            console.log(`No deliveries found for user ${userID}`);
            return null; // Skip this record
          }
        } catch (error) {
          console.error(`Error retrieving deliveries for user ${userID}:`, error);

          return { userId: userID, error: 'Error retrieving deliveries' };
        }
      })
    );

    res.json(allDeliveries);
  } catch (error) {
    console.error('Error retrieving deliveries for all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//4) Delete Controller

// Delete a Delivery by ID 
router.delete('/deliveries/:deliveryid', validationFn.validateToken, async (req, res) => {
  try {
    const deliveryid = req.params.deliveryid;

    // If the client side was not already using promise.all, this would be the way to go
    //await deliveryController.checkOrderCancelledFirst(deliveryid),
    //await deliveryController.removeDeliveryIDFromOrder(deliveryid)
    await deliveryController.deleteDelivery(deliveryid);

    console.log("Delete success")


    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/checkIfOrderCancelled/:deliveryid', validationFn.validateToken, async (req, res) => {
  const deliveryId = req.params.deliveryid;

  console.log("reached")
  try {

    await deliveryController.checkOrderCancelledFirst(deliveryId);

    console.log("order checked to be cancalled")
    res.status(200).json({ message: `Order is cancelled for Delivery with ID ${deliveryId}` });
  } catch (error) {
    if (error instanceof EMPTY_RESULT_ERROR) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

//Changing to null
router.post('/removeDeliveryIDFromOrder/:deliveryid', validationFn.validateToken, async (req, res) => {
  try {
    const { deliveryid } = req.params;
    const result = await deliveryController.removeDeliveryIDFromOrder(deliveryid);
    console.log("deliveryID removed from order")
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;