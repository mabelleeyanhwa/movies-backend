const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

require("./utils/db");
app.use(express.json());
app.use(cookieParser("notagoodsecret"));
var corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

const routerV1 = require("./app-v1");
const routerV2 = require("./app-v2");

app.use("/v1", routerV1);

app.use("/v2", routerV2);

app.get("/", (req, res) => {
  res.send("main api");
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  const message = err.message || "Internal server error";
  if (app.get("env") === "development") {
    console.log(err);
  }
  res.send({ error: `${message}` });
});

module.exports = app;
