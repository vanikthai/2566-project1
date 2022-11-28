module.exports = (io) => {
  io.on("connection", (socket) => {

    socket.on("message",message);
  
    socket.on("upload", upload);
  
  });

////////////////////////////////////////////////
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
      file
    }
    io.emit("upload", payload);
  }
  

};


