/* Name: Wai Yan Aung
Admin No: 2234993
Date: 2.11.2023
Description: Login Page  */

const express = require("express");

const router = express.Router();
const multer = require("multer");
const cookieFunctions = require("../functions/cookies");
const userModel = require("../models/users");
const validationFn = require("../middlewares/validateToken");
const { EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR } = require("../errors");
const cloudinary = require("../cloudinary");
const jwtFunctions = require("../functions/jwt-token");
const mailFunctions = require("../functions/send-mail");

router.post("/login", function (req, res) {
  const { email, password } = req.body;
  return userModel
    .checkLogin(email, password)
    .then(function (user) {
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
      } else {
        delete user.password;
        // console.log(user);
        const authToken = jwtFunctions.generateAuthToken({ email: user.email, userId: user.userid, role: user.role }, process.env.JWT_SECRET_KEY);
        const refreshToken = jwtFunctions.generateRefreshToken({ lastcreatedat: new Date().toISOString() }, process.env.JWT_REFRESH_KEY);
        return userModel.storeRefreshToken(user.userid, refreshToken).then((result) => {
          cookieFunctions.setHttpOnlyCookieHeader("authToken", authToken, res);
          return res.status(200).json({ user: user });
        });
      }
    })
    .catch(function (error) {
      console.error(error);
      if (error instanceof EMPTY_RESULT_ERROR) {
        return res.status(401).json({ error: "User not found" });
      } else if (error instanceof DUPLICATE_ENTRY_ERROR) {
        return res.status(409).json({ error: "Duplicate entry" });
      } else {
        return res.status(500).json({ error: "Unknown Error" });
      }
    });
});

router.post("/signup", function (req, res) {
  const { name, email, password, phone, gender, address, region, role, verified_email } = req.body;

  //Sequential Reequests
  userModel
    .checkExistingUser(email)
    .then(function (existingUser) {
      if (existingUser) {
        res.status(409).json({ error: "User already exists" });
      } else {
        userModel
          .signup(name, email, password, phone, gender, address, region, role, verified_email)
          .then(function (newUser) {
            return res.sendStatus(201);
          })
          .catch(function (error) {
            console.error(error);
            res.status(500).json({ error: "Error creating user" });
          });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ error: "Unknown Error" });
    });
});

router.post("/signupGoogle", function (req, res) {
  const {res_id, res_name, res_email, res_verified_email, res_picture} = req.body;
  const email = res_email;
  const id = res_id;
  const name = res_name;
  const verified_email = res_verified_email;
  const picture = res_picture;

  return userModel
    .checkExistingUser(email)
    .then(function (existingUser) {

      if (existingUser) {
        const existingUserToken = jwt.sign(
          { email: existingUser.email, userId: existingUser.userid, role: existingUser.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
        const cookieValue = serialize("authToken", existingUserToken, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        });
        res.setHeader("Set-Cookie", cookieValue);
          res.status(200).json({user: existingUser});
      } else {
        userModel
          .signupGoogle(id, name, email, verified_email,picture)
          .then(function () {
            const newUser = {
              email: email,
              id: id,
              role: "customer",
              url: picture,
              name: name,
            };
            const authToken = jwtFunctions.generateAuthToken({ email: newUser.email, userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET_KEY);
            cookieFunctions.setHttpOnlyCookieHeader("authToken", authToken, res);
            return res.status(200).json({ user: newUser });
          })
          .catch(function (error) {
            console.error(error);
            return res.status(500).json({ error: "Error creating user" });
          });
      }
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).json({ error: "Unknown Error" });
    });
});

router.post("/sendmail", async (req, res) => {
  let IPAddress = req.ip;
  if (IPAddress === "::1") {
    IPAddress = "127.0.0.1";
  }

  try {
    const email = req.body.email;
    console.log(email);
    const generatedCode = Math.floor(100000 + Math.random() * 900000);
    const info = await mailFunctions.sendEmailVerificationCode(IPAddress, generatedCode, email);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin part

router.get("/getAllUserByAdmin", validationFn.validateToken, (req, res) => {
  let offset = req.query.offset;
  if (!offset || isNaN(offset)) {
    offset = 0;
  }

  userModel
    .getUserByAdmin(offset)
    .then(function (users) {
      return res.json({ users });
    })
    .catch(function (error) {
      console.error(error);
      if (error instanceof EMPTY_RESULT_ERROR) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Unknown Error" });
    });
});

router.delete("/deleteUser/:userid", validationFn.validateToken, (req, res) => {
  const userId = req.params.userid;

  userModel
    .deleteUser(userId)
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting user:", error);

      if (error instanceof EMPTY_RESULT_ERROR) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(500).json({ error: "Error deleting user" });
      }
    });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/user/js/uploads/"); // Set the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Set the file name
  },
});
const upload = multer({ storage: storage });

