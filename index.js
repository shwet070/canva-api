import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Your Canva API is live!" });
});

app.post("/create-design", async (req, res) => {
  try {
    const CANVA_TOKEN = process.env.CANVA_TOKEN;

    const response = await fetch("https://api.canva.com/rest/v1/designs", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + CANVA_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: req.body.name || "Untitled Design",
        width: req.body.width || 1080,
        height: req.body.height || 1080,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// required on render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
