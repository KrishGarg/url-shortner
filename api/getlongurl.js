import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(404).end();
    }

    if (!req.body.shortURL) {
      return res.status(400).json({
        message: "There was no short url code in the received request.",
        error: true,
      });
    }

    const doc = await prisma.shorturls.findFirst({
      where: {
        shortURL: req.body.shortURL,
      },
    });

    if (!doc) {
      return res.status(404).json({
        message: "There was no record for the given short code.",
        error: true,
      });
    }

    const updatedDoc = await prisma.shorturls.update({
      where: {
        id: doc.id,
      },
      data: {
        uses: {
          increment: 1,
        },
      },
    });

    return res.status(200).json({
      ...updatedDoc,
      message: "The data was found successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "There was some issue in the backend.",
      error: true,
    });
  }
}
