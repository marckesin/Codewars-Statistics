const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const compression = require("compression");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

// [GET]
app.get("/", (req, res) => {
  res.render("index", { data: false });
});

// [POST]
app.post("/", async (req, res) => {
  const { user } = req.body;
  let challenges;

  await axios
    .get(
      `https://www.codewars.com/api/v1/users/${user}/code-challenges/completed?page=0`,
    )
    .then(response => {
      challenges = response.data.data;
    })
    .catch(error => {
      console.log(error);
    });

  axios
    .get(`https://www.codewars.com/api/v1/users/${user}`)
    .then(response => {
      const languages = Object.keys(response.data.ranks.languages);

      res.render("index", {
        data: response.data,
        languages: languages,
        challenges: challenges,
      });
    })
    .catch(error => {
      console.log(error);
      res.render("index", { data: false });
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
