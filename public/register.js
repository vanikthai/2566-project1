import socket from "./controls/socket.js";
const register = document.getElementById("register");
register.addEventListener("submit", (e) => {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let payload = {
    username,
    password,
  };
  // const payload = {};
  // Object.defineProperty(payload, "user", {
  //   get() {
  //     return username.value;
  //   },
  //   set(_user) {
  //     return (username.value = _user);
  //   },
  // });

  // Object.defineProperty(payload, "password", {
  //   get() {
  //     return password.value;
  //   },
  //   set(_pass) {
  //     return (password.value = _pass);
  //   },
  // });
  //console.log(payload);
  // payload.user = "ccc";
  //  payload.password = "cc";
  socket.emit("register", payload);
});

socket.on("message", (msg) => {
  console.log(msg);

  if (msg.sqlMessage) {
    alert("ชื่อผู้ใช้ซ้ำ " + msg.sqlMessage);
    return;
  }
  window.location.href = "http://vanikthai.com/";
});
