// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allow only your frontend's origin
app.use(cors({
  origin: "https://flamesv2.vercel.app",
  credentials: true
}));

app.use(express.json({ limit: "10mb" })); // For base64 image

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Schemas
const permissionSchema = new mongoose.Schema({
  image: String,
  time: String,
}, { timestamps: true });

const resultSchema = new mongoose.Schema({
  name1: String,
  name2: String,
  result: String,
}, { timestamps: true });

const Permission = mongoose.model("Permission", permissionSchema);
const FlamesResult = mongoose.model("FlamesResult", resultSchema);

// ✅ Routes
app.post("/api/save-photo", async (req, res) => {
  try {
    const { image } = req.body;
    const entry = new Permission({ image, time: new Date().toISOString() });
    await entry.save();
    res.status(200).json({ success: true, message: "Image saved" });
  } catch (err) {
    console.error("Image save error:", err);
    res.status(500).json({ success: false, error: "Failed to save image" });
  }
});

app.post("/api/save-result", async (req, res) => {
  try {
    const { name1, name2, result } = req.body;
    const entry = new FlamesResult({ name1, name2, result });
    await entry.save();
    res.status(200).json({ success: true, message: "Result saved" });
  } catch (err) {
    console.error("Result save error:", err);
    res.status(500).json({ success: false, error: "Failed to save result" });
  }
});

app.get("/api/photos", async (req, res) => {
  try {
    const entries = await Permission.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photo data" });
  }
});

app.get("/api/results", async (req, res) => {
  try {
    const results = await FlamesResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
