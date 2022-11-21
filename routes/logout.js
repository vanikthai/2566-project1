const { cookie } = require("express/lib/response");

module.exports = (req, res) => {
  //   console.log(req.session);
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      delete req.session;
      delete cookie;
      res.redirect("/");
    }
  });
};
