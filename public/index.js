import socket from "./controls/socket.js";
import Picture from "./controls/pictures.js";
import Loadpic from "./controls/loadpic.js";
const picture = new Picture("#pictures");
const loadpic = new Loadpic("#pictures");
const perpage = 10;

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("loadstart", 0, perpage);
});

socket.on("upload", (msg) => {
  picture.addEntry(msg);
  console.log(msg);
});

socket.on("message", (msg) => {
  console.log(msg);
});

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
