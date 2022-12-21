const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  SIGN_UP,
  LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
} = require("../controllers/users");

router.post("/signUp", SIGN_UP);

router.post("/login", LOGIN);

router.get("/getNewJwtToken", GET_NEW_JWT_TOKEN);

router.get("/getAllUsers", GET_ALL_USERS);

router.get("/getUserById/:id", GET_USER_BY_ID);

module.exports = router;
