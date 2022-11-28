module.exports = (io) => {
  io.on("connection", (socket) => {

    socket.on("message",message);
  
    socket.on("upload", upload);

    socket.on("deletepic", deletepic);
  
  });

////////////////////////////////////////////////
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
  
  
  function upload(file) {
    let payload = {
      msg : "uploaded!!",
      ...file
    }
    io.emit("upload", payload);
  }
  

};


