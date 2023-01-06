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
                    <nav class="navbar navbar-light bg-light">
                        <div class="container-fluid">
                          <a class="navbar-brand"><div id="titlebar"></div></a>
                          <form class="d-flex">
                          <a id="btnDetail" class="dropdown-item" style="cursor: pointer;" >รายละเอียด</a>
                            <div class="nav-item dropstart">
                              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                                </svg>
                              </a>
                              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                              <li><a id="btnDownload" class="dropdown-item" style="cursor: pointer;" >Download</a></li>
                              <li><a id="btneditDetail" class="dropdown-item" style="cursor: pointer;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" >แก้ไขรายละเอียด</a></li>
                              <li><hr class="dropdown-divider"></li>
                              <li><a id="btnDel" class="dropdown-item" style="cursor: pointer;" >ลบ</a></li>
                              </ul>
                            </li>
                            </div>       
                          </form>
                        </div>
                    </nav>
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

  addEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());
    let row = this.root.querySelector(".entries tr:last-of-type");
    let type = entry.fileType.split("/");
    let sdate = tdate(entry.date);
    if (type[0] === "image") {
      row.querySelector("#titlebar").innerHTML = `${entry.user} `;
      row.querySelector("#picture").innerHTML =
        `${sdate} [${entry.id_upload}]
        <figure>
        <div id="imgsload"  data-src='uploads/${entry.uploadName}' >
        <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div> 
        </div> 
        <figcaption><div id="detail${entry.id_upload}"></div></figcaption>
        </figure> 
            ` || "";
    } else {
      row.querySelector("#picture").innerHTML =
        `<a target='_new' href='uploads/${entry.uploadName}' download >${type[0]}</a>` ||
        "";
    }
    row.querySelector("#btneditDetail").dataset.id_upload = entry.id_upload;
    row.querySelector("#btneditDetail").dataset.id_de = entry.id_de;
    row.querySelector("#btnDetail").dataset.id_upload = entry.id_upload;
    row.querySelector("#btnDetail").dataset.id_de = entry.id_de;
    row.querySelector("#btnDownload").dataset.pic = entry.uploadName;
    row.querySelector("#btnDel").dataset.pic = entry.uploadName;
    row.querySelector("#btnDel").dataset.user = entry.user;
    this.root.querySelector("#page").dataset.page = entry.page;
    this.root.querySelector("#page").dataset.total = entry.tpages;
    row.querySelector("#btnDel").addEventListener("click", (e) => {
      let text = "(ต้องการลบข้อมุลหรือไม่!";
      if (confirm(text) == true) this.onDeleteEntryBtnClick(e);
    });
    row.querySelector("#btnDownload").addEventListener("click", (e) => {
      this.onDownloadEntryBtnClick(e);
    });
    // row.querySelector("#btnDetail").addEventListener("click", (e) => {
    //   this.detailBtnClick(e);
    // });
  }

  // detailBtnClick(e) {
  //   let payload = {
  //     id_de: e.target.dataset.id_de,
  //     id_upload: e.target.dataset.id_upload,
  //   };
  //   console.log(payload);
  //   socket.emit("showdis", payload);
  // }

  onDeleteEntryBtnClick(e) {
    let theuser = document.getElementById("userset").dataset.user;
    const data = JSON.parse(theuser);
    let payload = {
      pic: e.target.dataset.pic,
      user: e.target.dataset.user,
    };
    if (!e.target.dataset.pic) return;
    if (data.name.kind === "admin") {
      socket.emit("deletepic", payload);
    } else {
      if (e.target.dataset.user !== data.name.username) return;
      socket.emit("deletepic", payload);
    }

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
