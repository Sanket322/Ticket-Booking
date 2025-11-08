const express = require("express");
const auth = require("../controller/auth_controller");

const router = express.Router()

router.post("/register", auth.register)
router.post("/login", auth.login)
router.post("/logout", auth.logout)
router.post("/forgotpassword", auth.forget_password)
router.post("/resetPassword:id", auth.reset_password)

module.exports = router

