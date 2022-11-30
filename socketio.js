
  

module.exports = (io) => {
  io.on("connection", (socket) => {

    socket.on("message",message);
  
    socket.on("upload", upload);

    socket.on("deletepic", deletepic);

    socket.on("renamepic", renamepic);

    socket.on("register", register);
  
  });


////////////////////////////////////////////////
  function register(user) {
    let db = require("./database")
    let uuid = "aaa"
    const sql = `
    INSERT INTO users (uid,username,password) VALUES(
      '${uuid}','${user.username}',
      '${user.password}','user')
      `;
      
      console.log(sql);
    db(sql)
    .then((data) => {
      io.emit("message", data);         
    })
    .catch((error) => {
      io.emit("message", error);         
    });
  }

  function renamepic(pic) {
    const fs = require('fs');
    fs.rename(__dirname+ '/public/uploads/_delete_'+ pic,__dirname+ '/public/uploads/'+ pic, function (err) {            
         if (err) {                                                 
          io.emit("message", err);                            
         } else {
           io.emit("message", pic + ' has been Deleted');                           
         }                                                        
     });    
  }

  function deletepic(pic) {
    
    const fs = require('fs');
    fs.unlink(__dirname+ '/public/uploads/'+ pic, function (err) {            
         if (err) {                                                 
          io.emit("message", err);                            
         } else {
           io.emit("message", pic + ' has been Deleted');                           
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
      msg : "uploaded!!",
      ...file
    }
   await  renamepic(file.filename)
    io.emit("upload", payload);
  }
  

};


