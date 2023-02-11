export function figcaption_obsere() {
  const figcaps = document.querySelectorAll("figcaption");
  let pageOption = {};
  const figobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) {
        timestop = true;
        return;
      }
      // loadnextpage(entry.target);
      let payload = {
        id_de: entry.target.dataset.id_de,
        id_upload: entry.target.dataset.id_upload,
      };

      setTimeout(() => {
        timestop = false;
        console.log("show");
        if (!timestop) socket.emit("showdis", payload);
      }, 2000);
      //console.log(entry.target);
      figobseve.unobserve(entry.target);
    });
  }, pageOption);
  figcaps.forEach((figcap) => {
    figobseve.observe(figcap);
  });
}
