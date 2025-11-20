import express from "express";
import dotenv from "dotenv";

dotenv.config();

// Dynamic fetch import (no node-fetch install needed)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Your API is live!" });
});

// Fake create-design endpoint (temporary until SD is added)
app.post("/create-design", async (req, res) => {
  try {
    const prompt = req.body.prompt || "anime character design";

    // Fake API response for now
    res.status(200).json({
      success: true,
      message: "Stable Diffusion request received",
      prompt: prompt,
      exampleImageUrl: "https://via.placeholder.com/512"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
