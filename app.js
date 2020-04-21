const express = require("express");
const app = express();

app.use(express.json());

const routerV1 = require("./app-v1");
const routerV2 = require("./app-v2");

app.use("/v1", routerV1);

app.use("/v2", routerV2);

app.get("/", (req, res) => {
  res.send("main api");
});

module.exports = app;
