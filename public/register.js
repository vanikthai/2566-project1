console.log("register script");
import socket from "./socket.js";
socket();
const register = document.getElementById("register");
register.addEventListener("submit", (e) => {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let payload = {
    username,
    email,
    password,
  };
  send("message", payload);
  console.log(payload);
});
