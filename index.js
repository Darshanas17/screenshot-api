import express from "express";
import puppeteer from "puppeteer";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(
    "✅ Screenshot API running. Use /screenshot?url=https://example.com"
  );
});

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("❌ Missing ?url= query");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const image = await page.screenshot({ type: "png" });

    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (err) {
    console.error("Screenshot error:", err);
    res.status(500).send("❌ Failed to capture screenshot");
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(port, () => {
  console.log(`🚀 Screenshot API running on port ${port}`);
});
