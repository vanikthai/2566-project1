module.exports = (socket) => {
  socket.on("message", (msg) => {
    console.log(msg);
    socket.emit("message", msg);
  });
};
