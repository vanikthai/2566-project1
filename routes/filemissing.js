const fs = require("fs");
module.exports = (req, res) => {
  const uploadfile = [];
  const dir = "/home/vaniktha/main/public/uploads/";
  try {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      // console.log(file);
      if (file.startsWith("_delete_")) {
        let payload = {
          delete: file,
        };
        uploadfile.push(payload);
        fs.unlink(dir + file, (err) => {
          if (err) {
            uploadfile.push(err);
          }
        });
      }
    });
  } catch (err) {
    uploadfile.push(err);
    // console.log(err);
  }
  res.render("filemissing.ejs", {
    data: uploadfile || "No file error",
    user: req.user,
  });
};
