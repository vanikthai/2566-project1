export default class Upload {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = Upload.html();
  }

  static html() {
    return `
    <div class="parea"></div>
    `;
  }

  static entryHtml(id, file) {
    return `
    <li class="row">
      <section class="progress-area">
        <div class="content">
            <div class="details">
              <span class="name">${file.name}</span>
              <span id="percen${id}" class="percen">${id}</span>
            </div>
            <div class="progress-bar">
              <div id="process${id}" class="progress" style="">process</div>
            </div>
          </div>
        </div>
      </section>
    </li>
 `;
  }

  updateEntry(entry = {}) {
    let idname = `#percen${entry.id}`;
    let idprocess = `#process${entry.id}`;
    const percent = this.root.querySelector(idname);
    const progress = this.root.querySelector(idprocess);
    percent.innerHTML = entry.fileLoaded + "% " + entry.status;
    progress.style.width = `${entry.fileLoaded}%`;
  }

  loadall(file) {
    for (var i = 0; i < file.length; i++) {
      this.loadEatch(i, file[i]);
    }
  }

  async loadEatch(id, file) {
    await this.root
      .querySelector(".parea")
      .insertAdjacentHTML("beforeend", Upload.entryHtml(id, file));
    this.load(id, file);
  }

  load(id, file) {
    const fread = new FileReader();
    fread.readAsArrayBuffer(file);
    fread.onload = async (ev) => {
      const CHANK_SIZE = 1000;
      const chankCount = ev.target.result.byteLength / CHANK_SIZE;
      const filename = file.name;
      const fname = file.name.split(".");
      const newname = Math.random() * 100 + "." + fname[fname.length - 1];

      for (let chankId = 0; chankId < chankCount; chankId++) {
        const chauk = ev.target.result.slice(
          chankId * CHANK_SIZE,
          chankId * CHANK_SIZE + CHANK_SIZE
        );

        await fetch("http://localhost:3000/upload", {
          method: "POST",
          headers: {
            "content-type": "application/octec-stream",
            "content-length": chauk.length,
            "file-name": newname,
          },
          body: chauk,
        });

        let fileLoaded = Math.round((chankId * 100) / chankCount, 0);

        let payload = {
          id,
          status: "...",
          fileLoaded,
        };

        this.updateEntry(payload);
      }
      let payload = {
        id,
        status: "<i class='fas fa-check'></i>",
        fileLoaded: 100,
      };

      this.updateEntry(payload);
    };
  }
}
