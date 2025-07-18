import express from "express";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const app = express();
const port = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send(
    "✅ Screenshot API is live. Use /screenshot?url=https://example.com"
  );
});

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url)
    return res
      .status(400)
      .send("❌ Please provide a URL like ?url=https://example.com");

  let browser = null;
  try {
    const executablePath = await chromium.executablePath;

    if (!executablePath) {
      throw new Error("Chrome executable not found");
    }

    browser = await puppeteer.launch({
      executablePath,
      headless: chromium.headless,
      args: chromium.args,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const buffer = await page.screenshot({ type: "png" });

    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (error) {
    console.error("Screenshot error:", error);
    res.status(500).send(`❌ Screenshot failed: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(port, () => {
  console.log(`🚀 Screenshot API running on port ${port}`);
});
