import tdate from "./tdate.js";

export default class addDedctip {
  constructor(payload) {
    this.head = payload.head || "new";
    this.descriptions = payload.descriptions;
    this.indate = payload.indate || new Date();
    this.id_de = payload.id_de;
    this.kind = payload.kind || "after";
    this.listdata = document.getElementById("listdata");
    if (this.kind === "after") {
      this.listdata.appendChild(this.card());
    } else {
      listdata.insertBefore(this.card(), listdata.firstChild);
    }
    let next = document.getElementById("nextdata");
    next.dataset.nexpage = payload.page + 1;
    next.dataset.total = payload.tpages;
    next.dataset.id_head = payload.id_head;
  }

  card() {
    let col = document.createElement("div");
    col.className = "col";
    let card = document.createElement("card");
    card.className = "card";

    card.appendChild(this.title());
    card.appendChild(this.cbody());
    card.appendChild(this.footer());

    col.appendChild(card);
    return col;
  }

  //let img = document.createElement("img");
  //img.className = "card-img-top";
  //img.src = "...";
  cbody() {
    let cardbody = document.createElement("div");
    cardbody.className = "card-body";
    cardbody.appendChild(this.desctiption());
    return cardbody;
  }

  title() {
    let cardtitle = document.createElement("div");
    cardtitle.className = "card-header text-white bg-secondary";
    cardtitle.innerText = this.head;
    return cardtitle;
  }

  desctiption() {
    let cardtext = document.createElement("p");
    cardtext.className = "card-text";
    cardtext.innerText = this.descriptions;
    return cardtext;
  }

  footer() {
    let cardfooter = document.createElement("div");
    cardfooter.className = "card-footer";
    cardfooter.appendChild(this.showdate());
    cardfooter.appendChild(this.showmore());
    return cardfooter;
  }

  showdate() {
    let small = document.createElement("small");
    small.className = "text-muted";
    small.innerText = tdate(this.indate);
    return small;
  }

  showmore() {
    let justend = document.createElement("div");
    let btn = document.createElement("a");
    btn.className = "btn btn-secondary btn-sm";
    btn.dataset.id_de = this.id_de;
    btn.innerText = "เพิ่มเติม";
    btn.href = "/showon/" + this.id_de;
    justend.className = "float-end";
    justend.appendChild(btn);
    return justend;
  }
}
