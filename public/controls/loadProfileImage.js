import imageresize from "./imageresize.js";
export default class PictureProfile {
  constructor(querySelectorString) {
    this.root = document.getElementById(querySelectorString);
    this.root.style.backgroundSize = "cover";
    this.root.style.backgroundPosition = "center";
    this.root.style.borderRadius = "50%";
    this.root.style.height = "60px";
    this.root.style.width = "60px";
    this.TUMPIC = 500;
    this.CHANK_SIZE = 10000;
    this.percent = document.querySelector("#percen");
    this.progress = document.querySelector("#process");
  }

  load(id) {
    let imgUrl = `https://vanikthai.com/users/${id}.jpg`;

    fetch(imgUrl)
      .then(() => {
        let img = `url(${imgUrl})`;
        this.root.style.backgroundImage = img;
      })
      .catch((e) => {
        this.root.innerHTML = "No Image";
      });
  }
  post(id, file) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      async () => {
        const uri = reader.result;
        imageresize(uri, this.TUMPIC)
          .then((img) => {
            fetch(img)
              .then((res) => res.blob())
              .then((bob) => {
                this.upload(id, bob, file);
              });
            let aimg = document.createElement("img");
            aimg.src = img;
            aimg.style = "width:120px;border: 1px solid red";
            this.root.innerHTML = "";
            this.root.appendChild(aimg);
          })
          .catch((e) => {
            console.log(e);
          });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  upload(idload, file, data) {
    const fread = new FileReader();
    fread.readAsArrayBuffer(file);
    fread.onload = async (ev) => {
      const chankCount = ev.target.result.byteLength / this.CHANK_SIZE;
      const fname = data.name.split(".");
      const sername = fname[fname.length - 1];
      const newname = idload + "." + sername.toLowerCase();

      for (let chankId = 0; chankId < chankCount; chankId++) {
        const chauk = ev.target.result.slice(
          chankId * this.CHANK_SIZE,
          chankId * this.CHANK_SIZE + this.CHANK_SIZE
        );

        await fetch("https://vanikthai.com/userspic", {
          method: "POST",
          headers: {
            "content-type": "application/octec-stream",
            "content-length": chauk.length,
            "file-name": newname,
          },
          body: chauk,
        });

        let fileLoaded = Math.round((chankId * 100) / chankCount, 0);

        let payload = {
          idload,
          status: "<i class='fas fa-cloud-upload-alt'></i>",
          fileLoaded,
        };
        this.updateEntry(payload);
      }
      let payload = {
        idload,
        status: "<i class='fas fa-check'></i>",
        fileLoaded: 100,
      };
      this.updateEntry(payload);
      console.log("https://vanikthai.com/users/" + newname);
    };
  }

  updateEntry(entry = {}) {
    this.percent.innerHTML = entry.fileLoaded + "% " + entry.status;
    this.progress.style.width = `${entry.fileLoaded}%`;
  }
}
