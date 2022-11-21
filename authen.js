module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "กรุณาลงชื่อเข้าใช้งาน");
    res.redirect("/");
  },
  ensureAdmin: function (req, res, next) {
    if (req.isAuthenticated()) {
      const kinds = req.user.name.kind;
      if (kinds === "admin") {
        return next();
      } else {
        req.flash("error_msg", "ไม่อนุญาตให้ใช้งาน");
        return res.redirect("/");
      }
    }
    req.flash("error_msg", "กรุณาลงชื่อเข้าใช้งาน");
    res.redirect("/");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/main");
  },
};
