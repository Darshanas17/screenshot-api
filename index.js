app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url)
    return res
      .status(400)
      .send("❌ Please provide a URL like ?url=https://example.com");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
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
