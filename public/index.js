import socket from "./controls/socket.js";
import Picture from "./controls/pictures.js";
import Loadpic from "./controls/loadpic.js";
const picture = new Picture("#pictures");
const loadpic = new Loadpic("#pictures");

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("loadstart", 30);
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
    // console.log(src);

    //  img.src = src;

    loadImage(src).then((images) => {
      img.innerHTML = images.outerHTML;
    });
  }

  images.forEach((image) => {
    imgobseve.observe(image);
  });
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
