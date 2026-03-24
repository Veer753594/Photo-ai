app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const bgColor = req.body.bg === "blue" ? "#87CEEB" : "#ffffff";

    // ✅ REMOVE BG API CALL
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

    // ✅ IMAGE PROCESSING
    await sharp("no-bg.png")
      .resize(413, 531, { fit: "cover", position: "centre" })
      .flatten({ background: bgColor })
      .jpeg({ quality: 95 })
      .toFile("final.jpg");

    // ✅ SEND IMAGE CORRECTLY
    res.sendFile(__dirname + "/final.jpg");

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Processing failed");
  }
});
