const express = require("express");
const api = express.Router();

api.use(express.json());

const moviesRouter = require("./routes/movies.route");
const directorRouter = require("./routes/director.route");

api.use("/movies", moviesRouter);

api.use("/director", directorRouter);

api.get("/", (req, res) => {
  res.send("version 1 of api");
});

module.exports = api;
