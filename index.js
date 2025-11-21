async function callStabilityImage(prompt) {
  const endpoint = "https://api.stability.ai/v2beta/stable-image/generate/sd3.5-large-turbo";

  const payload = {
    prompt: prompt,
    output_format: "png"
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STABILITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();

  // Try to parse JSON safely
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error("Stability returned non-JSON: " + text.slice(0, 200));
  }

  if (!data.image_base64) {
    throw new Error("No image returned: " + JSON.stringify(data));
  }

  return data.image_base64;
}
