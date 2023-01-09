export const btnEvent = function (socket) {
  document.querySelectorAll("#btnDetail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // showdisforEdit = false;
      let payload = {
        id_de: e.target.dataset.id_de,
        id_upload: e.target.dataset.id_upload,
      };
      socket.emit("showdis", payload);
    });
  });

  document.querySelectorAll("#btneditDetail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // showdisforEdit = true;
      let payload = {
        id_de: e.target.dataset.id_de,
        id_upload: e.target.dataset.id_upload,
      };
      socket.emit("showdis", payload);
    });
  });
};
