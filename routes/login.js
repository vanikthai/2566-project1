const passport = require("passport");
module.exports = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
};
