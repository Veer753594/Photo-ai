const express = require("express");
const path = require("path");

const app = express();

// ✅ Static folder serve
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route fix
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Health check route (important for Railway)
app.get("/health", (req, res) => {
  res.send("OK");
});

// ✅ PORT fix (VERY IMPORTANT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
