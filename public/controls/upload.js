import uuid from "./uuid.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import imageresize from "./imageresize.js";
const socket = io();
const TUMPIC = 1248;
export default class Upload {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = Upload.html();
    this.id = "";
    this.username = "";
  }

  static html() {
    return `
    <div class="parea"></div>
    `;
  }

  static entryHtml(id, file) {
    return `
    <li class="row">
      <section class="progress-area">
        <div class="content">
            <div class="details">
              <div id="tum${id}" class="name"></div>
              <div id="filename${id}" class="name"><span>${file}</span></div>
              <span id="percen${id}" class="percen">${id}</span>
            </div>
            <div class="progress-bar">
              <div id="process${id}" class="progress" style=""></div>
            </div>
          </div>
        </div>
      </section>
    </li>
 `;
  }

  static sendIO(entry = {}) {
    console.log(entry);
    socket.emit("upload", entry);
  }

  updateEntry(entry = {}) {
    let idname = `#percen${entry.idload}`;
    let idprocess = `#process${entry.idload}`;
    const percent = this.root.querySelector(idname);
    const progress = this.root.querySelector(idprocess);
    percent.innerHTML = entry.fileLoaded + "% " + entry.status;
    progress.style.width = `${entry.fileLoaded}%`;
  }

  endEntry(entry = {}) {
    let idname = `#percen${entry.idload}`;
    let idprocess = `#process${entry.idload}`;
    let filename = `#filename${entry.idload}`;
    let tumname = `#tum${entry.idload}`;
    const percent = this.root.querySelector(idname);
    const progress = this.root.querySelector(idprocess);
    const fname = this.root.querySelector(filename);
    const tum = this.root.querySelector(tumname);
    percent.innerHTML = entry.fileLoaded + "% " + entry.status;
    progress.style.width = `${entry.fileLoaded}%`;
    progress.style.background = `green`;
    setTimeout(() => {
      percent.style.display = `none`;
      progress.style.display = `none`;
      fname.style.display = `none`;
      tum.style.display = `none`;
    }, 1000);
  }

  loadall(file) {
    this.id = file.id;
    this.username = file.username;
    for (var i = 0; i < file.length; i++) {
      let rand = Math.round(Math.random() * 400);
      this.loadEatch(rand, file[i]);
    }
  }

  async loadEatch(idload, file) {
    function getFileName(str) {
      if (str.length > 22) {
        return str.substr(0, 11) + "..." + str.substr(-11);
      }
      return str;
    }
    let vname = await getFileName(file.name);

    await this.root
      .querySelector(".parea")
      .insertAdjacentHTML("beforeend", Upload.entryHtml(idload, vname));
    let type = file.type.split("/");
    if (type[0] === "image") {
      let filesize = Math.round(file.size / 1024 / 1024);
      if (filesize > 2) {
        this.postimageprofile(idload, file);
      } else {
        this.tumimage(idload, file);
        this.load(idload, file, file);
      }
    } else {
      this.load(idload, file, file);
    }
  }

  load(idload, file, data) {
    const fread = new FileReader();

    fread.readAsArrayBuffer(file);

    fread.onload = async (ev) => {
      ////////////////////////
      const CHANK_SIZE = 10000;
      const chankCount = ev.target.result.byteLength / CHANK_SIZE;
      const fname = data.name.split(".");
      const lastname = data.type;
      const newname = uuid() + "." + fname[fname.length - 1];
      for (let chankId = 0; chankId < chankCount; chankId++) {
        const chauk = ev.target.result.slice(
          chankId * CHANK_SIZE,
          chankId * CHANK_SIZE + CHANK_SIZE
        );

        await fetch("http://vanikthai.com/upload", {
          method: "POST",
          headers: {
            "content-type": "application/octec-stream",
            "content-length": chauk.length,
            "file-name": "_delete_" + newname,
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
      const theuser = document.getElementById("userset").dataset.user;
      let us = JSON.parse(theuser);
      this.endEntry(payload);
      let paySend = {
        filename: newname,
        type: lastname,
        id: us.name.id,
        username: us.name.username,
      };
      Upload.sendIO(paySend);
      /////////////////////////////
    };
  }
  postimageprofile(id, file) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      async () => {
        const uri = reader.result;
        imageresize(uri, TUMPIC)
          .then((img) => {
            let aimg = document.createElement("img");
            aimg.src = img;
            aimg.style = "width:50px;border: 1px solid red";
            document.getElementById(`tum${id}`).appendChild(aimg);
            fetch(img)
              .then((res) => res.blob())
              .then((bob) => {
                this.load(id, bob, file);
              });
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
  tumimage(id, file) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      async () => {
        const uri = reader.result;
        imageresize(uri, TUMPIC)
          .then((img) => {
            let aimg = document.createElement("img");
            aimg.src = img;
            aimg.style = "width:50px";
            document.getElementById(`tum${id}`).appendChild(aimg);
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
}
