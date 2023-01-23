import socket from "../controls/socket.js";
import Loadpic from "../controls/loadpic.js";
const loadpic = new Loadpic("#pictures");
const perpage = 10;
const id_de = JSON.parse(document.getElementById("dataset").dataset.id);

document.addEventListener("DOMContentLoaded", () => {
  console.log(id_de);
  socket.emit("showon", 0, perpage, id_de);
});

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("showon", (data) => {
  loadpic.load(data);
  console.log(data);
});
