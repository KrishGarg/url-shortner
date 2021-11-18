export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).end();
  }

  res.status(200).json({
    shortURL: "testing",
  });
}
