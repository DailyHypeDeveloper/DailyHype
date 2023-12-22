//Name: Thu Htet San
//Admin No: 2235022
//Class: DIT/FT/2B/02
//Date: 16.11.2023
//Description: functions related to product management, such as creating, updating, and deleting product records in the database

const { query } = require("../database"); // Import database connection/query execution function
const { DUPLICATE_ENTRY_ERROR, EMPTY_RESULT_ERROR, SQL_ERROR_CODE, TABLE_ALREADY_EXISTS_ERROR } = require("../errors");

//get the total number of products
module.exports.getTotalProductCount = function getTotalProductCount() {
  const sql = `SELECT COUNT(*) AS total FROM product;`;

  return query(sql)
    .then((result) => {
      //console.log(result.rows[0].total);
      return result.rows[0].total;
    })
    .catch((error) => {
      throw new Error(`Error retrieving total product count: ${error.message}`);
    });
};

// Function to get category ID
module.exports.getCategoryID = function getCategoryID(categoryName) {
  const sql = "SELECT categoryID FROM Category WHERE categoryName = $1";
  return query(sql, [categoryName])
    .then((result) => {
      console.log(result);
      return result.rows.length > 0 ? result.rows[0].categoryid : null;
    })
    .catch((error) => {
      console.error("Error getting category ID:", error.message);
      throw new Error(`Error getting category ID: ${error.message}`);
    });
};

// Function to get colour ID
module.exports.getColourID = function getColourID(colourName) {
  const sql = "SELECT colourID, name FROM Colour WHERE name = $1";
  return query(sql, [colourName])
    .then((result) => (result.rows.length > 0 ? result.rows[0] : null))
    .catch((error) => {
      console.error("Error getting colour ID:", error.message);
      throw new Error(`Error getting colour ID: ${error.message}`);
    });
};

// Function to get size ID
module.exports.getSizeID = function getSizeID(sizeName) {
  const sql = "SELECT sizeID, name FROM Size WHERE name = $1";
  return query(sql, [sizeName])
    .then((result) => (result.rows.length > 0 ? result.rows[0] : null))
    .catch((error) => {
      console.error("Error getting size ID:", error.message);
      throw new Error(`Error getting size ID: ${error.message}`);
    });
};

// Function to create a product and return its ID
module.exports.createProductAndGetID = function createProductAndGetID(product) {
  const { productName, description, unitPrice, categoryID } = product;
  const sql = `
        INSERT INTO Product (productName, description, unitPrice, categoryID, createdAt, updatedAt)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING productID;`;

  return query(sql, [productName, description, unitPrice, categoryID])
    .then((result) => {
      const insertedProductID = result.rows[0].productid;
      console.log("Product inserted successfully. Product ID:", insertedProductID);
      return insertedProductID;
    })
    .catch((error) => {
      console.error("Error creating product:", error.message);
      throw new Error(`Error creating product: ${error.message}`);
    });
};

// Function to create product details
module.exports.createProductDetail = function createProductDetail(productID, colour, size, qty, productStatus) {
  const sql = `
            INSERT INTO productDetail(productID, colourID, sizeID, qty, productStatus, createdAt, updatedAt)
            VALUES($1, $2, $3, $4, $5, NOW(), NOW());`;

  return query(sql, [productID, colour, size, qty, productStatus])
    .then(() => console.log("Product detail inserted successfully"))
    .catch((error) => {
      console.error("Error creating product detail:", error.message);
      throw new Error(`Error creating product detail: ${error.message}`);
    });
};

