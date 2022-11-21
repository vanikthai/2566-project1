import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();

const sendmsg = document.getElementById("sendmsg");
sendmsg.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("pwd").value;

  let payload = {
    email,
    password,
  };

  socket.emit("message", payload);

  sendmsg.reset();
});

socket.on("message", (msg) => {
  console.log(msg);
});
