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
                    <div id="picture" > </div
                </td>
                <td>
                <div id="datadel"></div>
                <button type="button" id="btnDel" class="delete-entry">&#10005;</button>
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
            <span>${entry.fileType}</span>
            <img src='uploads/${entry.uploadName}' width='300' >
            ` || "";
    } else {
      row.querySelector("#picture").innerHTML =
        `
            <span>${type[0]}</span>
           <a target='_new' href='uploads/${entry.uploadName}' >${type[0]}</a>
            ` || "";
    }
    row.querySelector("#btnDel").dataset.pic = entry.uploadName;
    row.querySelector("#btnDel").addEventListener("click", (e) => {
      this.onDeleteEntryBtnClick(e);
    });
  }

  save(e) {}

  onDeleteEntryBtnClick(e) {
    // console.log(e.target.dataset.pic);
    socket.emit("deletepic", e.target.dataset.pic);
    e.target.closest("tr").remove();
  }
}
