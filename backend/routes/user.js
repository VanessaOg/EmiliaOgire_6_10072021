const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const checkSignup = require("../middleware/checkSignup");

router.post("/signup", checkSignup, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
