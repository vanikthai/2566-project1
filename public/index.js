import socket from "./controls/socket.js";
import Picture from "./controls/pictures.js";
import Loadpic from "./controls/loadpic.js";
const picture = new Picture("#pictures");
const loadpic = new Loadpic("#pictures");
const perpage = 10;

document.addEventListener("DOMContentLoaded", () => {
  if (!window.Notification) {
    console.log("Browser does not support notifications.");
  } else {
    console.log("Browser does support notifications.");
    console.log(window.Notification.permission);
    if (window.Notification.permission === "granted") {
      console.log("We have permission!");
    } else if (window.Notification.permission !== "denied") {
      window.Notification.requestPermission().then((permission) => {
        console.log(permission);
      });
    }
    // display message here
  }
  socket.emit("loadstart", 0, perpage);
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

////////////////////////////
socket.on("upload", (msg) => {
  let newmsg = msg.username + " เพิ่มภาพ";

  showMsg(newmsg, "เพิ่มข้อมูล");
  picture.addEntry(msg);
});

socket.on("deletePicture", (msg) => {
  showMsg(msg.pic.pic, "ลบข้อมูล");
  let pics = document.querySelectorAll("#btnDel");
  pics.forEach((pic) => {
    if (msg.pic.pic !== pic.dataset.pic) return;
    console.log(pic.dataset.pic);
    pic.closest("tr").remove();
  });
});

socket.on("message", (msg) => {
  console.log(msg);
});
/////////////////////////////////////////////////
socket.on("loadlast", async (msg) => {
  await loadpic.load(msg);

  const images = document.querySelectorAll("[data-src]");
  const imageOption = {};

  const imgobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) return;
      preloadingimage(entry.target);
      imgobseve.unobserve(entry.target);
    });
  }, imageOption);

  function preloadingimage(img) {
    let src = img.getAttribute("data-src");
    if (!src) return;
    loadImage(src).then((images) => {
      img.innerHTML = images.outerHTML;
    });
  }

  images.forEach((image) => {
    imgobseve.observe(image);
  });

  ///////////////////////////////

  const epage = document.getElementById("page");
  const pageobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadnextpage(entry.target);
      pageobseve.unobserve(entry.target);
    });
  }, imageOption);

  function loadnextpage(page) {
    let nextpage = page.getAttribute("data-page");
    nextpage++;
    let totalpage = page.getAttribute("data-total");
    if (nextpage > totalpage - 1) return;
    socket.emit("loadstart", nextpage, perpage);
  }

  pageobseve.observe(epage);
});

async function loadImage(imageUrl) {
  let img;
  const imageLoadPromise = new Promise((resolve) => {
    img = new Image();
    img.onload = resolve;

    img.classList = "img-fluid";
    img.src = imageUrl;
  });

  await imageLoadPromise;
  console.log("image loaded");
  return img;
}

document.getElementById("bell").addEventListener("click", () => {
  let bellnum = document.getElementById("bellnum");
  bellnum.innerText = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
  //console.log("bel click");
});
