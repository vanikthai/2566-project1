import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
import tdate from "./tdate.js";
export default class BudgetTracker {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = BudgetTracker.html();
  }

  static html() {
    return `
            <table class="budget-tracker">
                <thead>
                    <tr>
                        <th>pictures</th>
                    </tr>
                </thead>
                <tbody class="entries"></tbody>
        `;
  }

  static entryHtml() {
    return `
            <tr>
                <td style="height:300px">
                    <div id="title"></div>
                    <button type="button"  class="btn-rounded" id="btnDel" style="position: absolute;z-index: 2;right:10px;border-radius: 50%;"><i id="btnData"  class="fa fa-trash" aria-hidden="true"></i></button>
                    <button type="button"  class="btn-rounded" id="btnDownload" style="position: absolute;z-index: 2;right:50px;border-radius: 50%;"><i id="btnDataDownload"  class="fa fa-download" aria-hidden="true"></i></button>
                    <div id="picture"></div>
                </td>
            </tr>
        `;
  }
  load(entries) {
    for (const entry of entries) {
      this.addEntry(entry);
    }
  }

  addEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("afterbegin", BudgetTracker.entryHtml());
    let row = this.root.querySelector(".entries tr:first-of-type");
    let title = this.root.querySelector("#title");
    let type = entry.type.split("/");

    if (type[0] === "image") {
      //////////////

      row.querySelector("#picture").innerHTML =
        `
        <div  data-src='uploads/${entry.filename}' >
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        </div>
            ` || "";
      title.innerHTML = ` ${entry.username}[news] ${tdate(new Date())}`;

      let src = `uploads/${entry.filename}`;
      loadImage(src).then((images) => {
        row.querySelector("#picture").innerHTML = images.outerHTML;
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

        return img;
      }

      ////////////////////////////////////
    } else {
      row.querySelector("#picture").innerHTML =
        `
            <span>${entry.type}</span>
           <a target='_new' href='uploads/${entry.filename}' >${type[1]}</a>
            ` || "";
    }
    row.querySelector("#btnData").dataset.pic = entry.filename;
    row.querySelector("#btnDel").dataset.pic = entry.filename;
    row.querySelector("#btnDataDownload").dataset.pic = entry.filename;
    row.querySelector("#btnDel").addEventListener("click", (e) => {
      let text = "(ต้องการลบข้อมุลหรือไม่!";
      if (confirm(text) == true) this.onDeleteEntryBtnClick(e);
    });
    row.querySelector("#btnDownload").addEventListener("click", (e) => {
      console.log("bonclick");
      this.onDownloadEntryBtnClick(e);
    });
  }

  save(e) {}

  onDownloadEntryBtnClick(e) {
    let pname = e.target.dataset.pic;
    console.log(pname);
    if (!pname) return;
    let a = document.createElement("a");
    a.href = "/uploads/" + pname;
    a.download = pname;
    a.click();
  }

  onDeleteEntryBtnClick(e) {
    if (!e.target.dataset.pic) return;
    socket.emit("deletepic", e.target.dataset.pic);
    e.target.closest("tr").remove();
  }
}
