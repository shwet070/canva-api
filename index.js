// index.js
import express from "express";

const app = express();
app.use(express.json());

// Utility random picker
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate T-shirt idea
function generateIdeaObject() {
  const adjectives = ["Moonlight", "Neon", "Crimson", "Void", "Kitsune", "Ghost", "Thunder", "Solar"];
  const nouns = ["Samurai", "Ronin", "Spirit", "Guardian", "Shadow", "Blossom", "Rebel", "Rider"];
  const styles = [
    "cyberpunk anime",
    "vaporwave anime",
    "traditional ukiyo-e anime",
    "grunge anime",
    "chibi anime",
    "high-contrast anime poster"
  ];
  const colors = [
    "neon purple, electric blue, black",
    "crimson and gold",
    "pastel pink and mint",
    "monochrome black & white"
  ];
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
  const artworkConcept = `A ${pick(styles)} illustration: ${title} — ${pick(poses)}, colors: ${pick(colors)}. Bold, high-contrast, cinematic lighting, perfect for T-shirt print.`;

  return {
    title,
    artworkConcept,
    quote: pick(taglines)
  };
}

// Pollinations Image Generator
async function callPollinationsImage(prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024`;

  return url; // Pollinations returns a direct image URL
}

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Anime T-shirt API (Pollinations Version) running." });
});

// Main endpoint
app.all("/generate", async (req, res) => {
  try {
    const idea = generateIdeaObject();
    const imgUrl = await callPollinationsImage(idea.artworkConcept);

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

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
