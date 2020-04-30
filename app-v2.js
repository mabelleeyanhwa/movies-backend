const express = require("express");
const api = express.Router();

api.use(express.json());

const moviesRouter = require("./routes/movies.route");
const directorRouter = require("./routes/director.route");
const usersRouter = require("./routes/users.route");

api.use("/movies", moviesRouter);
api.use("/director", directorRouter);
api.use("/users", usersRouter);

api.get("/", (req, res) => {
  res.send("version 2 of api");
});

module.exports = api;
