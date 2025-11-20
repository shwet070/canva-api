import express from "express";

// Dynamic fetch import
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(express.json());

// Homepage route
app.get("/", (req, res) => {
  res.json({ message: "Your API is live!" });
});

// ⬇️ Paste the create-design route HERE
app.post("/create-design", async (req, res) => {
  try {
    const prompt = req.body.prompt || "anime character design";

    const response = await fetch(
      "https://stablediffusionapi.com/api/v3/text2img",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: "freekey",
          prompt: prompt,
          width: "512",
          height: "512",
          samples: 1,
          guidance_scale: 7.5
        })
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
