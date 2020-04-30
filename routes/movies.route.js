const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/movies.controller");

router.get("/", moviesController.findAll);

router.post("/", moviesController.createOne);


router.get("/:id", moviesController.findOne);

router.put("/:id", moviesController.replaceOne);

router.patch("/:id", moviesController.updateOne);

module.exports = router;
