const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  movieName: {
    type: String,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
