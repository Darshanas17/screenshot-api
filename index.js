import express from "express";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Screenshot API Home Page");
});

app.get("/screenshot", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("❌ URL is required");

  try {
    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: (await chrome.executablePath) || null,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot({ type: "png" });

    await browser.close();

    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (err) {
    console.error("❌ Screenshot failed:", err.message);
    res.status(500).send("❌ Screenshot failed: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Screenshot API running on http://localhost:${PORT}`);
});
