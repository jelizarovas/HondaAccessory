const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;
const PUBLIC_DIR = path.join(__dirname, "..", "public");

app.use(bodyParser.json());

app.get("/api/accessories", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf-8");
  res.json(JSON.parse(data));
});

app.post("/api/accessories", (req, res) => {
  const newData = req.body;
  fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(newData, null, 2));
  res.json({ success: true });
});

app.get("/test", (req, res) => {
  res.send("Server received the request!");
});

app.get("/api/accessories/:year/:model", (req, res) => {
  const { year, model } = req.params;
  const filePath = path.join(__dirname, "..", "public", "vehicles", year, model, "accessories.json");

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

app.post("/api/save-trims", (req, res) => {
  // const data = JSON.stringify(req.body, null, 2);
  const { data, filename } = req.body;
  const timestamp = Date.now();
  console.log({ PUBLIC_DIR });
  const dirPath = path.join(PUBLIC_DIR, "vehicles", "2024", "cr-v");
  const filePath = path.join(dirPath, `trims ${timestamp}.json`);

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to the file:", err);
      res.status(500).send("Failed to update the file.");
      return;
    }

    res.send("File saved successfully.");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
