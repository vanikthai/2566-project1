const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input");
////////////////////////////////////////////////////////////////////////
import Upload from "./controls/upload.js";
// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = async ({ target }) => {
  if (target.files.length > 5) {
    alert("เลือกส่งได้ครั้งละ 5 files ครับ");
    target.preventDefault();
    return;
  }

  let file = target.files; //getting file [0] this means if user has selected multiple files then get first one only
  let upfile = new Upload("#app");
  upfile.loadall(file);
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
