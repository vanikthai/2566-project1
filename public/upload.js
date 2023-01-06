import socket from "./controls/socket.js";
const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input");
////////////////////////////////////////////////////////////////////////
import Upload from "./controls/upload.js";
// form click event

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("loadhead");
});

document.getElementById("fmupload").addEventListener("click", () => {
  fileInput.click();
});

function tracUPloadName() {
  let app = document.getElementById("app");
  let newloadname = "app" + Math.round(Math.random() * 400);
  let newload = document.createElement("div");
  newload.id = newloadname;
  newload.innerText = "กำลังดำเนินการ...";

  app.appendChild(newload);
  return newloadname;
}

let uploadfileadd = [];

function runUPloads(file) {
  uploadfileadd = file;
  let id_head = document.getElementById("selectline").value || 1;
  let descriptions = document.getElementById("selectdistrip").value || "";
  // descriptions = descriptions.toString().replace(/%/g, "~~pct~~");
  let payload = {
    id_head,
    descriptions: descriptions,
  };
  // console.log(payload);

  socket.emit("addDescription", payload);
  // let newloadname = tracUPloadName();
  // setTimeout(() => {
  //   let upfile = new Upload(`#${newloadname}`);
  //   upfile.loadall(uploadfileadd);
  // }, 100);
}

fileInput.onchange = async ({ target }) => {
  let file = target.files;
  runUPloads(file);
};

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  runUPloads(files);
}

let dropArea = document.getElementById("drop-area");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("highlight");
}

dropArea.addEventListener("drop", handleDrop, false);

socket.on("loadhead", (data) => {
  let select = document.getElementById("selectline");
  let i = 0;
  data.forEach((el) => {
    var opt = document.createElement("option");
    if (i == 0) opt.setAttribute("selected", "selected");
    i++;
    opt.value = el.id_head;
    opt.innerHTML = el.head;
    select.appendChild(opt);
  });
});

socket.on("addDescription", (data) => {
  let id_head = document.getElementById("selectline").value || 1;
  let id_de = data.insertId;
  let payload = {
    id_de,
    id_head,
    files: uploadfileadd,
  };
  // console.log(id_de);
  let newloadname = tracUPloadName();
  setTimeout(() => {
    let upfile = new Upload(`#${newloadname}`);
    upfile.loadall(payload);
  }, 100);
});
