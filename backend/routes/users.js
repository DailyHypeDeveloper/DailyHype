/* Name: Wai Yan Aung
Admin No: 2234993
Date: 2.11.2023
Description: Login Page  */

const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const validationFn = require("../middlewares/validateToken");
const {EMPTY_RESULT_ERROR, DUPLICATE_ENTRY_ERROR} = require("../errors");
const cloudinary = require("../cloudinary");
const multer = require("multer");
const sendVerificationEmail = require("../nodemailer/sendmail");
const {serialize} = require("cookie");

router.post("/login", function (req, res) {
  const {email, password} = req.body;
  userModel
    .checkLogin(email, password)
    .then(function (user) {
      if (!user) {
        res.status(401).json({error: "Invalid email or password"});
      } else {
        delete user.password;
        console.log(user);
        const token = jwt.sign(
          {email: user.email, userId: user.userid, role: user.role},
          process.env.JWT_SECRET_KEY,
          {expiresIn: "1h"}
        );
        const cookieValue = serialize("authToken", token, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        });
        res.setHeader("Set-Cookie", cookieValue);
        res.status(200).json({user: user});
      }
    })
    .catch(function (error) {
      console.error(error);
      if (error instanceof EMPTY_RESULT_ERROR) {
        res.status(401).json({error: "User not found"});
      } else if (error instanceof DUPLICATE_ENTRY_ERROR) {
        res.status(409).json({error: "Duplicate entry"});
      } else {
        res.status(500).json({error: "Unknown Error"});
      }
    });
});
//ok

router.post("/signup", function (req, res) {
  const {name, email, password, phone, gender, address, region, role, verified_email} = req.body;

  //Sequential Reequests
  userModel
    .checkExistingUser(email)
    .then(function (existingUser) {
      if (existingUser) {
        res.status(409).json({error: "User already exists"});
      } else {
        userModel
          .signup(name, email, password, phone, gender, address, region, role, verified_email)
          .then(function (newUser) {
            return res.sendStatus(201);
          })
          .catch(function (error) {
            console.error(error);
            res.status(500).json({error: "Error creating user"});
          });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({error: "Unknown Error"});
    });
});

router.post("/signupGoogle", function (req, res) {
  const {res_id, res_name, res_email, res_verified_email} = req.body;
  const email = res_email;
  const id = res_id;
  const name = res_name;
  const verified_email = res_verified_email;
  console.log(req.body.res_email);
  console.log("HELLO");

  userModel
    .checkExistingUser(email)
    .then(function (existingUser) {
      if (existingUser) {
        res.status(409).json({error: "User already exists"});
      } else {
        userModel
          .signupGoogle(id, name, email, verified_email)
          .then(function () {
            const newUser = {
              email: email,
              id: id,
              role: "customer",
              url: "",
              name: name,
            };
            const token = jwt.sign(
              {email: newUser.email, userId: newUser.id, role: newUser.role},
              process.env.JWT_SECRET_KEY,
              {expiresIn: "1h"}
            );
            console.log(token);
            const cookieValue = serialize("authToken", token, {
              httpOnly: true,
              sameSite: "strict",
              path: "/",
            });
            res.setHeader("Set-Cookie", cookieValue);
            res.status(200).json({user: newUser});
          })
          .catch(function (error) {
            console.error(error);
            res.status(500).json({error: "Error creating user"});
          });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({error: "Unknown Error"});
    });
});

router.post("/sendmail", async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const info = await sendVerificationEmail.sendEmail(email);
    res.status(200).json({message: "Email sent successfully", info});
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({error: "Internal server error"});
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
      return res.json({users});
    })
    .catch(function (error) {
      console.error(error);
      if (error instanceof EMPTY_RESULT_ERROR) {
        return res.status(404).json({error: error.message});
      }
      return res.status(500).json({error: "Unknown Error"});
    });
});

router.delete("/deleteUser/:userid", validationFn.validateToken, (req, res) => {
  const userId = req.params.userid;

  userModel
    .deleteUser(userId)
    .then(() => {
      res.status(200).json({message: "User deleted successfully"});
    })
    .catch((error) => {
      console.error("Error deleting user:", error);

      if (error instanceof EMPTY_RESULT_ERROR) {
        res.status(404).json({error: "User not found"});
      } else {
        res.status(500).json({error: "Error deleting user"});
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
const upload = multer({storage: storage});

router.post("/create-user", validationFn.validateToken, upload.single("photo"), (req, res) => {
  try {
    const {name, email, password, phone, address, region} = req.body;
    const file = req.file;

    const uploadPhoto = () => {
      if (!file) {
        return Promise.resolve(null);
      }

      return cloudinary.uploader.upload(file.path, {folder: "Design"});
    };

    const createUserInDatabase = (photoResult) => {
      const photoUrl = photoResult ? photoResult.secure_url : null;
      return userModel.createUser({name, email, password, phone, address, region, photoUrl});
    };

    Promise.all([uploadPhoto(), createUserInDatabase()])
      .then(([photoResult]) => {
        res.status(201).json({message: "User created successfully"});
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        res.status(500).json({error: "Error creating user"});
      });
  } catch (error) {
    console.error("Error in create-user endpoint:", error);
    res.status(500).json({error: "Error creating user"});
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
        return res.json({users});
      })
      .catch((error) => {
        console.error(error);
        if (error instanceof EMPTY_RESULT_ERROR) {
          return res.status(404).json({error: error.message});
        }
        return res.status(500).json({error: "Unknown Error"});
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Unknown Error"});
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
          return res.status(404).json({error: error.message});
        }
        return res.status(500).json({error: "Unknown Error"});
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Unknown Error"});
  }
});

router.get("/getgenderStatistics", (req, res) => {
  userModel.getGenderStatistics((error, statistics) => {
    if (error) {
      return res.status(500).json({error: "Internal Server Error"});
    }

    res.json(statistics);
  });
});

// Name: Zay Yar Tun
// to check whether the token is customer
router.post("/validateToken", validationFn.validateToken, function (req, res) {
  const role = req.body.role;
  const id = req.body.id;
  const email = req.body.email;
  if (id && email && !isNaN(id) && role && (role === "customer" || role === "admin")) {
    res.status(200).json({ message: "validation success", role: role });
  } else {
    return res.status(403).send({error: "Unauthorized Access"});
  }
});

router.post("/signout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  return res.status(200).json({success: true});
});
// Name: Zay Yar Tun

module.exports = router;
