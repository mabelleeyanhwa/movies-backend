const express = require("express");

const router = express.Router();

const {
  findOneById,
  findAll,
  createOne,
  getNextId,
} = require("../data/movies.data");

router.post("/", (req, res) => {
  const newMovie = req.body;
  newMovie.id = getNextId();
  createOne(newMovie);
  res.status(201).send(newMovie);
});

router.get("/", (req, res) => {
  const movies = findAll();
  res.status(200).send(movies);
});

router.get("/:id", (req, res) => {
  const movie = findOneById(parseInt(req.params.id));
  res.status(200).send(movie);
});

module.exports = router;