//get products by limits
module.exports.getProductsByLimit = function getProductsByLimit(offset, limit) {
  const sql = `SELECT P.productid, P.productname, P.rating, P.unitprice, ARRAY_AGG(I.url ORDER BY I.imageID) AS urls, p.description, c.categoryname
  FROM
    product P
    LEFT JOIN productimage PI ON P.productID = PI.productID
    LEFT JOIN image I ON PI.imageID = I.imageID
    JOIN Category c ON c.categoryid = p.categoryid
  GROUP BY P.productid, P.productname, P.rating, P.unitprice, c.categoryname, p.description
  ORDER BY P.productid DESC
  LIMIT $1 OFFSET $2;`;
  return query(sql, [limit, offset])
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw new Error(`Error retrieving products: ${error.message}`);
    });
};

module.exports.getProductByProductID = function getProductByProductID(productid) {
  const sql = `
    SELECT P.productid, P.productname, P.rating, P.unitprice, ARRAY_AGG(I.url ORDER BY I.imageID) AS urls, p.description, c.categoryname, c.categoryid
    FROM
      product P
      LEFT JOIN productimage PI ON P.productID = PI.productID
      LEFT JOIN image I ON PI.imageID = I.imageID
      JOIN Category c ON c.categoryid = p.categoryid
      WHERE P.productid=$1
    GROUP BY P.productid, P.productname, P.rating, P.unitprice, c.categoryname, p.description, c.categoryid
    ORDER BY P.productid DESC`;

  return query(sql, [productid]).then((result) => {
    const rows = result.rows;
    return rows[0];
  });
};

module.exports.getProductDetailWithoutImageByProductID = function getProductDetailWithoutImageByProductID(productid) {
  const sql = `
        SELECT pd.productdetailid, s.name AS Size, c.name AS colour, pd.qty, pd.productstatus
        FROM ProductDetail pd
        JOIN Colour c ON c.colourid = pd.colourid
        JOIN Size s ON s.sizeid = pd.sizeid
        WHERE pd.productid = $1
    `;

  return query(sql, [productid]).then((result) => {
    const rows = result.rows;
    return rows;
  });
};

//get product by productID
module.exports.getProductDetailByproductID = function getProductDetailByID(productID) {
  const sql = `SELECT P.productName, P.unitprice, P.description, ARRAY_AGG(I.url ORDER BY I.imageID) AS urls, C.name AS "colour", S.name AS "size", PD.qty, PD.productStatus, PD.productdetailid
    FROM product P, productdetail PD, size S, colour C, productimage PI, image I
    WHERE
        P.productID = PD.productID
        AND PD.sizeID = S.sizeID
        AND PD.colourID = C.colourID
        AND P.productID = PI.productID
        AND PI.imageID = I.imageID
        AND P.productID = $1
    GROUP BY
        P.productName, P.unitprice, P.description, C.name, S.name, PD.qty, PD.productStatus, PD.productdetailid
    ;
    `;

  //     const sql=`SELECT P.productName, P.unitprice, P.description, ARRAY_AGG(I.url) AS urls, C.name AS "colour",S.name AS "size", PD.qty, PD.productStatus
  // FROM product P
  // JOIN productdetail PD ON P.productID = PD.productID
  // JOIN size S ON PD.sizeID = S.sizeID
  // JOIN colour C ON PD.colourID = C.colourID
  // JOIN productimage PI ON P.productID = PI.productID
  // JOIN image I ON PI.imageID = I.imageID
  // WHERE P.productID = 1
  // GROUP BY P.productName, P.unitprice, P.description, C.name, S.name, PD.qty, PD.productStatus;`;

  return query(sql, [productID])
    .then(function (result) {
      return result.rows;
    })
    .catch(function (error) {
      throw new Error(`Error retrieving product details: ${error.message}`);
    });
};

//get categories
module.exports.getCategories = function getCategories() {
  const sql = `SELECT categoryid, categoryname FROM category`;
  return query(sql)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw new Error(`Error retrieving categories: ${error.message}`);
    });
};

//get colors
module.exports.getColours = function getColours() {
  const sql = `SELECT colourid, name FROM colour`;
  return query(sql)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw new Error(`Error retrieving colours: ${error.message}`);
    });
};

