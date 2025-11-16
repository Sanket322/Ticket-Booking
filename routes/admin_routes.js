const express = require('express');
const admin_controller = require('../controller/admin_controller');

const router = express.Router();

router.route('/movie').get(admin_controller.get_movies).post(admin_controller.add_movie);

router
    .route('/movie/:id')
    .get(admin_controller.movie_details)
    .put(admin_controller.update_movie)
    .delete(admin_controller.delete_movie);

router.route('/theater').post(admin_controller.add_theater).get(admin_controller.get_theaters);

router
    .route('/theater/:id')
    .get(admin_controller.theater_details)
    .put(admin_controller.update_theater)
    .delete(admin_controller.delete_theater);

router.route('/screen').post(admin_controller.add_screen).get(admin_controller.get_screens);

router
    .route('/screen/:id')
    .get(admin_controller.screen_details)
    .put(admin_controller.update_screen)
    .delete(admin_controller.delete_screen);

router.route('/show').get(admin_controller.get_shows).post(admin_controller.add_show);

router
    .route('/show/:id')
    .get(admin_controller.show_details)
    .put(admin_controller.update_show)
    .delete(admin_controller.delete_show);

module.exports = router;
