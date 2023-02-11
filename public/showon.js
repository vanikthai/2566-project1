import socket from "./controls/socket.js";
import Loadpic from "./controls/loadpic.js";
import addHeadlineMenu from "./controls/addHeadlineMenu.js";
const loadpic = new Loadpic("#pictures");
const perpage = 10;
let showdisforEdit = false;
let timestop = true;
const id_de = JSON.parse(document.getElementById("dataset").dataset.id);

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("showon", 0, perpage, id_de);
  socket.emit("loadhead");
});

document.getElementById("btnSave").addEventListener("click", () => {
  document.getElementById("btnClose").click();
  // if (!showdisforEdit) return;
  let des = document.getElementById("selectdistrip");
  let id_head = des.dataset.id_head;
  let id_de = des.dataset.id_de;
  let descriptions = des.value;
  let payload = {
    id_de,
    id_head,
    descriptions,
  };
  socket.emit("updateDescription", payload);
  // showdisforEdit = false;
  des.value = "";
});
socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("showon", (data) => {
  loadpic.load(data);
  imgobseve();
  nextpageobser();
  btnEvent();
});
socket.on("showdis", (msg) => {
  if (showdisforEdit) {
    //  nextPrev(4);
    // document.getElementById("selectline").value = msg[0].id_head;
    let des = document.getElementById("selectdistrip");
    des.value = msg[0].descriptions;
    des.dataset.id_de = msg[0].id_de;
    des.dataset.id_head = msg[0].id_head;
  } else {
    let id = `detail${msg[0].id_upload}`;
    let detail = document.getElementById(id);
    let content = decodeURI(msg[0].descriptions);
    detail.innerHTML = msg[0].head + "<br/>" + content;
  }
});

socket.on("loadhead", (data) => {
  addHeadlineMenu(data);
});
function imgobseve() {
  const images = document.querySelectorAll("[data-src]");
  let imageOption = {};

  let imgobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) return;
      preloadingimage(entry.target);
      imgobseve.unobserve(entry.target);
    });
  }, imageOption);

  function preloadingimage(img) {
    let src = "../" + img.getAttribute("data-src");
    if (!src) return;
    loadImage(src).then((images) => {
      img.innerHTML = images.outerHTML;
    });
  }

  images.forEach((image) => {
    imgobseve.observe(image);
  });
}

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

function nextpageobser() {
  let pageOption = {};
  const epage = document.getElementById("page");
  const pageobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadnextpage(entry.target);
      pageobseve.unobserve(entry.target);
    });
  }, pageOption);

  function loadnextpage(page) {
    let nextpage = page.getAttribute("data-page");
    nextpage++;
    let totalpage = page.getAttribute("data-total");
    if (nextpage > totalpage - 1) return;
    socket.emit("showon", nextpage, perpage, id_de);
  }

  pageobseve.observe(epage);
}

function btnEvent() {
  document.querySelectorAll("#btnDetail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      showdisforEdit = false;
      let payload = {
        id_de: e.target.dataset.id_de,
        id_upload: e.target.dataset.id_upload,
      };
      socket.emit("showdis", payload);
    });
  });

  document.querySelectorAll("#btneditDetail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      showdisforEdit = true;
      let payload = {
        id_de: e.target.dataset.id_de,
        id_upload: e.target.dataset.id_upload,
      };
      socket.emit("showdis", payload);
    });
  });
}
