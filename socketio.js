//import db from "./database"

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("message", message);

    socket.on("upload", upload);

    socket.on("deletepic", deletepic);

    socket.on("renamepic", renamepic);

    socket.on("register", register);
    socket.on("login", login);
  });

  //////////////////////////////////////////////
  ////////////////////////////////////////////////
  function login(user) {
    let db = require("./database");
    let passhash = require("password-hash");
    const parport = require("passport");
    const sql = `SELECT * from users where username ='${user.email}'`;

    db(sql)
      .then((data) => {
        let dbpass = data[0].password;
        let password = user.password;
        let match = passhash.verify(password, dbpass);
        if (match) {
          io.emit("message", data);
        } else {
          io.emit("message", "รหัสไม่ถูกต้อง");
        }
      })
      .catch((error) => {
        io.emit("message", sql);
      });
  }

  function register(user) {
    let db = require("./database");
    let uuid = require("./utilitys/uuid");
    let passhash = require("password-hash");
    let hash = passhash.generate(user.password);
    // let uuid = "1";
    let newid = uuid();
    const sql = `
    INSERT INTO users (uuid,username,password) VALUES(
      '${newid}','${user.username}',
      '${hash}')
      `;

    db(sql)
      .then((data) => {
        io.emit("message", data);
      })
      .catch((error) => {
        io.emit("message", error);
      });
  }

  function renamepic(pic) {
    const fs = require("fs");
    fs.rename(
      __dirname + "/public/uploads/_delete_" + pic,
      __dirname + "/public/uploads/" + pic,
      function (err) {
        if (err) {
          io.emit("message", err);
        } else {
          io.emit("message", pic + " has been Rename");
        }
      }
    );
  }

  function deletepic(pic) {
    const fs = require("fs");
    fs.unlink(__dirname + "/public/uploads/" + pic, function (err) {
      if (err) {
        io.emit("message", err);
      } else {
        io.emit("message", pic + " has been Deleted");
      }
    });
  }

  function message(msg) {
    console.log(msg);
    let payload = {
      id: socket.id,
      ...msg,
    };
    io.emit("message", payload);
  }

  async function upload(file) {
    let payload = {
      msg: "uploaded!!",
      ...file,
    };
    await renamepic(file.filename);
    io.emit("upload", payload);
  }
};

//////////////////////////////////////////
