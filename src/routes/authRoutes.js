const express = require('express')
const { callback, login, logout } = require("../controllers/authController");

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/logout", logout);

module.exports = router;