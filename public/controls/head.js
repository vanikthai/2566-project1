export default class Head {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = Head.html();
  }

  static html() {
    return `
            <table class="table table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>หัวเรื่อง</th>
                        <th>ลบ</th>
                        <th>แก้ไข</th>
                    </tr>
                    
                    
                </thead>
                <tbody class="entries"></tbody>
        `;
  }

  static entryHtml() {
    return `
               <tr>
                <td>
                        <div id="head" > </div
                </td>
                <td>    
                        <button type="button" id="btnDelete" class="btn btn-danger btn-floating">
  ลบ
                        </button>
                </td>
                <td>    
                        
                        <button id="btnUpdate" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">แก้ไข</button>
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
      .insertAdjacentHTML("beforeend", Head.entryHtml());
    let row = this.root.querySelector(".entries tr:last-of-type");

    row.querySelector("#head").innerHTML = entry.head || "";
    row.querySelector("#head").dataset.id = entry.id_head || 0;
    row.querySelector("#btnDelete").dataset.id = entry.id_head || 0;
    row.querySelector("#btnUpdate").dataset.id = entry.id_head || 0;
    row.querySelector("#btnUpdate").dataset.data = entry.head || 0;
    // row.querySelector("#btnDelete").addEventListener("click", (e) => {
    //   let text = "(ต้องการลบข้อมุลหรือไม่!";
    //   if (confirm(text) == true) this.onDeleteEntryBtnClick(e);
    // });
  }
  //   onDeleteEntryBtnClick(e) {
  //     let id = e.target.closest("button").dataset.id;
  //     if (!id) return;
  //     socket.emit("delhead", id);
  //     console.log(id);

  //     e.target.closest("tr").remove();
  //   }
}
