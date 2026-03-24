async function upload() {
  let file = document.getElementById("file").files[0];
  let bg = document.getElementById("bg").value;

  if (!file) {
    alert("Please select image");
    return;
  }

  let formData = new FormData();
  formData.append("image", file);
  formData.append("bg", bg);

  document.getElementById("status").innerText = "Processing... ⏳";

  let res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  let blob = await res.blob();
  let url = URL.createObjectURL(blob);

  document.getElementById("status").innerText = "Done ✅";

  document.getElementById("preview").innerHTML = `
    <img src="${url}">
    <br>
    <a href="${url}" download="passport.jpg">⬇ Download</a>
  `;
}
