import socket from "./controls/socket.js";
import Picture from "./controls/pictures.js";
import Loadpic from "./controls/loadpic.js";
const picture = new Picture("#pictures");
const loadpic = new Loadpic("#pictures");

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("loadstart", 30);
});

socket.on("upload", (msg) => {
  picture.addEntry(msg);
  console.log(msg);
});

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("loadlast", (msg) => {
  //console.log(msg);
  loadpic.load(msg);
});
