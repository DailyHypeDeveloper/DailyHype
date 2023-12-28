//Name: Thu Htet San
//Admin No: 2235022
//Class: DIT/FT/2B/02
//Date: 16.11.2023
//Description: router for products

const bodyParser = require("body-parser");
const express = require("express");
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR, TABLE_ALREADY_EXISTS_ERROR } = require("../errors");
const productsModel = require("../models/products");
const imageModel = require("../models/images");
const validationFn = require("../middlewares/validateToken");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../cloudinary");

router.get("/productStat", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  return productsModel
    .generateStats()
    .then((stats) => {
      return res.json({ stat: stats });
    })
    .catch((error) => {
      res.status(500).json({ error: "Unknown Error" });
    });
});

//get the total count of products for admin
router.get("/productsCountAdmin", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  return productsModel
    .getTotalProductCount()
    .then((count) => {
      return res.json({ count: count });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

//get products for admin by limit
router.get("/productsAdmin", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const offset = req.query.offset;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  if (!offset || isNaN(offset)) {
    offset = 0;
  }

  return productsModel
    .getProductsByLimit(offset, 10)
    .then(function (product) {
      return res.json({ product: product });
    })
    .catch(function (error) {
      console.error(error);
      if (error instanceof EMPTY_RESULT_ERROR) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Unknown Error" });
    });
});

router.use(bodyParser.json());
//image upload part
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/admin/js/uploads/"); // Set the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Set the file name
  },
});
const upload = multer({ storage: storage });

//uplaod image to cloudinary and create product image
router.post("/uploadProductPhoto", validationFn.validateToken, upload.single("photo"), (req, res) => {
  const file = req.file;

  console.log("Received photo upload request:", { file });

  if (!file) {
    console.error("No file provided");
    return res.status(400).json({ error: "No file provided" });
  }
  return imageModel
    .uploadCloudinaryPhotos(file)
    .then((result) => {
      var inputString = result.public_id;
      var imageId = inputString.split("/")[1];
      return imageModel
        .createProductImage(imageId, result.original_filename, result.url)
        .then((result1) => {
          console.log("IMAGE FINAL");
          console.log(result1);
          return res.json({ public_id: result1 });
        })
        .catch((error) => {
          console.error("Error:", error);
          return res.status(500).send("Internal Server Error");
        });
    })
    .catch((error) => {
      console.error("Error:", error);
      return res.status(500).send("Internal Server Error");
    });
});

