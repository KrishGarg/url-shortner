import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { isUri } from "valid-url";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(404).end();
    }

    if (!req.body.longURL) {
      return res.status(400).json({
        message: "There was no url in the received request.",
        error: true,
      });
    }

    if (!isUri(req.body.longURL)) {
      return res.status(400).json({
        message: "The url is not a valid url.",
        error: true,
      });
    }

    const longURL = req.body.longURL;
    let id = nanoid(6);
    let oldData = await prisma.shorturls.findFirst({
      where: {
        shortURL: id,
      },
    });

    while (oldData) {
      id = nanoid(6);
      oldData = await prisma.shorturls.findFirst({
        where: {
          shortURL: id,
        },
      });
    }

    const doc = await prisma.shorturls.create({
      data: {
        longURL: longURL,
        shortURL: id,
      },
    });

    res.status(200).json({
      ...doc,
      message: "Successfully registered the url in the database.",
      error: false,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "There was some issue in the backend.",
      error: true,
    });
  }
}
