const LocalStrategy = require("passport-local").Strategy;
//const passhash = require("password-hash");
//const mycon = require("./dbtable");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      if (password === "aaa") {
        done(null, {
          name: {
            username: email,
            password: password,
          },
        });
      } else {
        done(null, null, {
          message: email + "รหัสผ่านไม่ถูกต้อง",
        });
      }

      //   var sql = `select * from users where email ='${email}' AND allow='allow'`;
      //   mycon(sql)
      //     .then((data) => {
      //       if (data.length === 0) {
      //         done(null, null, {
      //           message: email + "อีเมลยังไม่ได้ลงทะเบียน หรือติดต่อผู้ดูแลระบบอนุญาต",
      //         });
      //       } else {
      //         var dbpass = data[0].password;
      //         const match = passhash.verify(password, dbpass);
      //         if (match) {
      //             let pic = JSON.stringify(data[0].picture)
      //             pic = pic.replace(/"([^"]+(?="))"/g, '$1')
      //           done(null, {
      //             name: {
      //               idb: data[0].id_user,
      //               id: data[0].uid,
      //               username: data[0].username,
      //               email: data[0].email,
      //               kind: data[0].kind,
      //               picture: pic,
      //             },
      //           });
      //         } else {
      //           done(null, null, {
      //             message: email + "รหัสผ่านไม่ถูกต้อง",
      //           });
      //         }
      //       }
      //     })
      //     .catch((error) => {
      //       req.flash("error", error.message);
      //       done(null, null, {
      //         message: error.message,
      //       });
      //     });
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
