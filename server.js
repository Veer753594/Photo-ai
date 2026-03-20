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
    const imagePath = req.file.path;

    // 🔹 Step 1: Remove Background
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath));

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    fs.writeFileSync("no-bg.png", response.data);

    // 🔹 Step 2: Passport size + white background
    await sharp("no-bg.png")
      .resize(413, 531)
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 95 })
      .toFile("final.jpg");

    res.download("final.jpg");

  } catch (error) {
    console.error(error);
    res.send("Error processing image");
  }
});

app.listen(3000, () => console.log("Server running"));