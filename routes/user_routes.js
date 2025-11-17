const express = require('express');
const auth = require('../controller/auth_controller');
const admin_controller = require('../controller/admin_controller');
const user_controller = require('../controller/user_controller');
const user = require('../model/userSchema');

const router = express.Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/forgotpassword', auth.forget_password);
router.post('/resetPassword', auth.reset_password);

// User Booking and Movies related APIs

router.get('/movies', admin_controller.get_movies);
router.get("/movie/:id", user_controller.get_movie_details);


module.exports = router;
