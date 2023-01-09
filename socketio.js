//import db from "./database"
const db = require("./database");
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("message", message);
    ////////upload////////////
    socket.on("upload", upload);
    socket.on("deletepic", delteUploadName);
    socket.on("renamepic", renamepic);
    /////////register////////////
    socket.on("register", register);
    ////////login/////////////
    socket.on("login", login);
    //////loadmain//////////
    socket.on("loadstart", loadstart);
    //////user//////////
    socket.on("finduser", finduser);
    socket.on("updateuser", updateuser);
    socket.on("resetpass", resetpass);
    /////head////
    socket.on("addheads", addheads);
    socket.on("loadhead", loadhead);
    socket.on("delhead", delhead);
    socket.on("updatehead", updatehead);
    socket.on("addDescription", addDescription);
    socket.on("updateDescription", updateDescription);
    socket.on("showdis", showdisa);

    ///////////////////////////////////////////////////////////

    function showdisa(payload) {
      // socket.emit("message", payload);
      let sql = `SELECT description.*,head.head, '${payload.id_upload}' as id_upload FROM description INNER JOIN head ON description.id_head = head.id_head WHERE id_de = '${payload.id_de}'; `;
      db(sql)
        .then((data) => {
          socket.emit("showdis", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function updateDescription(payload) {
      let sql = `UPDATE description SET id_head='${payload.id_head}', descriptions='${payload.descriptions}' WHERE id_de = '${payload.id_de}';`;
      db(sql)
        .then((data) => {
          socket.emit("updateDescription", data);
        })
        .catch((error) => {
          socket.emit("message", error + ":" + sql);
        });
    }

    function addDescription(file) {
      const sql = `INSERT INTO description (id_head,descriptions,username,uuid) VALUES('${file.id_head}','${file.descriptions}','${file.username}','${file.uuid}')`;
      db(sql)
        .then((data) => {
          socket.emit("addDescription", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }
    function updatehead(payload) {
      let sql = `UPDATE head SET head='${payload.head}' WHERE id_head = '${payload.id_head}';`;
      db(sql)
        .then((data) => {
          socket.emit("updatehead", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function delhead(id_head) {
      let sql = `DELETE  FROM head WHERE id_head = '${id_head}';`;
      db(sql)
        .then((data) => {
          socket.emit("delhead", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function loadhead() {
      let sql = `SELECT * FROM head;`;
      db(sql)
        .then((data) => {
          socket.emit("loadhead", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function addheads(head) {
      const sql = `INSERT INTO head (head) VALUES('${head}')`;
      db(sql)
        .then((data) => {
          socket.emit("addheads", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function resetpass(id) {
      let sql = `UPDATE users SET password='sha1$1ad542da$1$4464432ee97f444c397f7fd2ece3638450bac978' WHERE uuid = '${id}'`;
      socket.emit("message", sql);
      db(sql)
        .then((data) => {
          socket.emit("resetpass", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function updateuser(payload) {
      let sql = `UPDATE users SET kind='${payload.kind}' WHERE uuid = '${payload.id}'`;
      socket.emit("message", sql);
      db(sql)
        .then((data) => {
          socket.emit("updateuser", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function finduser(name) {
      let sql = `SELECT * FROM users WHERE username like '${name}%';`;
      db(sql)
        .then((data) => {
          socket.emit("finduser", data);
          socket.emit("message", sql);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function loadstart(page, pages) {
      let sql = `SELECT count(id_upload) as 'max' FROM uploads;`;
      db(sql)
        .then((data) => {
          let totalpages = Math.round(data[0].max / pages);
          let nexpage = page * pages;
          let sql1;
          if (page == 0) {
            sql1 = `SELECT *,${page} as page,${totalpages} as tpages  FROM uploads  ORDER BY id_upload DESC LIMIT ${page},${pages};`;
          } else {
            sql1 = `SELECT *,${page} as page,${totalpages} as tpages  FROM uploads  ORDER BY id_upload DESC LIMIT ${nexpage},${pages};`;
          }
          db(sql1)
            .then((data1) => {
              socket.emit("loadlast", data1);
            })
            .catch((error) => {
              socket.emit("message", sql1);
            });
        })
        .catch((error) => {
          socket.emit("message", sql);
        });
    }

    function delteUploadName(name) {
      sql = `DELETE FROM uploads WHERE uploadName = '${name.pic}' and user ='${name.user}';`;
      db(sql)
        .then((data) => {
          deletepic(name);
          socket.emit("message", data);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function renamepic(pic) {
      const fs = require("fs");
      fs.rename(
        __dirname + "/public/uploads/_delete_" + pic,
        __dirname + "/public/uploads/" + pic,
        function (err) {
          if (err) {
            socket.emit("message", err);
          } else {
            socket.emit("message", pic + " has been Rename");
          }
        }
      );
    }

    async function upload(file) {
      let payload = {
        msg: "uploaded!!",
        ...file,
      };
      await renamepic(file.filename);
      await uploadSave(file);
      //io.emit("upload", payload);
    }

    function uploadSave(file) {
      const sql = `INSERT INTO uploads (uploadName,fileType,user,useid,id_de) VALUES('${file.filename}','${file.type}','${file.username}','${file.id}','${file.id_de}')`;
      db(sql)
        .then((data) => {
          let payload = {
            id_upload: data.insertId,
            ...file,
          };
          // socket.emit("message", data);
          io.emit("upload", payload);
        })
        .catch((error) => {
          socket.emit("message", error);
        });
    }

    function deletepic(pic) {
      const fs = require("fs");
      fs.unlink(__dirname + "/public/uploads/" + pic.pic, function (err) {
        if (err) {
          io.emit("message", err);
        } else {
          io.emit("deletePicture", {
            pic,
            msg: " has been Deleted",
          });
        }
      });
    }

    function message(msg) {
      let payload = {
        id: socket.id,
        ...msg,
      };
      io.emit("message", payload);
    }
    ////////////////////////////////////////////////////////////////
  });

  //////////////////////////////////////////////
  ////////////////////////////////////////////////

  function login(user) {
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
};

//////////////////////////////////////////