router.post("/createProductImage", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const { productId, imageId } = req.body;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }
  console.log(req.body);
  productsModel
    .createProductImage(productId, imageId)
    .then((result) => {
      // Handle the result if needed
      return res.json({ message: "Insert Success" });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/products", function (req, res) {
  const page = req.query.page || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Wait for both promises to resolve
  return Promise.all([productsModel.getTotalProductCount(), productsModel.getProductsByLimit(offset, limit)])
    .then(([total, products]) => {
      const totalPages = Math.ceil(total / limit);

      return res.json({
        products: products,
        totalPages: totalPages,
      });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

router.get("/productDetailAdmin/:productid", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const productid = req.params.productid;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  return Promise.all([productsModel.getProductDetailWithoutImageByProductID(productid), productsModel.getProductByProductID(productid)])
    .then(([productdetail, product]) => {
      return res.json({ product: product, productdetail: productdetail });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

//get product detail by product id
router.get("/productDetail/:productID", function (req, res) {
  const productID = req.params.productID;
  return productsModel
    .getProductDetailByproductID(productID)
    .then(function (productDetail) {
      return res.json({ productDetail: productDetail });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});
//get product by product id
router.get("/productAdmin/:productID", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const productID = req.params.productID;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }
  return productsModel
    .getProductByProductID(productID)
    .then(function (product) {
      return res.json({ product: product });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

//get categories
router.get("/categories", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }
  return productsModel
    .getCategories()
    .then(function (categories) {
      return res.json({ categories: categories });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

//get colours
router.get("/colours", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }
  return productsModel
    .getColours()
    .then(function (colours) {
      return res.json({ colours: colours });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

//get sizes
router.get("/sizes", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }
  return productsModel
    .getSizes()
    .then(function (sizes) {
      return res.json({ sizes: sizes });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

// create a new product
router.post("/productAdmin", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  const { Name, Description, unitPrice, Category, Color } = req.body;

  const resultArray = [];

  console.log("INSIDE ROUTER");
  console.log(Category);
  console.log(Color);

  // Validate and process the product data
  if (!Name || !Description || !unitPrice || !Category || !Color || !Object.keys(Color).length || Object.values(Color).some((colorData) => !Object.keys(colorData).some((size) => colorData[size]))) {
    return res.status(400).json({ error: { Name, Description, unitPrice, Category, Color } });
  }

  for (const color in Color) {
    const sizes = Color[color];
    for (const size in sizes) {
      const quantity = sizes[size];
      resultArray.push({ color, size, quantity });
    }
  }

  console.log(resultArray);

  // Call the model function to get category ID
  return productsModel
    .getCategoryID(Category)
    .then(function (categoryID) {
      console.log(categoryID);
      // Call the model function to create the product
      return productsModel
        .createProductAndGetID({ productName: Name, description: Description, unitPrice, categoryID })
        .then(function (productID) {
          console.log(productID);

          const selectColour = [];
          const selectSize = [];

          resultArray.forEach((item) => {
            selectColour.push(productsModel.getColourID(item.color));
            selectSize.push(productsModel.getSizeID(item.size));
          });

          return Promise.all(selectColour).then((result) => {
            console.log("GETTING COLOUR");
            console.log(result);
            resultArray.forEach((item) => {
              for (let i = 0; i < result.length; i++) {
                if (item.color === result[i].name) {
                  item.color = result[i].colourid;
                }
              }
            });
            return Promise.all(selectSize).then((result) => {
              resultArray.forEach((item) => {
                for (let i = 0; i < result.length; i++) {
                  if (item.size === result[i].name) {
                    item.size = result[i].sizeid;
                  }
                }
              });
              console.log(resultArray);
              const insertProductDetail = [];
              resultArray.forEach((item) => {
                insertProductDetail.push(productsModel.createProductDetail(productID, item.color, item.size, item.quantity, "In Stock"));
              });

              return Promise.all(insertProductDetail)
                .then((result) => {
                  res.json({ message: "Product submitted successfully", productID: productID });
                })
                .catch((error) => {
                  console.error(error);
                  throw error;
                });
            });
          });
        })
        .catch(function (error) {
          console.error(error);
          res.status(500).json({ error: "Unknown Error of sequential" });
        });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ error: "Unknown Error final" });
    });
});

router.put("/productAdmin/:productid", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const productid = req.params.productid;
  const product = req.body.product;
  console.log(req.body);
  console.log(productid);
  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  if (!productid || isNaN(productid)) {
    return res.status(400).send({ error: "Invalid Product ID" });
  }

  if (!product) {
    return res.status(400).send({ error: "Invalid Data" });
  }

  return productsModel
    .updateProduct(productid, product)
    .then((count) => {
      if (count === 1) {
        return res.json({ message: "Update Success" });
      } else {
        throw new Error(`Product Not Found`);
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

router.put("/productDetailAdmin/:productdetailid/:qty", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const productdetailid = req.params.productdetailid;
  const qty = req.params.qty;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  if (!productdetailid || isNaN(productdetailid)) {
    return res.status(400).send({ error: "Invalid Product Detail ID" });
  }

  if (!qty || isNaN(qty)) {
    return res.status(400).send({ error: "Invalid Quantity" });
  }

  return productsModel
    .updateProductDetailQty(productdetailid, qty)
    .then((count) => {
      if (count === 1) {
        return productsModel.updateProductStatus(productdetailid).then(() => {
          return res.json({ message: "Update Success" });
        });
      } else {
        throw new Error(`Product Detail Not Found`);
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

router.delete("/deleteProduct", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const productid = req.query.id;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  return Promise.all([productsModel.deleteProductDetail(productid), imageModel.getImageIDByProductID(productid)])
    .then(([deleteCount, imageResult]) => {
      console.log(deleteCount);
      console.log(imageResult);
      return Promise.all([productsModel.deleteProduct(productid), imageModel.deleteProductImage(productid)]).then(([deleteCount2, count]) => {
        console.log(deleteCount2);
        console.log(count);
        if (imageResult && imageResult.imageid) {
          return imageModel.deleteImage(imageResult.imageid).then(() => {
            return res.status(201).json({ message: "Delete Success" });
          });
        } else {
          return res.status(201).json({ message: "Delete Success" });
        }
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

router.delete("/deleteProductDetail", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;
  const productdetailid = req.query.id;

  // checking whether the user token is valid
  if (!id || isNaN(id) || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  return productsModel
    .deleteProductDetailByID(productdetailid)
    .then((count) => {
      return res.status(201).json({ message: "Delete Success" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

//CA2
//get side bar categories by typeid
router.get('/categories/:typeid', function (req, res) {
    const typeid = req.params.typeid;
    console.log("typeid", typeid);
    if (!typeid || isNaN(typeid)) {
        return res.status(400).json({ error: "Invalid Type ID" });
    }
    return productsModel.getCategoriesByType(typeid)
        .then((category) => {
            return res.json({ category: category })
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: "Unknown Error" })
        })
})

//2.
//get products by categoryid, offset, litmit, isinstock
router.get('/productsByCategory', function (req, res) {
    const { categoryid, limit, offset, isinstock } = req.query;
    
    if (!categoryid || isNaN(categoryid) ||
        !limit || isNaN(limit) || limit < 2 || limit > 100 ||
        !offset || isNaN(offset) || offset < 0 ||
        isinstock !== '0' && isinstock !== '1') {
        return res.status(400).json({ error: "Invalid Request" });
    }
    return productsModel.getProductsByCategoryID(categoryid, limit, offset, isinstock)
        .then((product) => {
            return res.json({ product: product });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: "Unknown Error" })
        })
})
//3.
//get productcount by categoryid and isinstock
router.get('/productsCountByCategory', function (req, res) {
    const { categoryid, isinstock } = req.query;

    if (!categoryid || isNaN(categoryid) ||
        isinstock !== '0' && isinstock !== '1') {
        return res.status(400).json({ error: "Invalid Request" });
    }
    return productsModel.getProductCountByCategoryID(categoryid, isinstock)
        .then((productCount) => {
            return res.json({ productCount: productCount[0].productcount  });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: "Unknown Error" })
        })
})

//4.
//get image by productid
router.get('/productImage/:productid', function (req, res) {
    const { productid } = req.params;

    if (!productid || isNaN(productid)) {
        return res.status(400).json({ error: "Invalid Product ID" });
    }

    return productsModel.getImageByProductID(productid)
        .then((image) => {
            return res.json({ image: image  });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: "Unknown Error" })
        })
})
//5.
//get colours by productid
router.get('/productColour/:productid', function (req, res) {
    const { productid } = req.params;

    if (!productid || isNaN(productid)) {
        return res.status(400).json({ error: "Invalid Product ID" });
    }

    return productsModel.getColourByProductID(productid)
        .then((colour) => {
            return res.json({ colour: colour  });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({ error: "Unknown Error" })
        })
})
//CA2-end

// Name: Zay Yar Tun
// checking product information in shopping cart

router.get("/distinctproduct", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const role = req.body.role;
  const email = req.body.email;

  if (!id || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  return productsModel
    .getDistinctProduct()
    .then((product) => {
      return res.json({ product: product });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Unknown Error" });
    });
});

router.get("/distinctcategory", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const role = req.body.role;
  const email = req.body.email;

  if (!id || !role || !email || role != "admin") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  return productsModel
    .getDistinctCategory()
    .then((category) => {
      return res.json({ category: category });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Unknown Error" });
    });
});

router.get("/latestproduct/:limit", function (req, res) {
  const limit = req.params.limit;
  if (!limit || isNaN(limit)) {
    limit = 10;
  }

  return productsModel
    .getLatestProducts(limit)
    .then((product) => {
      const productData = [];
      product.forEach((item) => {
        let condition = true;
        for (let i = 0; i < productData.length; i++) {
          if (item.productid === productData[i].productid) {
            condition = false;
            break;
          }
        }
        if (condition) {
            productData.push(item);
        }
      });
      return res.json({ product: productData });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Unknown Error" });
    });
});

router.get("/productDetailForCart", validationFn.validateToken, function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const role = req.body.role;

  if (!id || isNaN(id) || !email || !role || role != "customer") {
    return res.status(403).send({ error: "Unauthorized Access" });
  }

  const productDetailIDArr = req.query.productDetailID;
  const productDetailID = productDetailIDArr.split(",").map(Number);
  return productsModel
    .getProductDetailByIds(productDetailID)
    .then(function (productDetail) {
      const productIDArr = [];

      productDetail.forEach((item) => {
        if (!productIDArr.includes(item.productid)) {
          productIDArr.push(item.productid);
        }
      });
      return productsModel.getProductImageByProductIDArr(productIDArr).then((productImages) => {
        for (let i = 0; i < productDetail.length; i++) {
          for (let j = 0; j < productImages.length; j++) {
            if (productDetail[i].productid === productImages[j].productid) {
              productDetail[i].image = productImages[j].url;
              break;
            }
          }
        }
        return res.json({ productDetail: productDetail });
      });
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});
// Name: Zay Yar Tun

module.exports = router;
