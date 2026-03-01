import express from "express";
import Url from "../models/Url.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ err: "Url is required" });
    }
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ err: "Invalid URL" });
    }

    let shortId;
    let exists = true;
    while (exists) {
      shortId = nanoid(7);
      exists = await Url.findOne({ shortId });
    }

    const url = await Url.create({
      shortId,
      originalUrl,
    });

    res.json({
      shortId: url.shortId,
      shortUrl: `${process.env.BASE_URL}/${url.shortId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "server error" });
  }
});

router.get("/shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });
    if (!url) return res.status(404).json({ err: "URL is not found" });

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "server error" });
  }
});

export default router;
