import tdate from "./shortDate.js";
export default class User {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = User.html();
  }

  static html() {
    return `
            <table class="budget-tracker">
                <thead>
                    <tr>
                        <th>USER</th>
                    </tr>
                    <tr>
                        <th>KIND</th>
                    </tr>
                </thead>
                <tbody class="entries"></tbody>
        `;
  }

  static entryHtml() {
    return `
               <tr>
                <td>
                    <div id="username" > </div
                </td>
                <td>
                    <select id="kind" class="input input-type">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="offline">offline</option>
                    </select>
                </td>
                <td> <button type="button" id="resetpass" class="btn btn-danger btn-floating">
  <i class="fas fa-magic"></i>
</button></td>
                <td>
                <div id="indate" ></div
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
      .insertAdjacentHTML("beforeend", User.entryHtml());
    let row = this.root.querySelector(".entries tr:last-of-type");

    row.querySelector("#username").innerHTML = entry.username || "";
    row.querySelector("#username").dataset.id = entry.uuid || 0;
    row.querySelector("#kind").value = entry.kind || "user";
    row.querySelector("#indate").innerHTML = tdate(entry.indate) || new Date();
  }
}
