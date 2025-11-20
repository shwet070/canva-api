import express from "express";

const app = express();
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Create-design route
app.post("/create-design", (req, res) => {
  res.json({
    success: true,
    message: "Design API route is working.",
    received: req.body
  });
});

// Server listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
