const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
