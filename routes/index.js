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
  res.render("main.ejs", { user: req.user || "none" });
});

route.get("/filemissing", ensureAdmin, require("./filemissing"));

route.get("/users", ensureAdmin, (req, res) => {
  res.render("users.ejs", { user: req.user || "none" });
});

route.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register.ejs");
});

route.get("/upload", ensureAuthenticated, (req, res) => {
  res.render("upload.ejs", { user: req.user || "none" });
});

route.get("/headline", ensureAuthenticated, (req, res) => {
  res.render("headline.ejs", { user: req.user || "none" });
});

route.get("/descrip/:id", ensureAuthenticated, (req, res) => {
  res.render("descrip.ejs", { user: req.user, id: req.params.id });
});

route.get("/showon/:id", ensureAuthenticated, (req, res) => {
  res.render("showon.ejs", { user: req.user, id: req.params.id });
});

route.get("/setting", ensureAuthenticated, (req, res) => {
  res.render("setting.ejs", { user: req.user });
});

route.get("/headlinesetting", ensureAdmin, (req, res) => {
  res.render("head.ejs", { user: req.user || "none" });
});

route.post("/upload", (req, res) => {
  const filename = "./public/uploads/" + req.headers["file-name"];
  req.on("data", (chunk) => {
    fs.appendFileSync(filename, chunk);
  });
  res.end("uploaded!!");
});

route.post("/userspic", (req, res) => {
  const filename = "./public/users/" + req.headers["file-name"];
  req.on("data", (chunk) => {
    fs.appendFileSync(filename, chunk);
  });
  res.end("uploaded!!");
});

route.post("/login", require("./login"));
route.get("/logout", require("./logout"));
module.exports = route;
