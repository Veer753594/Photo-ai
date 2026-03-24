async function upload() {
  let file = document.getElementById("file").files[0];
  let bg = document.getElementById("bg").value;

  let formData = new FormData();
  formData.append("image", file);
  formData.append("bg", bg);

  document.getElementById("status").innerText = "Processing...";

  let res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  // 👇 IMPORTANT DEBUG
  if (!res.ok) {
    let text = await res.text();
    alert("Error: " + text);
    return;
  }

  let blob = await res.blob();
  let url = URL.createObjectURL(blob);

  document.getElementById("preview").innerHTML =
    `<img src="${url}" style="width:200px"/>`;

  document.getElementById("status").innerText = "Done ✅";
}
