import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();

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
                <td>
                    <button type="button"  class="btn-rounded" id="btnDel" style="position: absolute;z-index: 2;right:10px;border-radius: 50%;"><i id="btnData"  class="fa fa-trash" aria-hidden="true"></i></button>
                    <div id="picture" >
                    </div>
                </td>
            </tr>
        `;
  }

  load(entries) {
    BudgetTracker.entryHtml();
    for (const entry of entries) {
      // console.log(entry);
      this.addEntry(entry);
    }
  }

  addEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());
    let row = this.root.querySelector(".entries tr:last-of-type");

    let type = entry.fileType.split("/");
    if (type[0] === "image") {
      row.querySelector("#picture").innerHTML =
        `
        <div  data-src='uploads/${entry.uploadName}' >
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        </div>
            ` || "";
    } else {
      row.querySelector("#picture").innerHTML =
        `
           <a target='_new' href='uploads/${entry.uploadName}' >${type[0]}</a>
            ` || "";
    }
    row.querySelector("#btnData").dataset.pic = entry.uploadName;
    row.querySelector("#btnDel").addEventListener("click", (e) => {
      this.onDeleteEntryBtnClick(e);
    });
  }

  save(e) {}

  onDeleteEntryBtnClick(e) {
    if (!e.target.dataset.pic) return;

    socket.emit("deletepic", e.target.dataset.pic);
    e.target.closest("tr").remove();
  }
  async loadImage(imageUrl) {
    let img;
    const imageLoadPromise = new Promise((resolve) => {
      img = new Image();
      img.onload = resolve;
      img.src = imageUrl;
    });

    await imageLoadPromise;
    console.log("image loaded");
    return img;
  }
}
