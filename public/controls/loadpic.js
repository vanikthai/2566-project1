import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import tdate from "./tdate.js";
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
                <tfoot class="pagesentries">
                  <tr>
                    <td>
                      <div id="page">สิ้นสุดข้อมูล</div>
                    </td>
                  </tr>
                </tfoot>
        `;
  }

  static entryHtml() {
    return `
            <tr>
                <td style="height:300px">
                    <button type="button"  class="btn-rounded" id="btnDel" style="position: absolute;z-index: 2;right:10px;border-radius: 50%;"><i id="btnData"  class="fa fa-trash" aria-hidden="true"></i></button>
                    <button type="button"  class="btn-rounded" id="btnDownload" style="position: absolute;z-index: 2;right:50px;border-radius: 50%;"><i id="btnDataDownload"  class="fa fa-download" aria-hidden="true"></i></button>
                    <div id="picture"></div>
                </td>
            </tr>
        `;
  }

  load(entries) {
    // BudgetTracker.entryHtml();
    for (const entry of entries) {
      this.addEntry(entry);
    }
  }

  addNew(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("afterbegin", BudgetTracker.entryHtml());
    row = this.root.querySelector(".entries tbody:first-of-type");

    let type = entry.fileType.split("/");
    let sdate = tdate(entry.date);
    if (type[0] === "image") {
      row.querySelector("#picture").innerHTML =
        `
        ${entry.user}[${entry.id_upload}] ${sdate}
        <div  data-src='uploads/${entry.uploadName}' >
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div> 
        </div> 
            ` || "";
    } else {
      row.querySelector("#picture").innerHTML =
        `<a target='_new' href='uploads/${entry.uploadName}' download >${type[0]}</a>` ||
        "";
    }
    row.querySelector("#btnDownload").dataset.pic = entry.uploadName;
    row.querySelector("#btnDataDownload").dataset.pic = entry.uploadName;
    row.querySelector("#btnData").dataset.pic = entry.uploadName;
    this.root.querySelector("#page").dataset.page = entry.page;
    this.root.querySelector("#page").dataset.total = entry.tpages;
    row.querySelector("#btnDel").addEventListener("click", (e) => {
      let text = "(ต้องการลบข้อมุลหรือไม่!";
      if (confirm(text) == true) this.onDeleteEntryBtnClick(e);
    });
    row.querySelector("#btnDownload").addEventListener("click", (e) => {
      console.log("bonclick");
      this.onDownloadEntryBtnClick(e);
    });
  }

  addEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());
    let row = this.root.querySelector(".entries tr:last-of-type");
    let type = entry.fileType.split("/");
    let sdate = tdate(entry.date);
    if (type[0] === "image") {
      row.querySelector("#picture").innerHTML =
        `
        ${entry.user}[${entry.id_upload}] ${sdate}
        <div  data-src='uploads/${entry.uploadName}' >
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        </div> 
            ` || "";
    } else {
      row.querySelector("#picture").innerHTML =
        `<a target='_new' href='uploads/${entry.uploadName}' download >${type[0]}</a>` ||
        "";
    }
    row.querySelector("#btnDownload").dataset.pic = entry.uploadName;
    row.querySelector("#btnDataDownload").dataset.pic = entry.uploadName;
    row.querySelector("#btnData").dataset.pic = entry.uploadName;
    row.querySelector("#btnDel").dataset.pic = entry.uploadName;
    this.root.querySelector("#page").dataset.page = entry.page;
    this.root.querySelector("#page").dataset.total = entry.tpages;
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

  onDeleteEntryBtnClick(e) {
    if (!e.target.dataset.pic) return;

    socket.emit("deletepic", e.target.dataset.pic);
    e.target.closest("tr").remove();
  }

  onDownloadEntryBtnClick(e) {
    let pname = e.target.dataset.pic;
    if (!pname) return;
    let a = document.createElement("a");
    a.href = "/uploads/" + pname;
    a.download = pname;
    a.click();
  }

  onDeleteRes(data) {
    let pics = this.root.querySelector("btnDel");
    pics.forEach((pic) => {
      if (data !== pic.dataset.pic) return;
      console.log(pic.dataset.pic);
      pic.target.closest("tr").remove();
    });
  }
}
