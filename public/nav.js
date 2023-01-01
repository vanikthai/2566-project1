import socket from "./controls/socket.js";

socket.on("upload", (msg) => {
  let bellnum = document.getElementById("bellnum");
  bellnum.innerText = Number(bellnum.innerText) + 1;
});
