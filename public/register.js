import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
const register = document.getElementById("register");
register.addEventListener("submit", (e) => {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let payload = {
    username,
    password,
  };
  console.log(payload);
   socket.emit("register",payload)
});

socket.on("message", (msg) => {
  console.log(msg);
});