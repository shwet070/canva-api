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
