const db = require("../database");
module.exports = (req, res) => {
  let sql = `SELECT * FROM description WHERE id_head =${req.params.id};`;
  db(sql)
    .then((data) => {
      res.render("descrip.ejs", { user: req.user, data: data });
    })
    .catch((error) => {
      res.send(error + " error " + sql);
    });
};
