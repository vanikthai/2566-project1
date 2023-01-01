const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input");
////////////////////////////////////////////////////////////////////////
import Upload from "./controls/upload.js";
// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = async ({ target }) => {
  if (target.files.length > 100) {
    alert("เลือกส่งได้ครั้งละ 100 files ครับ");
    target.preventDefault();
    return;
  }

  let file = target.files; //getting file [0] this means if user has selected multiple files then get first one only
  let app = document.getElementById("app");
  let newloadname = "app" + Math.round(Math.random() * 400);
  let newload = document.createElement("div");
  newload.id = newloadname;
  newload.innerText = "กำลังดำเนินการ...";
  app.appendChild(newload);

  setTimeout(() => {
    let upfile = new Upload(`#${newloadname}`);
    upfile.loadall(file);
  }, 100);
};

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

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  let upfile = new Upload("#app");
  upfile.loadall(files);
}
