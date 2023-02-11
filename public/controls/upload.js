import uuid from "./uuid.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import imageresize from "./imageresize.js";
const socket = io();
const TUMPIC = 1248;
const uploadfilesize = 1;
const CHANK_SIZE = 10000;
export default class Upload {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = Upload.html();
    this.total = 0;
    this.current = 0;
    this.imageupload = [];
    this.id_de = 0;
    this.id_head = 1;
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
              <div id="total_process${id}" class="progress" style=""></div>
              <div id="process${id}" class="progress" style=""></div>
            </div>
          </div>
        </div>
      </section>
    </li>
 `;
  }

  static sendIO(entry = {}) {
    socket.emit("upload", entry);
  }
  updateEntry(entry = {}) {
    let idname = `#percen${entry.idload}`;
    let idprocess = `#process${entry.idload}`;
    let total_process = `#total_process${entry.idload}`;
    let totalpercen = (this.current * 100) / this.total;
    const percent = this.root.querySelector(idname);
    const progress = this.root.querySelector(idprocess);
    const tprogress = this.root.querySelector(total_process);
    percent.innerHTML = entry.fileLoaded + "% " + entry.status;

    progress.style.width = `${entry.fileLoaded}%`;
    tprogress.style.background = `red`;
    tprogress.style.width = `${totalpercen}%`;
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
      percent.closest("li").remove();
    }, 1000);
  }

  loadall(payload) {
    let file = payload.files;
    this.id_de = payload.id_de;
    this.id_head = payload.id_head;
    let newimg = [];
    this.total = file.length;
    for (var i = 0; i < file.length; i++) {
      newimg = [file[i], ...newimg];
    }

    this.imageupload = newimg[Symbol.iterator]();
    this.loadEatch();
  }

  async loadEatch() {
    this.current++;
    let files = this.imageupload.next();
    if (files.done) return;
    let file = files.value;
    let idload =
      Math.round(Math.random() * 400) + Math.round(Math.random() * 400);
    let getFileName = (str) => {
      if (str.length > 22) {
        return (
          `[${this.current}/${this.total}] ${str.substr(0, 11)} ...` +
          str.substr(-11)
        );
      }
      return `[${this.current}/${this.total}] ` + str;
    };
    let vname = await getFileName(file.name);

    await this.root
      .querySelector(".parea")
      .insertAdjacentHTML("beforeend", Upload.entryHtml(idload, vname));
    let type = file.type.split("/");
    if (type[0] === "image") {
      let filesize = Math.round(file.size / 1024 / 1024);
      if (filesize > uploadfilesize) {
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

      const chankCount = ev.target.result.byteLength / CHANK_SIZE;
      const fname = data.name.split(".");
      const lastname = data.type;
      const newname = uuid() + "." + fname[fname.length - 1];
      for (let chankId = 0; chankId < chankCount; chankId++) {
        const chauk = ev.target.result.slice(
          chankId * CHANK_SIZE,
          chankId * CHANK_SIZE + CHANK_SIZE
        );

        await fetch("https://vanikthai.com/upload", {
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
        id_de: this.id_de,
        id_head: this.id_head,
      };
      Upload.sendIO(paySend);
      this.loadEatch();
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
