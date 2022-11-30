const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "http://vanikthai.com",
    user: "vaniktha_02",
    password: "03IwLXns",
    database: "vaniktha_02"
  });

  module.exports = (sql) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };