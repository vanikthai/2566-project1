import socket from "./controls/socket.js";
import loadProfileImage from "./controls/loadProfileImage.js";
const theuser = document.getElementById("userset").dataset.user;
let user = JSON.parse(theuser);
let imgprofile = new loadProfileImage("tum");
const PROFILE = {
  TUMPIC: 500,
  CHANK_SIZE: 10000,
  file: "",
  username: user.name.username,
  id: user.name.id,
  newName() {
    let newN = this.file.name.split(".");
    return this.id + "." + newN[newN.length - 1];
  },
  getName() {
    return this.id + ".jpg";
  },
};

socket.on("delprofilepic", (msg) => {
  setTimeout(() => {
    imgprofile.post(PROFILE.id, PROFILE.file);
  }, 100);
});

socket.on("message", (msg) => {
  setTimeout(() => {
    imgprofile.post(PROFILE.id, PROFILE.file);
  }, 100);
});

document.addEventListener("DOMContentLoaded", () => {
  imgprofile.load(PROFILE.id);
});

document.getElementById("file").addEventListener("change", async (e) => {
  PROFILE.file = await e.target.files[0];
  let nName = { pic: PROFILE.newName() };
  socket.emit("delprofilepic", nName);
});
