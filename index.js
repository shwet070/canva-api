import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Your Canva API is live!" });
});

// Needed for render.com
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
