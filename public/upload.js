import socket from "./controls/socket.js";
const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input");
////////////////////////////////////////////////////////////////////////
import Upload from "./controls/upload.js";

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
  const theuser = document.getElementById("userset").dataset.user;
  let us = JSON.parse(theuser);

  uploadfileadd = file;
  let id_head = document.getElementById("selectline").value || 1;
  let descriptions = document.getElementById("selectdistrip").value || "";
  let payload = {
    id_head,
    descriptions: descriptions,
    username: us.name.username,
    uuid: us.name.id,
  };

  socket.emit("addDescription", payload);
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
  let Headlistgroup = document.getElementById("Headlistgroup");
  let i = 0;
  data.forEach((el) => {
    var opt = document.createElement("option");
    if (i == 0) opt.setAttribute("selected", "selected");
    i++;
    opt.value = el.id_head;
    opt.innerHTML = el.head;
    select.appendChild(opt);

    let btn = document.createElement("button");
    btn.dataset.id_head = el.id_head;
    btn.textContent = el.head;
    btn.className = "list-group-item list-group-item-action";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e.target.dataset.id_head);
      document.getElementById("closeDes").click();
      document.getElementById("mainnav").click();
      document.location =
        "http://vanikthai.com/descrip/" + e.target.dataset.id_head;
    });

    Headlistgroup.appendChild(btn);
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
  let newloadname = tracUPloadName();
  setTimeout(() => {
    let upfile = new Upload(`#${newloadname}`);
    upfile.loadall(payload);
  }, 100);
});
