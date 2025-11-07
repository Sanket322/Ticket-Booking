const express = require("express");
const admin_controller = require("../controller/admin_controller");

const router = express.Router();

router
  .route("/movie")
  .get(admin_controller.get_movies)
  .post(admin_controller.add_movie);

router
  .route("/movie/:id")
  .get(admin_controller.movie_details)
  .put(admin_controller.update_movie)
  .delete(admin_controller.delete_movie);

module.exports = router;
