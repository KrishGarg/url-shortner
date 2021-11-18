export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400);
  }

  res.status(200).json({
    shortURL: "testing",
  });
}
