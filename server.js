const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    // ✅ SIMPLE PROCESS (NO API)
    await sharp(req.file.path)
      .resize(413, 531)
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 90 })
      .toFile("final.jpg");

    res.sendFile(path.join(__dirname, "final.jpg"));

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running");
});
