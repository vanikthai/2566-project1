//import tdate from "./controls/tdate.js";
document.addEventListener("DOMContentLoaded", () => {
  let listgroup = document.getElementById("listdata");
  let dataset = JSON.parse(document.getElementById("dataset").dataset.des);

  dataset.forEach((data) => {
    let btn = document.createElement("button");
    btn.dataset.id_de = data.id_de;
    btn.dataset.username = data.username;
    btn.dataset.username = data.uuid;
    btn.innerHTML = data.descriptions;
    btn.className = "list-group-item list-group-item-action";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e.target.dataset.id_de);
    });
    listgroup.appendChild(btn);
  });
});
