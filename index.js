import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

app.post("/create-design", (req, res) => {
  const prompt = req.body.prompt || "anime t-shirt design";
  res.json({
    success: true,
    prompt,
    note: "Stable Diffusion not connected yet"
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