//get sizes
module.exports.getSizes = function getSizes() {
  const sql = `SELECT sizeid, name FROM size`;
  return query(sql)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw new Error(`Error retrieving sizes: ${error.message}`);
    });
};

//delete

module.exports.deleteProduct = function deleteProduct(productid) {
  const sql = `
        DELETE FROM Product WHERE productid = $1
    `;

  return query(sql, [productid]).then((result) => {
    const rows = result.rowCount;
    if (rows.length === 0) {
      throw new EMPTY_RESULT_ERROR(`Product Not Found`);
    }
    return rows;
  });
};

module.exports.updateProduct = function updateProduct(productid, product) {
  const sql = `
        UPDATE Product 
        SET productname = $1, description = $2, unitprice = $3, categoryid = $4
        WHERE productid = $5
    `;

  return query(sql, [product.productName, product.description, product.unitPrice, product.categoryId, productid])
    .then((result) => {
      const rows = result.rowCount;
      if (rows === 0) {
        throw new EMPTY_RESULT_ERROR(`Product Not Found`);
      }
      return rows;
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      throw error;
    });
};

module.exports.updateProductDetailQty = function updateProductDetailQty(productdetailid, qty) {
  const sql = `
        UPDATE ProductDetail SET qty = $1 WHERE productdetailid = $2
    `;

  return query(sql, [qty, productdetailid]).then((result) => {
    const rows = result.rowCount;
    if (rows === 0) {
      throw new EMPTY_RESULT_ERROR(`Product Detail Not Found`);
    }
    return rows;
  });
};

module.exports.deleteProductDetail = function deleteProductDetail(productid) {
  const sql = `
        DELETE FROM ProductDetail WHERE productid = $1
    `;

  return query(sql, [productid]).then((result) => {
    const rows = result.rowCount;
    return rows;
  });
};

module.exports.deleteProductDetailByID = function deleteProductDetailByID(productdetailid) {
  const sql = `
        DELETE FROM ProductDetail WHERE productdetailid = $1
    `;

  return query(sql, [productdetailid]).then((result) => {
    const rows = result.rowCount;
    return rows;
  });
};

module.exports.createProductImage = function createProductImage(productId, imageId) {
  const sql = `
        INSERT INTO ProductImage(productid, imageid) VALUES($1,$2);
    `;
  return query(sql, [productId, imageId]).then((result) => {
    const rows = result.rowCount;
    return rows;
  });
};

module.exports.generateStats = function generateStats() {
  const sql = `
        SELECT c.categoryname, COUNT(p.*) AS count
        FROM Product p
        JOIN Category c ON c.categoryid = p.categoryid
        GROUP BY c.categoryname
    `;

  return query(sql, []).then((result) => {
    const rows = result.rows;
    return rows;
  });
};

//CA2
//get side bar categories by typeid
module.exports.getCategoriesByType = function getCategoriesByType(typeid) {
  const sql = `SELECT DISTINCT c.* FROM product p, category c WHERE p.categoryid=c.categoryid AND typeid=$1`;
  //result: categoryid, categoryname, createdat, updatedat
  return query(sql, [typeid])
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw new Error(`Error retrieving categories by typeid: ${error.message}`);
    });
};
//CA2-end

// Name: Zay Yar Tun

module.exports.getProductIDByOrderID = function getProductIDByOrderID(orderid) {
  const sql = `
        SELECT DISTINCT p.productid, poi.qty
        FROM Product p, ProductDetail pd, ProductOrderItem poi
        WHERE p.productid = pd.productid
        AND pd.productdetailid = poi.productdetailid
        AND poi.orderid = $1
    `;

  return query(sql, [orderid]).then(function (result) {
    const rows = result.rows;
    return rows;
  });
};

module.exports.increaseSoldQty = function increaseSoldQty(qty, productid) {
  const sql = `
        UPDATE Product SET soldqty = soldqty + $1 WHERE productid = $2
    `;

  return query(sql, [qty, productid]).then(function (result) {
    return result.rowCount;
  });
};

