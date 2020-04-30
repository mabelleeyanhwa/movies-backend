const Movie = require("../models/movie.model");

const mongoose = require("mongoose");

const wrapAsync = require("../utils/wrapAsync");
const Joi = require("@hapi/joi");

const movieSchema = Joi.object({
  movieName: Joi.string().min(3).max(30).required(),
});

const createOne = wrapAsync(async (req, res, next) => {
  const movie = req.body;
  const result = movieSchema.validate(movie);
  if (result.error) {
    const error = new Error(result.error.details[0].message);
    error.statusCode = 400;
    next(error);
  } else {
    const ID_FIELD = "id";
    const latestMovie = await findNewestMovie(ID_FIELD);
    movie[ID_FIELD] = latestMovie.id + 1;
    const newMovie = new Movie(movie);
    await newMovie.save();
    res.status(201).send(newMovie);
  }
});

const findNewestMovie = async (idField) => {
  const movies = await Movie.find().sort(`-${idField}`).limit(1);
  return movies[0];
};

const findOne = wrapAsync(async (req, res, next) => {
  const movie = await Movie.findOne({ id: parseInt(req.params.id) }).lean();
  const { _id, __v, ...strippedMovie } = movie;
  res.status(200).send(strippedMovie);
});

const findAll = wrapAsync(async (req, res) => {
  const movies = await Movie.find({}, "-_id -__v");
  //const movies = await Movie.find();
  res.status(200).send(movies);
});

const replaceOne = wrapAsync(async (req, res, next) => {
  try {
    const newMovie = req.body;

    const result = movieSchema.validate(movie);
    if (result.error) {
      const error = new Error(result.error.details[0].message);
      error.statusCode = 400;
      next(error);
    } else {
      const id = parseInt(req.params.id);
      newMovie.id = id;
      const replacedMovie = await Movie.findOneAndReplace(
        { id: id },
        newMovie,
        {
          projection: "-_id -__v",
          new: true,
        }
      );
      res.status(200).send(replacedMovie);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const movieError = new Error("Movie JSON validation failed");
      movieError.statusCode = 400;
      next(movieError);
    } else {
      throw err;
    }
  }
});

const updateOne = wrapAsync(async (req, res) => {
  const movie = await Movie.findOne({ id: parseInt(req.params.id) });
  //console.log(Object.entries(movie)); //proves movie is not js obj
  const newMovie = req.body;
  Object.assign(movie, newMovie);
  await movie.save();
  const movieObj = movie.toObject();
  const { _id, __v, ...strippedMovie } = movieObj;
  res.status(200).send(strippedMovie);
});

module.exports = {
  createOne,
  findOne,
  findAll,
  updateOne,
  replaceOne,
};
