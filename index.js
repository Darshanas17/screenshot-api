import express from "express";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("URL parameter is required");

  let browser = null;

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const screenshotBuffer = await page.screenshot({ type: "png" });

    res.set("Content-Type", "image/png");
    res.send(screenshotBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error capturing screenshot");
  } finally {
    if (browser !== null) await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Screenshot API running on port ${port}`);
});
