import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Your API is live!" });
});

// Create design endpoint (Stable Diffusion request)
app.post("/create-design", async (req, res) => {
  try {
    const prompt = req.body.prompt || "anime girl character design";

    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/ultra", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "application/json"
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    const result = await response.json();
    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
