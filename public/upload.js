const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.querySelector(".uploaded-area");
////////////////////////////////////////////////////////////////////////
import Upload from "./controls/upload.js";
// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = async ({ target }) => {
  let file = target.files; //getting file [0] this means if user has selected multiple files then get first one only
  let upfile = new Upload("#app"); 
upfile.loadall(file);
  
};

// file upload function
