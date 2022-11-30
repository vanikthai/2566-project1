const fs = require("fs");
module.exports = (req, res) => {
  const filename = "./public/upload/" + req.headers["file-name"];
  req.on("data", (chunk) => {
    fs.appendFileSync(filename, chunk);
  });  
  res.end("uploaded!!");
};
