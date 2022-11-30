import socket from "./controls/socket.js";
import Picture from "./controls/pictures.js";
const picture = new Picture("#pictures");
//const sendmsg = document.getElementById("sendmsg");
// sendmsg.addEventListener("submit", (e) => {
//   e.preventDefault();
//   let email = document.getElementById("email").value;
//   let password = document.getElementById("pwd").value;

//   let payload = {
//     email,
//     password,
//   };

//   socket.emit("login", payload);

//   sendmsg.reset();
// });

socket.on("upload", (msg) => {
  picture.addEntry(msg);
  console.log(msg);
});

socket.on("message", (msg) => {
  console.log(msg);
});
