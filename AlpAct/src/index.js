const { app } = require('@azure/functions');
const { chromium } = require('playwright'); // si tu utilises Playwright

app.setup({ enableHttpStream: true }); // optionnel

app.http('render', {
  methods: ['POST'],
  authLevel: 'function',          // "anonymous" si tu veux tester sans clé
  route: 'render',
  handler: async (request, context) => {
    const body = await request.json();
    const {
      html, width = 390, height = 844,
      type = 'png', fullPage = false, timeoutMs = 15000
    } = body || {};
    if (!html) return { status: 400, jsonBody: { ok: false, error: "Missing 'html'" } };

    const browser = await chromium.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.setContent(html, { waitUntil: 'networkidle', timeout: timeoutMs });
    const buf = await page.screenshot({ type, fullPage });
    await browser.close();

    return {
      status: 200,
      headers: { 'content-type': 'application/json' },
      jsonBody: {
        ok: true,
        mime: type === 'jpeg' ? 'image/jpeg' : 'image/png',
        base64: buf.toString('base64'),
        width, height
      }
    };
  }
});
