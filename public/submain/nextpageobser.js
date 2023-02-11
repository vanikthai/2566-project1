export function nextpageobser(socket, perpage) {
  let pageOption = {};
  const epage = document.getElementById("page");
  const pageobseve = new IntersectionObserver((entrys, Observe) => {
    entrys.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadnextpage(entry.target);
      pageobseve.unobserve(entry.target);
    });
  }, pageOption);

  function loadnextpage(page) {
    let nextpage = page.getAttribute("data-page");
    nextpage++;
    let totalpage = page.getAttribute("data-total");
    if (nextpage > totalpage - 1) return;
    socket.emit("loadstart", nextpage, perpage);
  }

  pageobseve.observe(epage);
}
