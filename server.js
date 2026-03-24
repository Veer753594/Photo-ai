const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const sharp = require("sharp");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const bgColor = req.body.bg === "blue" ? "#87CEEB" : "#ffffff";

    // remove bg
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_KEY
        },
        responseType: "arraybuffer"
      }
    );

    fs.writeFileSync("no-bg.png", response.data);

    // processing
    await sharp("no-bg.png")
      .resize(413, 531, { fit: "cover", position: "centre" })
      .flatten({ background: bgColor })
      .modulate({
        brightness: 1.1,
        saturation: 1.1
      })
      .sharpen()
      .jpeg({ quality: 95 })
      .toFile("final.jpg");

    res.download("final.jpg");

  } catch (err) {
    console.log(err);
    res.send("Error processing image");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running");
});
