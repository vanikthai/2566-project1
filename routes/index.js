const express = require("express");
const route = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated,
  ensureAdmin,
} = require("../authen.js");

route.get("/", forwardAuthenticated, (req, res) => {
  res.render("index.ejs");
});
route.get("/main", ensureAuthenticated, (req, res) => {
  res.render("main.ejs");
});

route.get("/register", (req, res) => {
  res.render("register.ejs");
});

route.post("/login", require("./login"));
route.get("/logout", require("./logout"));
module.exports = route;
