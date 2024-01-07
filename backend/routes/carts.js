// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

// CA2

const express = require("express");
const validateFn = require("../middlewares/validateToken");
const cartModel = require("../models/carts");
const productModel = require("../models/products");
const imageModel = require("../models/images");

const router = express.Router();

// to get cart data from database
router.get("/cart", validateFn.validateToken, (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  if (!id || isNaN(id) || !email || !role || role != "customer") {
    return res.status(403).json({ error: "Unauthorized Access" });
  }

  return cartModel.getCart(id).then((cart) => {
    let productDetailIDArr = []; // to store productdetailid in array
    cart.forEach((item) => {
      productDetailIDArr.push(item.productdetailid);
    });

    return productModel.getProductByProductDetailIDArr(productDetailIDArr).then((product) => {
      let productArr = product;
      let productIDArr = productArr.map((product) => product.productid);

      return Promise.all([productModel.getProductDetailByProductIDArr(productIDArr), imageModel.getImageByProductIDArr(productIDArr)]).then(([detail, image]) => {
        // storing all product details in product array
        detail.forEach((item) => {
          for (let i = 0; i < productArr.length; i++) {
            if (item.productid === productArr[i].productid) {
              // identifying the selected product detail
              let index = productDetailIDArr.findIndex((element) => element === item.productdetailid);
              if (index !== -1) {
                item.selected = true;
                // adding the cart quantity (user chosen)
                item.cartqty = cart[index].qty;
              }
              delete item.productid;
              if (productArr[i].detail) {
                productArr[i].detail.push(item);
              } else {
                productArr[i].detail = [item];
              }
              break;
            }
          }
        });

        // adding one image for each product
        for (let i = 0; i < productArr.length; i++) {
          for (let j = 0; j < image.length; j++) {
            if (image[j].productid === productArr[i].productid) {
              if (!productArr[i].url) {
                productArr[i].url = image[j].url;
                break;
              }
            }
          }
        }

        return res.status(200).json({ data: productArr });
      });
    });
  });
});

// for retrieving product data given by productdetailid from local storage
router.post("/cartProduct", (req, res) => {
  let cart = req.body.cart;

  // checking cart data provided from frontend before processing
  if (cart && cart.length > 0) {
    // to check whether cart includes necessary information (productdetailid, qty)
    const isValid = cart.every((item) => {
      return item.productdetailid && item.qty && !isNaN(item.productdetailid) && !isNaN(item.qty);
    });
    if (!isValid) {
      return res.status(400).json({ error: "Invalid Cart Data" });
    } else {
      // to remove duplicate productdetailid in cart
      let tempArr = [];
      cart.forEach((item) => {
        let condition = true;
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i].productdetailid === item.productdetailid) {
            tempArr[i].qty += item.qty;
            condition = false;
            break;
          }
        }
        if (condition) {
          tempArr.push(item);
        }
      });
      cart = tempArr;
    }
  } else {
    return res.status(400).json({ error: "Empty Cart" });
  }

  let productDetailIDArr = [];
  cart.forEach((item) => {
    productDetailIDArr.push(item.productdetailid);
  });

  console.log(productDetailIDArr);

  return productModel.getProductByProductDetailIDArr(productDetailIDArr).then((product) => {
    console.log(product);
    let productArr = product;
    let productIDArr = productArr.map((product) => product.productid);

    return Promise.all([productModel.getProductDetailByProductIDArr(productIDArr), imageModel.getImageByProductIDArr(productIDArr)]).then(([detail, image]) => {
      // storing all product details in product array
      detail.forEach((item) => {
        for (let i = 0; i < productArr.length; i++) {
          if (item.productid === productArr[i].productid) {
            // identifying the selected product detail
            let index = productDetailIDArr.findIndex((element) => element === item.productdetailid);
            if (index !== -1) {
              item.selected = true;
              // adding the cart quantity (user chosen)
              item.cartqty = cart[index].qty;
            }
            delete item.productid;
            if (productArr[i].detail) {
              productArr[i].detail.push(item);
            } else {
              productArr[i].detail = [item];
            }
            break;
          }
        }
      });

      // adding one image for each product
      for (let i = 0; i < productArr.length; i++) {
        for (let j = 0; j < image.length; j++) {
          if (image[j].productid === productArr[i].productid) {
            if (!productArr[i].url) {
              productArr[i].url = image[j].url;
              break;
            }
          }
        }
      }

      return res.status(200).json({ data: productArr });
    });
  });
});

module.exports = router;
