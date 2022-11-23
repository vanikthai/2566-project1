const express = require("express");
const route = express.Router();
const fs = require("fs");
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

route.get("/upload", ensureAuthenticated, (req, res) => {
  res.render("upload.ejs");
});
route.post("/upload", (req, res) => {
  const filename = "./uploads/" + req.headers["file-name"];
  req.on("data", (chunk) => {
    fs.appendFileSync(filename, chunk);
  });
  res.end("uploaded!!");
});

route.post("/login", require("./login"));
route.get("/logout", require("./logout"));
module.exports = route;
