const Movie = require("../models/movie.model");
require("./db");

Movie.create([
  { id: 1, movieName: "Lion King" },
  { id: 2, movieName: "Frozen 2" },
])
  .then(() => {
    console.log("seeded movies");
  })
  .catch((err) => {
    console.log(err);
  });
