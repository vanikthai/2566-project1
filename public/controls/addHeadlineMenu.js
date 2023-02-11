export default function addHeadlineMenu(data) {
  let Headlistgroup = document.getElementById("Headlistgroup");
  let i = 0;
  data.forEach((el) => {
    i++;

    let btn = document.createElement("button");
    btn.dataset.id_head = el.id_head;
    btn.textContent = el.head;
    btn.className = "list-group-item list-group-item-action";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e.target.dataset.id_head);
      document.getElementById("closeDes").click();
      try {
        document.getElementById("mainnav").click();
      } catch {
        document.getElementById("mainnav1").click();
      }
      document.location =
        "http://vanikthai.com/descrip/" + e.target.dataset.id_head;
    });

    Headlistgroup.appendChild(btn);
  });
}
