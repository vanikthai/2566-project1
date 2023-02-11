import socket from "./controls/socket.js";
import addDedctip from "./controls/addDesctip.js";
import addHeadlineMenu from "./controls/addHeadlineMenu.js";
const descrip = {
  pages: 10,
  onpage: 0,
  toalpages: 0,
  curpage: 0,
  findtext: "",

  get payload() {
    return {
      pages: this.pages,
      page: this.onpage,
    };
  },

  set page(val) {
    this.onpage = val + 1;
  },
  findHeadline() {
    socket.emit("findHeadline", this.findtext);
  },

  showdataid() {
    socket.emit("headline", this.payload);
    socket.emit("loadhead");
  },
  clearNullDescription() {
    socket.emit("delnull_description");
  },
  loadstart() {
    this.clearNullDescription();
    this.showdataid();
  },
};

document.addEventListener("DOMContentLoaded", descrip.loadstart());

document.getElementById("finddescrip").addEventListener("submit", finddescrip);

socket.on("headline", headline);
socket.on("findHeadline", findHeadline);
socket.on("headlineadd", headlineadd);
socket.on("loadhead", addHeadlineMenu);

socket.on("message", (data) => {
  console.log(data);
});

socket.on("delnull_description", (data) => {
  console.log(data);
});

function finddescrip(e) {
  e.preventDefault();
  descrip.findtext = document.getElementById("findText").value;
  //console.log(descrip.findtext);
  descrip.findHeadline();
}

function headline(data) {
  if (data.length > 0) {
    data.forEach((el) => {
      new addDedctip(el);
      descrip.page = el.page;
      descrip.curpage = el.curpage;
      descrip.toalpages = el.tpages;
    });
    nextpageobser();
  }
}

function findHeadline(data) {
  // console.log(data);
  document.getElementById("listdata").innerHTML = "";
  data.forEach((el) => {
    new addDedctip(el);
    descrip.page = el.page;
    descrip.curpage = el.curpage;
    descrip.toalpages = el.tpages;
  });
}

function headlineadd(data) {
  let payload = {
    kind: "first",
    ...data,
  };
  new addDedctip(payload);
}

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
    socket.emit("headline", descrip.payload);
  }

  pageobseve.observe(epage);
}
