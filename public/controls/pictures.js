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
        for (const entry of entries) {
            this.addEntry(entry);
        }
    }

    addEntry(entry = {}) {

        this.root.querySelector(".entries").insertAdjacentHTML("afterbegin", BudgetTracker.entryHtml());
        let row = this.root.querySelector(".entries tr:first-of-type");
      
        let type = entry.type.split("/")

        if(type[0]==="image") {
            row.querySelector("#picture").innerHTML = `
            <span>${entry.type}</span>
            <img src='uploads/${entry.filename}' width='300' >
            `  || "";
            
        } else {
            row.querySelector("#picture").innerHTML = `
            <span>${entry.type}</span>
           <a target='_new' href='uploads/${entry.filename}' >${type[1]}</a>
            `  || "";


        }
        row.querySelector("#btnDel").dataset.pic = entry.filename
        row.querySelector("#btnDel").addEventListener("click", (e) => {
            this.onDeleteEntryBtnClick(e);
          });
    }

    save(e) {
    }

    onDeleteEntryBtnClick(e) {
       // console.log(e.target.dataset.pic);
        socket.emit("deletepic",e.target.dataset.pic)
        e.target.closest("tr").remove();
      }

}