router.post("/create-user", validationFn.validateToken, upload.single("photo"), (req, res) => {
  try {
    const { name, email, password, phone, address, region } = req.body;
    const file = req.file;

    const uploadPhoto = () => {
      if (!file) {
        return Promise.resolve(null);
      }

      return cloudinary.uploader.upload(file.path, { folder: "Design" });
    };

    const createUserInDatabase = (photoResult) => {
      const photoUrl = photoResult ? photoResult.secure_url : null;
      return userModel.createUser({ name, email, password, phone, address, region, photoUrl });
    };

    Promise.all([uploadPhoto(), createUserInDatabase()])
      .then(([photoResult]) => {
        res.status(201).json({ message: "User created successfully" });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
      });
  } catch (error) {
    console.error("Error in create-user endpoint:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

router.get("/getTotalUserByAdmin", validationFn.validateToken, (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    console.log(startDate, endDate);
    userModel
      .getTotalUserByAdmin(startDate, endDate)
      .then((users) => {
        return res.json({ users });
      })
      .catch((error) => {
        console.error(error);
        if (error instanceof EMPTY_RESULT_ERROR) {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Unknown Error" });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unknown Error" });
  }
});

router.get("/getUserCreationData", validationFn.validateToken, (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    console.log(startDate, endDate);
    // Call the model to get user creation data
    userModel
      .getUserCreationData(startDate, endDate)
      .then((data) => {
        return res.json(data);
      })
      .catch((error) => {
        console.error(error);
        if (error instanceof EMPTY_RESULT_ERROR) {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Unknown Error" });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unknown Error" });
  }
});

router.get("/getgenderStatistics", (req, res) => {
  userModel.getGenderStatistics((error, statistics) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(statistics);
  });
});

// CA2
// Name: Zay Yar Tun
// to check whether the token is valid
router.post("/validateToken/:userid", validationFn.validateToken, function (req, res) {
  const role = req.body.role;
  const id = req.body.id;
  const email = req.body.email;
  const userID = req.params.userid;
  const tokenExpired = req.body.tokenExpired;

  if (tokenExpired) {
    return Promise.all([userModel.getRefreshToken(userID), userModel.getUserByUserID(userID)]).then(([result1, result2]) => {
      jwtFunctions.verifyJWTToken(result1.refreshtoken, process.env.JWT_REFRESH_KEY, (err, data) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(403).send({ error: "Token Expired" });
          } else {
            return res.status(403).send({ error: "Unauthorized Access" });
          }
        } else {
          const currentDate = new Date();
          const lastCreatedAt = new Date(data.lastcreatedat);
          lastCreatedAt.setDate(lastCreatedAt.getDate() + 7);
          const diff = Math.floor((lastCreatedAt - currentDate) / (1000 * 60));
          const newAuthToken = jwtFunctions.generateAuthToken({ email: result2.email, userId: result2.userid, role: result2.role }, process.env.JWT_SECRET_KEY);

          if (diff > 0 && diff < 60 * 24) {
            // generate a new refresh token if two days left
            const newRefreshToken = jwtFunctions.generateRefreshToken({ lastcreatedat: new Date().toISOString() }, process.env.JWT_REFRESH_KEY);
            return userModel.storeRefreshToken(result2.userid, newRefreshToken).then((result) => {
              cookieFunctions.setHttpOnlyCookieHeader("authToken", newAuthToken, res);
              return res.status(200).json({ message: "validation success", role: result2.role });
            });
          } else if (diff < 0) {
            return res.status(403).send({ error: "Token Expired" });
          } else {
            cookieFunctions.setHttpOnlyCookieHeader("authToken", newAuthToken, res);
            return res.status(200).json({ message: "validation success", role: result2.role });
          }
        }
      });
    });
  } else {
    if (id && email && !isNaN(id) && role && (role === "customer" || role === "admin")) {
      res.status(200).json({ message: "validation success", role: role });
    } else {
      return res.status(403).send({ error: "Unauthorized Access" });
    }
  }
});

router.post("/signout", (req, res) => {
  cookieFunctions.clearHttpOnlyCookieHeader("authToken", res);
  return res.status(200).json({ success: true });
});
// Name: Zay Yar Tun

module.exports = router;
