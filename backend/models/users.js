/* Name: Wai Yan Aung
Admin No: 2234993
Date: 2.11.2023
Description: Login Page  */

const bcrypt = require('bcrypt');
const { query } = require('../database');
const { EMPTY_RESULT_ERROR, SQL_ERROR_CODE } = require('../errors');
const cloudinary = require("../cloudinary");

module.exports.checkLogin = function checkLogin(loginEmail, loginPassword) {
    const sql = `
        SELECT u.email, u.userID, u.name, u.password, u.role, i.url FROM appuser u, image i 
        WHERE u.email = $1 
        AND i.imageid = u.imageid`;
    return query(sql, [loginEmail])
        .then(function (result) {
            const rows = result.rows;

            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`Email ${loginEmail} not found!`);
            }

            const retrievedPasswordHash = rows[0].password;

            return bcrypt.compare(loginPassword, retrievedPasswordHash)
                .then(function (isMatch) {
                    if (!isMatch) {
                        throw new Error('Incorrect password');
                    }

                    return rows[0];
                });
        });
};

module.exports.signup = function signup(name, email, password, phone, gender, address, region, role) {

    // Hash the password before storing it in the database
    return bcrypt.hash(password, 10)
        .then(function (hashedPassword) {
            const sql = `
            INSERT INTO appuser (createdat,name, email, password, phone, gender,address,region,role) VALUES (NOW(),$1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
            return query(sql, [name, email, hashedPassword, phone, gender, address, region,role])
                .catch(function (error) {
                    throw error;
                })
        });
};

module.exports.checkExistingUser = function checkExistingUser(email) {
    const sql = 'SELECT * FROM appuser WHERE email = $1';
    return query(sql, [email])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                return null;
            } else {
                return rows[0];
            }
        })
        .catch(function (error) {
            throw new Error('Error checking for existing user: ' + error.message);
        });
};

module.exports.getUserByAdmin = function getUserByAdmin(offset) {
    const sql = `
    SELECT a.userid, i.url, a.name, a.email, a.phone, a.address, a.region, a.createdat, a.updatedat
    FROM appuser a
    LEFT JOIN image i ON i.imageid = a.imageid
    WHERE a.role = 'customer'
    ORDER BY userid
    OFFSET $1
    `;

    return query(sql, [offset])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`User Not Found`);
            }
            return rows;
        })
}

function createUser(user) {
    const { name, email, password, phone, address, region, photo } = user;
  
    
    return cloudinary.uploader.upload(photo.path, { folder: 'user-photos' })
      .then((photoResult) => {
        const photoUrl = photoResult.secure_url;
  
        const sql = `
          INSERT INTO appuser (name, email, password, phone, address, region)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
  
        const values = [name, email, password, phone, address, region, photoUrl];
  
        return pool.query(sql, values)
          .then(result => {
            const newUser = result.rows[0];
            return newUser;
          })
          .catch(error => {
            console.error('Error creating user:', error);
            throw error;
          });
      })
      .catch(uploadError => {
        console.error('Error uploading photo to Cloudinary:', uploadError);
        throw uploadError;
      });
  }

module.exports.deleteUser = function deleteUser(userid) {
    const sql = 'DELETE FROM appuser WHERE userid = $1 RETURNING *'; 

    return query(sql, [userid])
        .then(result => {
            const deletedUser = result.rows[0];

            if (!deletedUser) {
                throw new EMPTY_RESULT_ERROR('User not found');
            }

            return deletedUser;
        });
};

module.exports.updateUserImage = function updateUserImage(imageid, email) {
    const sql = `
        UPDATE appuser SET imageid = $1 WHERE email = $2
    `;

    return query(sql, [imageid, email])
    .then((result) => {
        const rows = result.rowCount;
        if(rows === 0) {
            throw new EMPTY_RESULT_ERROR(`User Image Update Failed`);
        }
        return rows;
    })
}

module.exports.getTotalUserByAdmin = function getUserByAdmin(startDate, endDate) {
    const sql = `
        SELECT COUNT(userid) 
        FROM appuser 
        WHERE createdat >= $1 AND createdat <= $2::timestamp + interval '1 day';
    `;

    return query(sql, [startDate, endDate])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`There is no user in the database`);
            }
            return rows;
        });
}

module.exports.getUserCreationData = function getUserCreationData(startDate, endDate) {
    const sql = `
        SELECT
            TO_CHAR(createdat, 'YYYY-MM-DD') AS creation_day,
            COUNT(userid) AS user_count
        FROM
            appuser
        WHERE
            createdat >= $1 AND createdat <= $2::timestamp + interval '1 day'
        GROUP BY
            creation_day
        ORDER BY
            creation_day;
    `;

    return query(sql, [startDate, endDate])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new EMPTY_RESULT_ERROR(`No user creation data available for the specified date range`);
            }
            return rows;
        });
};

module.exports.getGenderStatistics = function(callback) {
    const sqlMale = `SELECT COUNT(*) as gender FROM appuser WHERE gender = 'M'`;
  
    query(sqlMale, [], (error, maleResults) => {
      if (error) {
        return callback(error, null);
      }
  
      const maleCount = maleResults.rows[0].gender;
  
      // Perform another query for female count
      const sqlFemale = `SELECT COUNT(*) as gender FROM appuser WHERE gender = 'F'`;
  
      query(sqlFemale, [], (error, femaleResults) => {
        if (error) {
          return callback(error, null);
        }
  
        const femaleCount = femaleResults.rows[0].gender;
  
        const statistics = {
          male: maleCount,
          female: femaleCount,
        };
  
        callback(null, statistics);
      });
    });
  };


// Name: Zay Yar Tun

module.exports.getUserAddressByIdEmail = function getUserAddressByIdEmail(userID, email) {
    const sql = `
        SELECT address FROM AppUser WHERE userID = $1 AND email = $2
    `;

    return query(sql, [userID, email])
        .then(function (result) {
            const rows = result.rows;
            if (rows.length === 0) {
                throw new Error('User Not Found');
            }
            return rows[0];
        })
        .catch(function (error) {
            console.error(error);
            throw new Error('Unknown Error');
        })
}

// Name: Zay Yar Tun