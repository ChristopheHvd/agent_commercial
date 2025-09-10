import { chromium } from "playwright";

export default async function (context, req) {
  try {
    const {
      html,
      width = 390,
      height = 844,
      scale = 2,
      type = "png",      // "png" | "jpeg"
      fullPage = false,
      timeoutMs = 15000
    } = req.body || {};

    if (!html) {
      context.res = { status: 400, jsonBody: { ok: false, error: "Missing 'html'" } };
      return;
    }

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // safe on serverless
    });
    const page = await browser.newPage();

    await page.setViewportSize({ width, height });
    await page.setContent(html, { waitUntil: "networkidle", timeout: timeoutMs });

    const buf = await page.screenshot({ type, fullPage });
    await browser.close();

    context.res = {
      status: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: true,
        mime: type === "jpeg" ? "image/jpeg" : "image/png",
        base64: buf.toString("base64"),
        width, height, scale
      })
    };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, jsonBody: { ok: false, error: String(e) } };
  }
}
