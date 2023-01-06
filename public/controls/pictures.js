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
    for (const entry of entries) {
      this.addEntry(entry);
      console.log(entry);
    }
  }

  addEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("afterbegin", BudgetTracker.entryHtml());
    let row = this.root.querySelector(".entries tr:first-of-type");
    let title = this.root.querySelector("#titlebar");
    let type = entry.type.split("/");

    if (type[0] === "image") {
      title.innerHTML = ` ${entry.username}`;
      let sdate = tdate(new Date());
      let src = `uploads/${entry.filename}`;
      loadImage(src).then((images) => {
        row.querySelector("#picture").innerHTML =
          `${sdate} [${entry.id_upload}]
        <figure>
        ${images.outerHTML}
        <figcaption><div id="detail${entry.id_upload}"></div></figcaption>
        </figure> 
            ` || "";
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
    row.querySelector("#btneditDetail").dataset.id_upload = entry.id_upload;
    row.querySelector("#btneditDetail").dataset.id_de = entry.id_de;
    row.querySelector("#btnDetail").dataset.id_upload = entry.id_upload;
    row.querySelector("#btnDetail").dataset.id_de = entry.id_de;
    row.querySelector("#btnDel").dataset.pic = entry.filename;
    row.querySelector("#btnDel").dataset.user = entry.username;
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
}
