const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// [GET]
app.get("/", (req, res) => {
  res.render("index");
});

// [POST]
app.post("/", (req, res) => {
  const { user } = req.body;

  axios
    .get(`https://www.codewars.com/api/v1/users/${user}`)
    .then(response => {
      res.render("index", { data: response.data });
    })
    .catch(error => {
      console.log(error);
      res.render("error");
    });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
