async function uploadToImgur(base64) {
  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

  const url = "https://api.imgur.com/3/image";
  const body = new FormData();
  body.append("image", base64.replace(/^data:image\/png;base64,/, ""));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
    },
    body
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error("Imgur upload failed: " + JSON.stringify(data));
  }

  return data.data.link; // <-- This is the image_url
}
