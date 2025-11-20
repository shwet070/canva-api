import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Stable Diffusion Anime API is live!" });
});

app.post("/create-design", async (req, res) => {
  try {
    const API_KEY = process.env.STABLE_API_KEY;

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: req.body.prompt || "anime character t-shirt design",
          aspect_ratio: "1:1", // perfect for T-shirts
          output_format: "png"
        })
      }
    );

    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
