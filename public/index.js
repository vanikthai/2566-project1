import socket from "./controls/socket.js";
import Picture from "./controls/pictures.js";
import Loadpic from "./controls/loadpic.js";
import { showMsg } from "./submain/showmsg.js";
const picture = new Picture("#pictures");
const loadpic = new Loadpic("#pictures");
const perpage = 10;
let showdisforEdit = false;
let timestop = true;
document.addEventListener("DOMContentLoaded", () => {
  socket.emit("loadstart", 0, perpage);
});

////////////////////////////
socket.on("upload", (msg) => {
  let newmsg = msg.username + " เพิ่มภาพ";
  showMsg(newmsg, "เพิ่มข้อมูล");
  picture.addEntry(msg);
  btnEvent();
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
  showMsg(msg, "ปรับปรุงข้อมูล");
});

socket.on("updateDescription", (msg) => {
  showMsg("ปรับปรุงรายละเอียดเรียบร้อย", "ปรับปรุงข้อมูล");
  console.log(msg);
});

socket.on("showdis", (msg) => {
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
});

/////////////////////////////////////////////////
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

socket.on("loadlast", async (msg) => {
  await loadpic.load(msg);

  btnEvent();
  imgobseve();
  nextpageobser();
  //figcaption_obsere();
});

function figcaption_obsere() {
  const figcaps = document.querySelectorAll("figcaption");
  let pageOption = {};
  const figobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) {
        timestop = true;
        return;
      }
      // loadnextpage(entry.target);
      let payload = {
        id_de: entry.target.dataset.id_de,
        id_upload: entry.target.dataset.id_upload,
      };

      setTimeout(() => {
        timestop = false;
        console.log("show");
        if (!timestop) socket.emit("showdis", payload);
      }, 2000);
      //console.log(entry.target);
      figobseve.unobserve(entry.target);
    });
  }, pageOption);
  figcaps.forEach((figcap) => {
    figobseve.observe(figcap);
  });
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
    socket.emit("loadstart", nextpage, perpage);
  }

  pageobseve.observe(epage);
}
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
    let src = img.getAttribute("data-src");
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

document.getElementById("bell").addEventListener("click", () => {
  let bellnum = document.getElementById("bellnum");
  bellnum.innerText = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
  //console.log("bel click");
});

document.getElementById("btnto").addEventListener("click", (e) => {
  nextPrev(4);
  document.getElementById("selectline").value = 1;
  document.getElementById("selectdistrip").value = "";
});

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

////////////////////////
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "สิ้นสุด";
  } else {
    document.getElementById("nextBtn").innerHTML = "ต่อไป";
  }
  fixStepIndicator(n);
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  //if (n == 1 && !validateForm()) return false;
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  if (currentTab >= x.length) {
    if (currentTab === 3) btnUpdateDestrip();
    currentTab = 0;
    showTab(currentTab);
    // document.getElementById("regForm").submit();
    return false;
  }
  showTab(currentTab);
}

function fixStepIndicator(n) {
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}
// //////////////////////////

document.getElementById("prevBtn").addEventListener("click", () => {
  nextPrev(-1);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  nextPrev(1);
});
