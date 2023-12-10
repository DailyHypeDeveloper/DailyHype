const cloudinary = require("../cloudinary");
const { query } = require("../database");
const { EMPTY_RESULT_ERROR } = require("../errors");

// this is an example of how to upload image to cloudinary, refer to ESDE cloudinary codes
// function uploadFile(file) {
//     cloudinary.uploader.upload(file.path, { upload_preset: 'upload_to_design' })
//         .then((result) => {
//             let data = { imageURL: result.url, publicId: result.public_id, status: 'success' };
//         })
//         .catch((error) => {
//             console.error(error);
//         })
// }

module.exports.createImage = function createImage(imageid, imagename, url) {
  const sql = `
        INSERT INTO image (imageid, imagename, url) VALUES ($1, $2, $3);
    `;

  return query(sql, [imageid, imagename, url])
    .then(function (result) {
      const rows = result.rowCount;
      if (rows === 0) {
        throw new EMPTY_RESULT_ERROR(`Image Insert Failed`);
      }
      return rows;
    })
    .catch(function (error) {
      console.error(error);
      throw error;
    });
};

module.exports.uploadCloudinaryPhoto = function uploadCloudinaryPhoto(email, file) {
  return cloudinary.uploader
    .upload("./public/user/js/uploads/" + file.originalname, { folder: "Design" })
    .then((result) => {
      if (result && result.public_id && result.url && result.original_filename) {
        return result;
      } else {
        throw new Error(`Image Upload Failed`);
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

module.exports.uploadCloudinaryPhotos = function uploadCloudinaryPhotos(file) {
  return cloudinary.uploader
    .upload("./public/admin/js/uploads/" + file.originalname, { folder: "Design" })
    .then((result) => {
      if (result && result.public_id && result.url && result.original_filename) {
        return result;
      } else {
        throw new Error(`Image Upload Failed`);
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

module.exports.createProductImage = function createProductImage(imageid, imagename, url) {

  const sql = `
        INSERT INTO image (imageid, imagename, url) VALUES ($1, $2, $3);
    `;

  return query(sql, [imageid, imagename, url])
    .then(function (result) {
      const rows = result.rowCount;
      if (rows === 0) {
        throw new EMPTY_RESULT_ERROR(`Image Insert Failed`);
      }
      return imageid;
    })
    .catch(function (error) {
      console.error(error);
      throw error;
    });
};
module.exports.getImageIDByProductID = function getImageIDByProductID(productid) {
  const sql = `
    SELECT DISTINCT i.imageid
    FROM Image i, ProductImage pi
    WHERE i.imageid = pi.imageid
    AND pi.productid = $1
  `;

  return query(sql, [productid])
    .then((result) => {
      const rows = result.rows;
      return rows[0];
    })
}

module.exports.deleteProductImage = function deleteProductImage(productid) {
  const sql = `
  DELETE FROM ProductImage WHERE productid = $1
`;

  return query(sql, [productid]).then((result) => {
    const rows = result.rowCount;
    if (rows.length === 0) {
      throw new EMPTY_RESULT_ERROR(`Image Delete Failed`);
    }
    return rows;
  });
}

module.exports.deleteCloudinaryImage = function deleteCloudinaryImage(public_id) {
  return cloudinary.uploader
    .destroy(public_id)
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

module.exports.deleteUserImage = function deleteUserImage(imageid) {
  const sql = `
        DELETE FROM Image WHERE imageid = $1
    `;

  return query(sql, [imageid]).then((result) => {
    const rows = result.rowCount;
    if (rows.length === 0) {
      throw new EMPTY_RESULT_ERROR(`Image Delete Failed`);
    }
    return rows;
  });
};

module.exports.getImageIDByProductID = function getImageIDByProductID(productid) {
  const sql = `
    SELECT DISTINCT i.imageid
    FROM Image i, ProductImage pi
    WHERE i.imageid = pi.imageid
    AND pi.productid = $1
  `;

  return query(sql, [productid])
    .then((result) => {
      const rows = result.rows;
      return rows[0];
    })
}

module.exports.deleteProductImage = function deleteProductImage(productid) {
  const sql = `
  DELETE FROM ProductImage WHERE productid = $1
`;

  return query(sql, [productid]).then((result) => {
    const rows = result.rowCount;
    if (rows.length === 0) {
      throw new EMPTY_RESULT_ERROR(`Image Delete Failed`);
    }
    return rows;
  });
}