import socket from "./controls/socket.js";
import Picture from "./controls/pictures.js";
import Loadpic from "./controls/loadpic.js";
import { showMsg } from "./submain/showmsg.js";
import { btnEvent } from "./submain/btnEvent.js";
import { nextpageobser } from "./submain/nextpageobser.js";
import { imgobseve } from "./submain/imgobseve.js";
import TAB from "./submain/tab.js";
let tab = new TAB();
const picture = new Picture("#pictures");
const loadpic = new Loadpic("#pictures");
const perpage = 10;
let showdisforEdit = false;
let timestop = true;

////////////////////////////
socket.on("upload", upload);
socket.on("deletePicture", deletePicture);
socket.on("message", message);
socket.on("updateDescription", updateDescription);
socket.on("showdis", showdis);
socket.on("loadlast", loadlast);
/////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", loadstart);
document.getElementById("bell").addEventListener("click", bel);
document.getElementById("btnto").addEventListener("click", btnto);

function loadstart() {
  socket.emit("loadstart", 0, perpage);
  serviceworker();
}

function serviceworker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then((registration) => {
        console.log("SW Registered!");
      })
      .catch((error) => {
        console.log("SW Registeration Fail");
        console.log(error);
      });
  } else console.log("Your browser does not support the Service-Worker!");
}

function upload(msg) {
  let newmsg = msg.username + " เพิ่มภาพ";
  showMsg(newmsg, "เพิ่มข้อมูล");
  picture.addEntry(msg);
  btnEvent();
}

function deletePicture(msg) {
  showMsg(msg.pic.pic, "ลบข้อมูล");
  let pics = document.querySelectorAll("#btnDel");
  pics.forEach((pic) => {
    if (msg.pic.pic !== pic.dataset.pic) return;
    console.log(pic.dataset.pic);
    pic.closest("tr").remove();
  });
}

function message(msg) {
  console.log(msg);
  showMsg(msg, "ปรับปรุงข้อมูล");
}

function updateDescription(msg) {
  showMsg("ปรับปรุงรายละเอียดเรียบร้อย", "ปรับปรุงข้อมูล");
  console.log(msg);
}

function showdis(msg) {
  if (showdisforEdit) {
    nextPrev(4);
    document.getElementById("selectline").value = msg[0].id_head;
    let des = document.getElementById("selectdistrip");
    des.value = msg[0].descriptions;
    des.dataset.id_de = msg[0].id_de;
  } else {
    let id = `detail${msg[0].id_upload}`;
    let detail = document.getElementById(id);
    let content = decodeURI(msg[0].descriptions);
    detail.innerHTML = msg[0].head + "<br/>" + content;
  }
}

async function loadlast(msg) {
  await loadpic.load(msg);
  btnEvent();
  imgobseve();
  nextpageobser(socket, perpage);
}

function bel() {
  let bellnum = document.getElementById("bellnum");
  bellnum.innerText = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function btnto() {
  tab.nextPrev(4);
  document.getElementById("selectline").value = 1;
  document.getElementById("selectdistrip").value = "";
}

function btnUpdateDestrip() {
  if (!showdisforEdit) return;
  let des = document.getElementById("selectdistrip");
  let id_head = document.getElementById("selectline").value;
  let descriptions = des.value;
  let id_de = des.dataset.id_de;
  let payload = {
    id_de,
    id_head,
    descriptions,
  };
  socket.emit("updateDescription", payload);
  showdisforEdit = false;
  des.value = "";
  showMsg("upadate", "detail update");
  // console.log(payload);
}

tab.showTab(0); // Display the current tab

document.getElementById("prevBtn").addEventListener("click", () => {
  tab.nextPrev(-1);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  tab.nextPrev(1);
  if (tab.currentTab === 3) btnUpdateDestrip();
});