module.exports.getProductImageByProductIDArr = function getProductImageByProductIDArr(productIDArr) {
  const sql = `
        SELECT i.url, p.productid
        FROM Image i, ProductImage pi, Product p
        WHERE i.imageid = pi.imageid
        AND pi.productid = p.productid
        AND p.productid IN (SELECT UNNEST($1::int[]))
    `;

  return query(sql, [productIDArr]).then(function (result) {
    return result.rows;
  });
};

module.exports.updateProductStatus = function updateProductStatus(productDetailID) {
  const sql = `
        UPDATE ProductDetail SET productstatus = 
        CASE
            WHEN qty > 0 THEN 'in stock'
            ELSE 'out of stock'
        END
        WHERE productdetailid = $1
    `;

  return query(sql, [productDetailID]).then(function (result) {
    return result.rowCount;
  });
};

// this is to get productdetails data by an array of id
// this will contain all product data except image
module.exports.getProductDetailByIds = function getProductDetailByIds(productDetailIDArr) {
  const sql = `
        SELECT PD.productDetailID, PD.qty, P.productName, P.unitPrice, S.name AS Size, C.name AS Colour, P.productid
        FROM ProductDetail PD, Product P, Colour C, Size S
        WHERE P.productID = PD.productID
        AND C.colourID = PD.colourID
        AND S.sizeID = PD.sizeID
        AND PD.productDetailID IN (SELECT UNNEST($1::int[]))
    `;

  return query(sql, [productDetailIDArr]).then(function (result) {
    return result.rows;
  });
};

module.exports.getProductQtyPriceByIds = function getProductQtyPriceByIds(productDetailIDArr) {
  const sql = `
        SELECT P.unitPrice, PD.qty, PD.productDetailID
        FROM ProductDetail PD, Product P
        WHERE P.productID = PD.productID
        AND PD.productDetailID IN (SELECT UNNEST($1::int[]))
    `;

  return query(sql, [productDetailIDArr]).then(function (result) {
    return result.rows;
  });
};

module.exports.increaseProductQtyById = function increaseProductQtyById(qty, productdetailid) {
  const sql = `
        UPDATE ProductDetail SET qty = qty + $1 WHERE productdetailid = $2;
    `;

  return query(sql, [qty, productdetailid])
    .then(function (result) {
      return result.rowCount;
    })
    .catch(function (error) {
      console.error(error);
      throw error;
    });
};

module.exports.reduceProductQtyById = function reduceProductQtyById(qty, productdetailid) {
  const sql = `
        UPDATE ProductDetail SET qty = qty - $1 WHERE productdetailid = $2;
    `;

  return query(sql, [qty, productdetailid])
    .then(function (result) {
      return result.rowCount;
    })
    .catch(function (error) {
      console.error(error);
      throw error;
    });
};

module.exports.getDistinctProduct = function getDistinctProduct() {
  const sql = `
        SELECT productname, productid FROM product ORDER BY productid
    `;

  return query(sql, []).then(function (result) {
    return result.rows;
  });
};

module.exports.getDistinctCategory = function getDistinctCategory() {
  const sql = `
        SELECT categoryname, categoryid FROM category ORDER BY categoryid
    `;

  return query(sql, []).then(function (result) {
    return result.rows;
  });
};

module.exports.getLatestProducts = function getLatestProducts(limit) {
  const sql = `
        SELECT i.url, p.productname, p.productid, p.description, p.unitprice, p.rating
        FROM Product p, ProductImage pi, Image i
        WHERE p.productid = pi.productid
        AND pi.imageid = i.imageid
        ORDER BY p.createdat DESC
        LIMIT $1
    `;

  return query(sql, [limit]).then((result) => {
    return result.rows;
  });
};
// Name: Zay Yar Tun
