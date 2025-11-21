// index.js
import express from "express";

const app = express();
app.use(express.json());

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

// Utility pick function
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate idea
function generateIdeaObject() {
  const adjectives = ["Moonlight", "Neon", "Crimson", "Void", "Kitsune", "Ghost", "Thunder", "Solar"];
  const nouns = ["Samurai", "Ronin", "Spirit", "Guardian", "Shadow", "Blossom", "Rebel", "Rider"];
  const styles = ["cyberpunk anime", "vaporwave anime", "traditional ukiyo-e anime", "grunge anime", "chibi anime", "high-contrast anime poster"];
  const colors = ["neon purple, electric blue, black", "crimson and gold", "pastel pink and mint", "monochrome black & white"];
  const poses = [
    "silhouette standing on a rooftop under rain",
    "back turned holding a katana with wind-swept hair",
    "dynamic jump with hair and coat flowing",
    "calm seated pose beneath cherry blossoms"
  ];
  const taglines = [
    "Protect Your Light",
    "Fight for the Dawn",
    "Stay Wild, Stay True",
    "Blade of the Neon Moon",
    "Dream Loud"
  ];

  const title = `${pick(adjectives)} ${pick(nouns)}`;
  const artworkConcept = `A ${pick(styles)} illustration: ${title} — ${pick(poses)}, colors: ${pick(colors)}. Bold, high-contrast, suitable for a T-shirt print.`;

  return {
    title,
    artworkConcept,
    quote: pick(taglines)
  };
}

// Stability AI generator
async function callStabilityImage(prompt) {
  const endpoint = `https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image`;

  const payload = {
    text_prompts: [{ text: prompt }],
    cfg_scale: 7,
    clip_guidance_preset: "FAST_BLUE",
    height: 1024,
    width: 1024,
    samples: 1,
    steps: 28
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STABILITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!data.artifacts || !data.artifacts[0]?.base64) {
    throw new Error("Stability API returned invalid image data");
  }

  return data.artifacts[0].base64;
}

// Upload image to Imgur
async function uploadToImgur(base64) {
  const form = new FormData();
  form.append("image", base64);

  const res = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` },
    body: form
  });

  const data = await res.json();

  if (!data.success) throw new Error("Imgur upload failed.");

  return data.data.link;
}

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Anime T-shirt API running." });
});

// Main endpoint
app.all("/generate", async (req, res) => {
  try {
    const idea = generateIdeaObject();

    if (!STABILITY_API_KEY)
      return res.status(500).json({ error: "Missing STABILITY_API_KEY" });

    if (!IMGUR_CLIENT_ID)
      return res.status(500).json({ error: "Missing IMGUR_CLIENT_ID" });

    const b64 = await callStabilityImage(idea.artworkConcept);
    const imgUrl = await uploadToImgur(b64);

    res.json({
      title: idea.title,
      artworkConcept: idea.artworkConcept,
      quote: idea.quote,
      image_url: imgUrl
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server start
app.listen(3000, () => console.log("Server running on port 3000"));
