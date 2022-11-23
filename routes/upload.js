const fs = require("fs");
module.exports = (req, res) => {
  const filename = "./upload/" + req.headers["file-name"];
  req.on("data", (chunk) => {
    fs.appendFileSync(filename, chunk);
  });
  res.end("uploaded!!");
};
