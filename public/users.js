import socket from "./controls/socket.js";
import USERS from "./controls/users.js";
let find = document.getElementById("find");
find.addEventListener("change", () => {
  socket.emit("finduser", find.value);
});

socket.on("finduser", (data) => {
  let user = new USERS("#users");
  user.load(data);

  document.querySelectorAll("#resetpass").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let row = e.target.closest("tr");
      let id = row.querySelector("#username").dataset.id;
      socket.emit("resetpass", id);
      console.log(id);
    });
  });

  document.querySelectorAll(".input").forEach((input) => {
    input.addEventListener("change", (e) => {
      let row = e.target.closest("tr");
      let id = row.querySelector("#username").dataset.id;
      let kind = row.querySelector("#kind").value;
      let payload = {
        id,
        kind,
      };
      socket.emit("updateuser", payload);
    });
  });
});

socket.on("updateuser", (data) => {
  showMsg("ประบปรุงเรียบร้อย", "update");
});

socket.on("resetpass", (data) => {
  showMsg("รหัสผ่านใหม่ คือ aa", "update");
});

socket.on("message", (msg) => {
  // console.log(msg);
});

function showMsg(msg, title = "vanikthai.com") {
  let myToastEl = document.getElementById("liveToast");
  let ToastText = document.getElementById("toastbody");
  let toastheader = document.getElementById("toastheader");
  ToastText.innerHTML = msg;
  toastheader.innerText = title;
  let myToast = new bootstrap.Toast(myToastEl);
  myToast.show();
}
