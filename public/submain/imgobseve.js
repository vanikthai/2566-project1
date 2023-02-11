export function imgobseve() {
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
