const resizeImageToSpecificWidth = (payload) => {
  let inputDataURI = payload.uri;
  let width = payload.TUMPIC;

  //return new Promise((resolve, reject) => {
  if (inputDataURI) {
    var img = inputDataURI;
    //  img.onload = function () {
    //  if (img.width > width) {
    var oc = document.createElement("canvas"),
      octx = oc.getContext("2d");
    oc.width = img.width;
    oc.height = img.height;
    octx.drawImage(img, 0, 0);
    while (oc.width * 0.5 > width) {
      oc.width *= 0.5;
      oc.height *= 0.5;
      octx.drawImage(oc, 0, 0, oc.width, oc.height);
    }
    oc.width = width;
    oc.height = (oc.width * img.height) / img.width;
    octx.drawImage(img, 0, 0, oc.width, oc.height);
    return oc.toDataURL("image/jpeg", 0.8);
    //   } else {
    //     return img;
    //  }
    //  };
    // img.src = inputDataURI;
  }
  // });
};

self.addEventListener("message", (payload) => {
  let resize = resizeImageToSpecificWidth(payload.data);
  //console.log(resize);
  postMessage(resize);
});
//export default resizeImageToSpecificWidth;
