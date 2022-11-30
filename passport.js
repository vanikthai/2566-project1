const LocalStrategy = require("passport-local").Strategy;
const passhash = require("password-hash");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //   if (password === "aaa") {
      //     done(null, {
      //       name: {
      //         username: email,
      //         password: password,
      //       },
      //     });
      //   } else {
      //     done(null, null, {
      //       message: email + "รหัสผ่านไม่ถูกต้อง",
      //     });
      //   }
      const db = require("./database");
      const sql = `SELECT * from users where username ='${email}'`;
      db(sql)
        .then((data) => {
          if (data.length === 0) {
            done(null, null, {
              message:
                email + "อีเมลยังไม่ได้ลงทะเบียน หรือติดต่อผู้ดูแลระบบอนุญาต",
            });
          } else {
            let dbpass = data[0].password;
            let match = passhash.verify(password, dbpass);
            if (match) {
              //  pic = pic.replace(/"([^"]+(?="))"/g, "$1");
              done(null, {
                name: {
                  id: data[0].uuid,
                  username: data[0].username,
                },
              });
            } else {
              done(null, null, {
                message: email + "รหัสผ่านไม่ถูกต้อง",
              });
            }
          }
        })
        .catch((error) => {
          req.flash("error", error.message);
          done(null, null, {
            message: error.message,
          });
        });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.name);
  });

  passport.deserializeUser(function (id, done) {
    done(null, {
      name: id,
    });
  });
};
