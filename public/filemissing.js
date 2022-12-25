const files = JSON.parse(document.getElementById("filesdel").dataset.file);

var x = document.getElementById("mySelect");

files.forEach((file) => {
  var option = document.createElement("option");
  option.text = file.delete;
  x.add(option);
});

document.getElementById("filesdel").innerHTML = `
<div class="alert alert-success" role="alert">
  total ${files.length} files deleted
  <a href="/main" class="link-primary">Main</a>
</div>
`;
