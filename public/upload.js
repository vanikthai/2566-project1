const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.querySelector(".uploaded-area");
////////////////////////////////////////////////////////////////////////

// form click event
form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = async ({ target }) => {
  let file = target.files; //getting file [0] this means if user has selected multiple files then get first one only
  for (var i = 0; i < file.length; i++) {
    await uploadFile(file[i]); //calling uploadFile with passing file name as an argument
  }
};

// file upload function
function uploadFile(file) {
  const fread = new FileReader();
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
      let progressHTML = `<li class="row">
                      <i class="fas fa-file-alt"></i>
                      <div class="content">
                        <div class="details">
                          <span class="name">${filename} • process</span>
                          <span class="percent">${fileLoaded}%</span>
                        </div>
                        <div class="progress-bar">
                          <div class="progress" style="width: ${fileLoaded}%"></div>
                        </div>
                      </div>
                    </li>`;
      uploadedArea.classList.add("onprogress");
      progressArea.innerHTML = progressHTML;
    }
    progressArea.innerHTML = "";
    let uploadedHTML = `<li class="row">
                        <div class="content upload">
                          <i class="fas fa-file-alt"></i>
                          <div class="details">
                            <span class="name">${filename} • Uploaded</span>
                            <span class="size">${chankCount}</span>
                          </div>
                        </div>
                        <i class="fas fa-check"></i>
                      </li>`;
    uploadedArea.classList.remove("onprogress");
    uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
  };

  fread.readAsArrayBuffer(file);
}
