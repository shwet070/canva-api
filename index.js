// index.js
import express from "express";

const app = express();
app.use(express.json());

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
if (!STABILITY_API_KEY) {
  console.warn("WARNING: STABILITY_API_KEY not set in environment variables.");
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIdeaObject() {
  // lightweight local idea generator (no LLM required)
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

  const adj = pick(adjectives);
  const noun = pick(nouns);
  const title = `${adj} ${noun}`;
  const style = pick(styles);
  const color = pick(colors);
  const pose = pick(poses);
  const tagline = pick(taglines);

  const artworkConcept = `A ${style} illustration: ${title} — ${pose}, colors: ${color}. Make it bold, high-contrast, cinematic lighting, suitable for a T-shirt print. No watermarks, single character focal point, 1–2 color accents, clear silhouette.`;

  return {
    title,
    artworkConcept,
    quote: tagline
  };
}

async function callStabilityImage(prompt, opts = {}) {
  // default model and params - change model if needed
  const model = opts.model || "stable-diffusion-v1-5";
  const width = opts.width || 1024;
  const height = opts.height || 1024;
  const steps = opts.steps || 30;

  const endpoint = `https://api.stability.ai/v1/generation/${model}/text-to-image`;

  const payload = {
    text_prompts: [
      {
        text: prompt
      }
    ],
    cfg_scale: 7,
    clip_guidance_preset: "FAST_BLUE",
    height,
    width,
    samples: 1,
    steps
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STABILITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    timeout: 120000
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Stability API error ${res.status}: ${txt}`);
  }

  const data = await res.json();

  // Stability responses differ across API versions — attempt multiple common fields
  // 1) Some responses have `artifacts[0].base64` or `artifacts[0].b64_json`
  if (data.artifacts && data.artifacts[0]) {
    const art = data.artifacts[0];
    const b64 = art.base64 || art.b64_json || art.base64_image || art.b64;
    if (b64) {
      return b64;
    }
  }

  // 2) Some versions return an array in `output` or `images`
  if (data.output && data.output[0] && (data.output[0].b64_json || data.output[0].base64)) {
    return data.output[0].b64_json || data.output[0].base64;
  }
  if (data.images && data.images[0] && data.images[0].b64_json) {
    return data.images[0].b64_json;
  }

  // 3) If nothing found, stringify returned data for debugging
  throw new Error("No base64 image found in Stability response: " + JSON.stringify(data).slice(0, 1000));
}

app.get("/", (req, res) => {
  res.json({ message: "Canva API (anime T-shirt generator) running." });
});

// main endpoint: POST or GET /generate
app.all("/generate", async (req, res) => {
  try {
    const idea = generateIdeaObject();

    if (!STABILITY_API_KEY) {
      return res.status(500).json({
        error: "STABILITY_API_KEY is not configured in the environment on the server."
      });
    }

    // Call Stability to generate image
    const b64 = await callStabilityImage(idea.artworkConcept, { model: "stable-diffusion-v1-5", width: 1024, height: 1024, steps: 28 });

    // Build data URI
    const image_base64 = `data:image/png;base64,${b64}`;

    res.json({
      title: idea.title,
      artworkConcept: idea.artworkConcept,
      quote: idea.quote,
      image_base64
    });
  } catch (err) {
    console.error("Error /generate:", err);
    res.status(500).json({ error: "Generation failed", detail: err.message });
  }
});

// start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
