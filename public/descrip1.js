import socket from "./controls/socket.js";
import addDedctip from "./controls/addDesctip.js";

const descrip = {
  id_head: JSON.parse(document.getElementById("dataset").dataset.id),
  pages: 5,
  onpage: 0,
  toalpages: 0,
  curpage: 0,

  get payload() {
    return {
      id_head: this.id_head,
      pages: this.pages,
      page: this.onpage,
    };
  },

  set page(val) {
    this.onpage = val + 1;
  },

  showdataid() {
    socket.emit("sohwDisId", this.payload);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  descrip.showdataid();
});

socket.on("sohwDisId", (data) => {
  if (data.length > 0) {
    data.forEach((el) => {
      new addDedctip(el);
      descrip.page = el.page;
      descrip.curpage = el.curpage;
      descrip.toalpages = el.tpages;
    });
    nextpageobser();
  }
});

socket.on("message", (data) => {
  console.log(data);
});

function nextpageobser() {
  let pageOption = {};
  const epage = document.getElementById("nextdata");
  const pageobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadnextpage(entry);
      pageobseve.unobserve(entry.target);
    });
  }, pageOption);

  function loadnextpage(entry) {
    let nexpage = entry.target.dataset.nexpage;
    let total = entry.target.dataset.total;
    if (nexpage > total) return;
    socket.emit("sohwDisId", descrip.payload);
  }

  pageobseve.observe(epage);
}
