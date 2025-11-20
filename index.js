app.post("/create-design", (req, res) => {
  res.json({
    id: "fake-design-" + Math.floor(Math.random() * 999999),
    name: req.body.name,
    width: req.body.width,
    height: req.body.height,
    status: "Mock design generated successfully"
  });
});
