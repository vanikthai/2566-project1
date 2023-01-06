import socket from "./controls/socket.js";
import Head from "./controls/head.js";
let head = new Head("#heads", socket);
let elhead = document.getElementById("head");

document.getElementById("fmadd").addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("addheads", elhead.value);
});

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("loadhead");
});

///////////////////

socket.on("loadhead", async (data) => {
  head.load(data);
  loadbtndelete();
  loadbtnUpdate();
});

socket.on("delhead", (msg) => {
  console.log(msg);
});

socket.on("updatehead", (msg) => {
  console.log(msg);
});

socket.on("addheads", (req) => {
  let payload = {
    id_head: req.insertId,
    head: elhead.value,
  };
  head.addEntry(payload);
  elhead.value = "";
  loadbtndelete();
  loadbtnUpdate();
});

function loadbtnUpdate() {
  document.querySelectorAll("#btnUpdate").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // let person = prompt("แก้ไขรายการ", btn.dataset.data);
      document.getElementById("message-text").value = btn.dataset.data;
      document.getElementById("message-text").dataset.id = btn.dataset.id;
      let person = document.getElementById("message-text").value;
      if (person == null) return;
      if (person == btn.dataset.data) return;
      let payload = {
        id_head: btn.dataset.id,
        head: person,
      };
      console.log(payload);

      // socket.emit("updatehead", payload);
      // document.querySelectorAll("#head").forEach((head) => {
      //   if (btn.dataset.id === head.dataset.id) {
      //     head.innerHTML = person;
      //     btn.dataset.data = person;
      //   }
      // });
    });
  });
}

document.getElementById("btnSave").addEventListener("click", (e) => {
  let id_head = document.getElementById("message-text").dataset.id;
  let person = document.getElementById("message-text").value;
  if (person == null) return;
  let payload = {
    id_head,
    head: person,
  };
  console.log(payload);
  socket.emit("updatehead", payload);
  document.querySelectorAll("#head").forEach((head) => {
    if (id_head === head.dataset.id) {
      head.innerHTML = person;
    }
  });

  document.querySelectorAll("#btnUpdate").forEach((head) => {
    if (id_head === head.dataset.id) {
      head.dataset.data = person;
    }
  });
  document.getElementById("btnCancle").click();
});

function loadbtndelete() {
  document.querySelectorAll("#btnDelete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let text = "(ต้องการลบข้อมูลหรือไม่!";
      if (confirm(text) == false) return;
      let id = btn.dataset.id;
      socket.emit("delhead", id);
      e.target.closest("tr").remove();
    });
  });
}
